<template>
  <el-upload
    :disabled="disabled"
    :action="action"
    :headers="headers"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
    :on-error="handleError"
    :limit="!multiple ? 0 : limit"
    list-type="picture-card"
    :show-file-list="multiple"
    :on-exceed="handleExceed"
    :file-list="fileList"
    :before-upload="onBeforeUpload"
    accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PNG,.GIF,.BMP"
  >
    <el-image v-if="!multiple && fileList.length > 0" :src="fileList[0].url" class="avatar" />
    <i v-else class="el-icon-plus"></i>
  </el-upload>
</template>
<script>
import store from "@/store";
import { getFileMimeType } from "@/util/file"
export default {
  props: {
    value: {
      type: [Array, String],
      required: true,
    },
    limit: {
      type: Number,
      default: 1,
    },
    action: {
      type: String,
      default: `/api/admin/sys_file/oss/upload`,
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      headers: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      fileList: []
    };
  },
  computed: {
    multiple() {
      return this.limit > 1
    }
  },
  created () {
    let fileList = []
    if (this.multiple) {
      for (let i = 0; i < this.value.length; i++) {
        fileList.push({
          url: this.value[i]
        })
      }
      this.fileList = fileList
    } else if (this.value) {
      this.fileList = [{url: this.value}]
    }
  },
  watch: {
    value (val) {
      if (val) {
        let fileList = []
        if (this.multiple) {
          for (let i = 0; i < val.length; i++) {
            fileList.push({
              url: val[i]
            })
          }
          this.fileList = fileList
        } else {
          this.fileList = [{url: val}]
        }
      } else {
        this.fileList = []
      }
    }
  },
  methods: {
    dataMatch (fileList, dataList) {
      if (fileList.length != dataList.length) {
        return false
      } else {
        for (let i = 0; i < fileList.length; i++) {
          if (!dataList.includes(fileList[i].url)) {
            return false
          }
        }
        return true
      }
    },
    onBeforeUpload(file) {
      return new Promise((resolve, reject) => {
        getFileMimeType(file).then(res => {
          if (res) {
            const isLt1M = file.size / 1024 / 1024 < 100;
            if (!isLt1M) {
              this.$message.warning("上传文件大小不能超过 100MB!");
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
    handleError() {
      this.$message.error("错了哦，请检查文件服务器");
    },
    handleSuccess(res, file) {
      if (res.code) {
        if (!res.data) {
          if (res.msg) {
            this.$message.error(res.msg);
          } else {
            this.$message.error("错了哦，请检查文件服务器");
          }
        } else {
          this.$message.error(res.msg);
        }
        if (this.multiple) {
          this.$emit("input", [])
          this.$emit("change", [])
        } else {
          this.$emit("input", '')
          this.$emit("change", '')
        }
      } else {
        const url = res.data.data.url;
        if (this.multiple) {
          this.$emit("input", [...this.value, url])
          this.$emit("change", [...this.value, url])
        } else {
          this.fileList = [{url}]
          this.$emit("input", url)
          this.$emit("change", url)
        }
        this.$message.success("上传成功");
      }
    },
    handleRemove(res) {
      let tempData = [...this.value]
      let url = ''
      if (res.response) {
        url = res.response.data.data.url
      } else {
        url = res.url
      }
      tempData.splice(tempData.indexOf(url), 1)
      this.$emit("input", tempData)
      this.$emit("change", tempData)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`,
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.avatar {
  height: 100%;
  width: 100%;
  margin: 0;
}
</style>
