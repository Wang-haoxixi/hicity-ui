<template>
  <el-upload
    :action="action"
    :headers="headers"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
    :on-error="handleError"
    :limit="limit"
    list-type="picture-card"
    :on-exceed="handleExceed"
    :file-list="fileList"
    :before-upload="onBeforeUpload"
  >
    <i class="el-icon-plus"></i>
  </el-upload>
</template>
<script>
import store from "@/store";
export default {
  props: {
    value: {
      type: Array,
      required: true,
    },
    limit: {
      type: Number,
      default: 1,
    },
    action: {
      type: String,
      default: `/api/admin/sys-file/oss/upload`,
    },
  },
  data() {
    return {
      headers: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      fileList: []
    };
  },
  created () {
    let fileList = []
    for (let i = 0; i < this.value.length; i++) {
      fileList.push({
        url: this.value[i]
      })
    }
    this.fileList = fileList
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
      if (!file.type) {
        this.$message.error("无法上传无类型文件！");
        return false;
      }
      const isLt1M = file.size / 1024 / 1024 < 100;
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 100MB!");
      }
      return isLt1M;
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
        this.$emit("input", []);
      } else {
        const url = res.data.data.url;
        this.$emit("input", [...this.value, url])
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
</style>
