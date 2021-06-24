<template>
  <el-dialog
    width="60%"
    title="圈子相册管理"
    :visible.sync="dialogCirclePhotoVisible"
    :close-on-click-modal="false"
  >
    <div class="photo-container">
      <div class="title">选择显示相册的圈子：</div>
      <el-checkbox-group v-model="checkList" class="circle-chexkbox">
        <el-checkbox label="活动圈子1"></el-checkbox>
        <el-checkbox label="活动圈子2"></el-checkbox>
        <el-checkbox label="活动圈子3"></el-checkbox>
      </el-checkbox-group>
      <div class="title">圈子相册管理：</div>
      <div class="photo-list">
        <!-- <el-upload
          class="photo-item"
          list-type="picture-card"
          :multiple="true"
          :action="uploadPicUrl"
          :headers="headersOpt"
          :file-list="fileList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :before-upload="beforeUpload"
          :on-success="handleUploadSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog> -->
        <hc-image-upload v-model="fileList" multipleChoice :limit="100" />
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogCirclePhotoVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSave">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import store from "@/store";
import HcImageUpload from "@/views/components/HcImageUpload/index";
export default {
  name: "CirclePhoto",
  components: {
    HcImageUpload,
  },
  data() {
    return {
      // 上传图片路径
      uploadPicUrl: "/api/admin/sys_file/oss/upload",
      headersOpt: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      dialogCirclePhotoVisible: false,
      checkList: ["活动圈子1", "活动圈子3"],
      dialogImageUrl: "",
      dialogVisible: false,
      fileList: [
        // {
        //   name: "food.jpeg",
        //   url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        // },
        // {
        //   name: "food2.jpeg",
        //   url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        // },
      ],
    };
  },
  methods: {
    openDialogCirclePhotoVisible(data) {
      console.log("open...");
      this.dialogCirclePhotoVisible = true;
    },
    // 图片上传前
    beforeUpload(file) {},
    // 上传成功时
    handleUploadSuccess(response, file, fileList) {
      console.log("handleUploadSuccess...", fileList);
      this.fileList = fileList;
    },
    // 图片移除
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    handleSave() {
      console.log("save...", this.fileList);
    },
  },
};
</script>

<style lang="scss" scoped>
.photo-container {
  .title {
    font-size: 16px;
  }
  .circle-chexkbox {
    padding: 15px 0;
  }
  .photo-list {
    padding-top: 15px;
  }
}
</style>