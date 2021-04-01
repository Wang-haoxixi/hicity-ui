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
      <div v-if="file.type == 'formal'" style="height: 40px;text-align: center;">
        <el-button v-if="!file.ifMaster" type="primary" size="mini" @click.stop="setMaster(index)">设为主图</el-button>
        <span v-else>主图</span>
      </div>
    </div>
    <file-upload ref="fileUpload"
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
import FileUpload from './FileUpload/index'
import { getFileMimeType } from "@/util/file"

export default {
  components: { FileUpload },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    initData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      fileList: [],
      cacheFileList: {}
    }
  },
  created () {
    this.fileList = this.initData
  },
  watch: {
    initData (val) {
      this.fileList = val
    }
  },
  methods: {
    onBeforeUpload(file) {
      return new Promise((resolve, reject) => {
        getFileMimeType(file).then(res => {
          if (res) {
            const isLt1M = file.size / 1024 / 1024 < 50;
            if (!isLt1M) {
              this.$message.warning("上传文件大小不能超过 50MB!");
              reject()
            } else {
              resolve(true)
            }
          } else {
            this.$message.warning("暂不支持该文件类型！");
            reject();
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
      for (let i = 0; i < fileList.length; i++) {
        if (uuid === fileList[i].uuid) {
          fileList.splice(i, 1, {
            name,
            url: file.url,
            type: 'formal'
          })
        }
      }
    },
    fileChangeBack (uuid) {
      let fileList = this.fileList
      for (let i = 0; i < fileList.length; i++) {
        if (uuid === fileList[i].uuid) {
          if (this.cacheFileList.uuid) {
            fileList.splice(i, 1, this.cacheFileList.uuid)
            delete this.cacheFileList.uuid
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
      this.cacheFileList.uuid = uuid
      this.fileList.splice(index, 1, {
        ...file,
        uuid
      })
      this.$refs.fileUpload.changeFile(uuid)
    },
    removeFile (index) {
      this.fileList.splice(index, 1)
    },
    setMaster (index) {
      for (let i = 0; i < this.fileList.length; i++) {
        if (index === i) {
          this.fileList.splice(i, 1, {
            ...this.fileList[i],
            ifMaster: 1
          })
        } else {
          this.fileList.splice(i, 1, {
            ...this.fileList[i],
            ifMaster: 0
          })
        }
      }
    }
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