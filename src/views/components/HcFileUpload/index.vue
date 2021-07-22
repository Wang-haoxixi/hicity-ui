<template>
  <div class="hc-upload-file-container">
    <file-upload
      ref="fileUpload"
      v-show="!single || fileList.length === 0"
      @file-add="fileAddTemp"
      @file-change="fileChangeTemp"
      @upload-success="fileChangeFormal"
      @upload-error="fileRemove"
      @change-success="fileChangeFormal"
      @change-error="fileChangeBack">
      <template v-slot:trigger>
        <slot name="trigger"></slot>
      </template>
    </file-upload>
    <div>
      <div v-for="(file, index) in fileList" :key="index" class="file-item">
        <i v-if="file.type == 'formal'" class="el-icon-document icon"></i>
        <i v-else class="el-icon-upload2 icon"></i>
        <a class="name" :href="file.url">{{file.name}}</a>
        <div class="options">
          <template v-if="file.type == 'formal'">
            <i v-if="file.type == 'formal'" class="el-icon-refresh" @click="changeFile(file, index)"></i>
            <i v-if="file.type == 'formal'" class="el-icon-close" style="margin-left: 10px;" @click="removeFile(index)"></i>
          </template>
          <template v-else>
            <i v-if="file.type == 'formal'" class="el-icon-close" @click="removeFile(index)"></i>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import FileUpload from '@/views/components/HcFileUpload/FileUpload/index.vue'
import { getFileMimeType } from "@/util/file"

export default {
  components: { FileUpload },
  props: {
    disabled: {
      type: Boolean,
      default: false
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
    },
    topTip: {
      type: String,
      default: ''
    },
    bottomTip: {
      type: String,
      default: ''
    },
    multipleChoice: {
      type: Boolean,
      default: false
    },
    fileSize: {
      type: Number,
      default: 50
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
  methods: {
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
    },
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
                const isLt1M = file.size / 1024 / 1024 < this.fileSize;
                if (!isLt1M) {
                  this.$message.warning(`上传文件大小不能超过${this.fileSize}MB!`)
                  resolve({
                    type: 'error',
                    index: i,
                    message: `上传文件大小不能超过${this.fileSize}MB!`
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
.hc-upload-file-container {
  .file-item {
    height: 36px;
    display: flex;
    align-items: center;
    overflow: hidden;
    cursor: pointer;
    &:not(:first-child) {
      margin-top: 10px;
    }
    .icon {
      margin-right: 10px;
    }
    .name {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .options {
      margin-left: 10px;
      display: inline;
    }
  }
}
</style>
