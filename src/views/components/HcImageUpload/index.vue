<template>
  <div class="hc-upload-image-container">
    <div v-for="(file, index) in fileList" :key="index" class="image-box upload">
      <div class="image-box-content">
        <img v-if="file.type == 'formal'" class="image-box-content-image" fit="fill" :src="file.url"/>
        <el-progress v-if="file.type == 'temp'" type="circle" :percentage="0"></el-progress>
        <div v-if="!disabled" class="image-box-cotent-shadow" @click.stop="">
          <i class="el-icon-refresh" @click="changeFile(file, index)"></i>
          <i class="el-icon-delete" @click="removeFile(index)"></i>
        </div>
      </div>
    </div>
    <file-upload 
      v-show="!single || fileList.length == 0"
      ref="fileUpload"
      key="fileUpload"
      @file-add="fileAddTemp"
      @file-change="fileChangeTemp"
      @upload-success="fileChangeFormal"
      @upload-error="fileRemove"
      @change-success="fileChangeFormal"
      @change-error="fileChangeBack"
      accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PNG,.GIF,.BMP"
      :before-upload="onBeforeUpload">
      <template v-slot:trigger>
        <div v-if="disabled"></div>
        <div v-else class="image-box">
          <slot>
            <div class="image-box-content">
              <i class="el-icon-plus"></i>
            </div>
          </slot>
        </div>
      </template>
    </file-upload>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import FileUpload from '@/views/components/HcFileUpload/FileUpload/index'
import { getFileMimeType } from "@/util/file"

export default {
  components: { FileUpload },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    initData: {
      type: [String, Array],
      default: null
    },
    value: {
      type: [String, Array],
      default: null
    },
    limit: {
      type: Number,
      default: 9
    },
    single: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      fileList: [],
      cacheFileMap: {}
    }
  },
  created () {
    if (this.single && this.value) {
      this.fileList = [{type: 'formal', url: this.value}]
    } else if (this.value && this.value.length > 0) {
      for (let i = 0; i < this.value.length; i++) {
        this.fileList.push({
          type: 'formal',
          url: this.value[i]
        })
      }
    }
  },
  watch: {
    initData (val) {
      if (this.single && val) {
        this.fileList = [{type: 'formal', url: val}]
      } else if (val && val.length > 0) {
        for (let i = 0; i < val.length; i++) {
          this.fileList.push({
            type: 'formal',
            url: val[i]
          })
        }
      } else {
        this.fileList = []
      }
    }
  },
  methods: {
    onBeforeUpload(files, isChange) {
      let fileList = []
      for (let i = 0; i < files.length; i++) {
        fileList.push(files[i])
      }
      return new Promise((resolve, reject) => {
        let promiseList = []
        for (let i = 0; i < fileList.length; i++) {
          let file = fileList[i]
          let promise = new Promise((resolve, reject) => {
            getFileMimeType(file).then(res => {
              if (res) {
                const isLt1M = file.size / 1024 / 1024 < 50;
                if (!isLt1M) {
                  resolve({
                    type: 'error',
                    index: i,
                    message: '上传文件大小不能超过 50MB!'
                  })
                } else {
                  resolve({
                    type: 'success',
                    index: i
                  })
                }
              } else {
                resolve({
                  type: 'error',
                  index: i,
                  message: '暂不支持该文件类型！'
                })
              }
            })
          })
          promiseList.push(promise)
        }
        Promise.all(promiseList).then((results) => {
          let errorList = []
          let errorObjects = []
          for (let i = 0; i < results.length; i++) {
            if (results[i].type == 'error') {
              errorObjects.push(results[i])
              errorList.push(results[i].index)
            }
          }
          errorList.sort()
          for (let i = errorList.length - 1; i >= 0; i--) {
            fileList.splice(i, 1)
          }
          if (!isChange && fileList.length + this.fileList.length > this.limit) {
            this.$message.warning(`本次选择${fileList.length}张有效图片，共计选择${fileList.length + this.fileList.length}张，已超出限制的${this.limit}张`)
            resolve([])
          } else {
            resolve(fileList)
          }
        })
      })
    },
    fileAddTemp (file) {
      this.fileList.push({
        ...file,
        type: 'temp'
      })
    },
    fileChangeTemp (file) {
      let fileList = this.fileList
      for (let i = 0; i < fileList.length; i++) {
        if (file.uuid === fileList[i].uuid) {
          fileList.splice(i, 1, {
            ...file,
            type: 'temp'
          })
        }
      }
    },
    fileChangeFormal ({uuid, name, file}) {
      let fileList = this.fileList
      let valueList = []
      for (let i = 0; i < fileList.length; i++) {
        if (uuid === fileList[i].uuid) {
          fileList.splice(i, 1, {
            name,
            url: file.url,
            type: 'formal'
          })
          valueList.push(file.url)
          continue
        }
        if (fileList[i].type == 'formal') {
          valueList.push(fileList[i].url)
        }
      }
      if (this.single && valueList.length > 0) {
        this.$emit('input', valueList[0])
        this.$emit('change', valueList[0])
      } else if (valueList.length > 0) {
        this.$emit('input', valueList)
        this.$emit('change', valueList)
      } else if (!this.single) {
        this.$emit('input', [])
        this.$emit('change', [])
      } else {
        this.$emit('input', '')
        this.$emit('change', '')
      }
    },
    fileChangeBack (uuid) {
      let fileList = this.fileList
      for (let i = 0; i < fileList.length; i++) {
        if (uuid === fileList[i].uuid) {
          if (this.cacheFileMap[uuid]) {
            fileList.splice(i, 1, this.cacheFileMap[uuid])
            delete this.cacheFileMap[uuid]
          } else {
            fileList.splice(i, 1)
          }
        }
      }
    },
    fileRemove (uuid) {
      let fileList = this.fileList
      for (let i = 0; i < fileList.length; i++) {
        if (uuid === fileList[i].uuid) {
          fileList.splice(i, 1)
        }
      }
    },
    changeFile (file, index) {
      let uuid = uuidv4()
      this.cacheFileMap[uuid] = file
      this.fileList.splice(index, 1, {
        ...file,
        uuid
      })
      this.$refs.fileUpload.changeFile(uuid)
    },
    removeFile (index) {
      let valueList = []
      let fileList = this.fileList
      fileList.splice(index, 1)
      for (let i = 0; i < fileList.length; i++) {
        let file = fileList[i]
        if (file.type == 'formal') {
          valueList.push(file.url)
        }
      }
      if (this.single && valueList.length > 0) {
        this.$emit('input', valueList[0])
        this.$emit('change', valueList[0])
      } else if (valueList.length > 0) {
        this.$emit('input', valueList)
        this.$emit('change', valueList)
      } else if (!this.single) {
        this.$emit('input', [])
        this.$emit('change', [])
      } else {
        this.$emit('input', '')
        this.$emit('change', '')
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.hc-upload-image-container {
  display: inline-block;
  .image-box {
    display: inline-block;
    width: 148px;
    vertical-align: top;
    &.upload {
      padding: 0 10px 10px 0;
      .image-box-content {
        border-style: solid;
      }
    }
    .image-box-content {
      position: relative;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      border: 1px dashed #c0ccda;
      border-radius: 6px;
      box-sizing: border-box;
      width: 148px;
      height: 148px;
      vertical-align: top;
      text-align: center;
      cursor: pointer;
      outline: 0;
      font-size: 20px;
      color: #8c939d;
      overflow: hidden;
      .image-box-cotent-shadow {
        display: none;
        position: absolute;
        justify-content: center;
        align-items: center;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        color: #ffffff;
        cursor: auto;
        i {
          cursor: pointer;
          &:not(:first-child) {
            margin-left: 10px;
          }
        }
      }
      &:hover {
        .image-box-cotent-shadow {
          display: flex;
        }
      }
      .image-box-content-image {
        height: 146px;
        width: 146px;
      }
    }
  }
}
</style>