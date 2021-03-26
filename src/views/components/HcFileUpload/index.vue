<template>
  <div class="hc-upload-file-container">
    <file-upload ref="fileUpload"
      v-show="fileList.length === 0"
      @file-add="fileAddTemp"
      @file-change="fileChangeTemp"
      @upload-success="fileChangeFormal"
      @upload-error="fileRemove"
      @change-success="fileChangeFormal"
      @change-error="fileChangeBack">
    </file-upload>
    <div>
      <div v-for="(file, index) in fileList" :key="index" class="file-item">
        <i v-if="file.type == 'formal'" class="el-icon-document icon"></i>
        <i v-else class="el-icon-upload2 icon"></i>
        <div class="name">{{file.name}}</div>
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
import FileUpload from './FileUpload/index'

export default {
  components: { FileUpload },
  props: {
    value: {
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
    this.fileList = this.value
  },
  watch: {
    value (val) {
      this.fileList = val
    }
  },
  methods: {
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