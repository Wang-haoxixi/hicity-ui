<template>
  <el-dialog
    width="60%"
    title="圈子相册管理"
    :visible.sync="dialogCirclePhotoVisible"
    :close-on-click-modal="false"
    @closed="closeDialogCirclePhotoVisible"
  >
    <div class="photo-container">
      <div class="title">选择显示相册的圈子：</div>
      <el-checkbox-group v-model="checkList" class="circle-chexkbox">
        <el-checkbox
          border
          disabled
          :label="item"
          :key="index"
          v-for="(item, index) in checkArr"
        ></el-checkbox>
      </el-checkbox-group>
      <div class="title">
        圈子相册管理：
        <el-upload
          list-type="picture"
          :show-file-list="false"
          :multiple="true"
          :action="uploadPicUrl"
          :headers="headersOpt"
          :on-success="handleUploadSuccess"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </div>
      <!-- 图片预览 -->
      <el-dialog :visible.sync="dialogVisible" width="30%" append-to-body>
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>

      <div v-for="(itemO, indexO) in processedList" :key="indexO">
        <div
          style="font-size: 16px; margin-top: 8px; font-weight: 500"
          v-if="itemO.dataList.length > 0"
        >
          {{ itemO.date }}
        </div>
        <div class="photo-list">
          <div
            class="img-box"
            v-for="(itemI, indexI) in itemO.dataList"
            :key="indexI"
            @mouseover="mouseOver(itemI)"
            @mouseleave="mouseLeave(itemI)"
          >
            <el-image :src="itemI.url" lazy></el-image>
            <div class="mengceng" v-if="itemI.isShow">
              <i class="el-icon-zoom-in" @click="handlePreview(itemI)"></i>
              <i
                class="el-icon-delete"
                @click="handleRemove(itemO, itemI, indexI)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogCirclePhotoVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSave"
        >保 存</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
Date.prototype.Format = function (fmt) {
  // author: meizz
  var o = {
    "M+": this.getMonth() + 1, // 月份
    "d+": this.getDate(), // 日
    "h+": this.getHours(), // 小时
    "m+": this.getMinutes(), // 分
    "s+": this.getSeconds(), // 秒
    "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};
import {
  getCirclePhotoes,
  uploadToCircle,
  removePhotoes,
} from "@/api/activity/activity";
import store from "@/store";
export default {
  data() {
    return {
      disabled: false,
      loading: false,
      // 上传图片路径
      uploadPicUrl: "/api/admin/sys_file/oss/upload",
      headersOpt: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      dialogCirclePhotoVisible: false,
      checkList: [], // 绑定多选框
      checkArr: [], // 多选框数组
      dialogImageUrl: "",
      dialogVisible: false,
      query: {
        circleId: "",
        current: 1,
        size: 100,
      },
      saveQuery: {
        circleId: "",
        photos: [], // 图片集
      },
      ids: [], // 需要删除的照片id集
      pendingList: [], //时间数组
      processedList: [], // 展示图
    };
  },
  methods: {
    mouseOver(item) {
      item.isShow = true;
    },
    mouseLeave(item) {
      item.isShow = false;
    },
    closeDialogCirclePhotoVisible() {
      this.processedList = [];
      this.ids = [];
      this.saveQuery = {
        circleId: "",
        photos: [], // 图片集
      };
      this.query.current = 1;
    },
    // 数组去重并将伪数组转成真数组
    unique(arr) {
      return Array.from(new Set(arr));
    },
    getPhotoList() {
      getCirclePhotoes(this.query).then((res) => {
        if (res.data.data.businessCode == 1000) {
          let dateList = [];
          this.pendingList = res.data.data.data.records.map((item) => {
            return {
              name: item.name,
              url: item.imgUrl,
              photoId: item.photoId,
              createDate: item.createDate,
              isShow: false,
            };
          });
          // 时间数组
          this.pendingList.forEach((item) => {
            dateList.push(item.createDate);
          });
          // 时间去重
          dateList = this.unique(dateList);
          // 相同时间的照片处理
          dateList.forEach((item) => {
            let dataList = [];
            this.pendingList.forEach((item2) => {
              if (item == item2.createDate) {
                dataList.push({ ...item2, isShow: false });
              }
            });
            // 加工后的数据 -- 预览图
            this.processedList.push({
              date: item,
              dataList: dataList,
            });
          });
          this.addqueue();
        }
      });
    },
    openDialogCirclePhotoVisible(data, circleName) {
      this.checkList = [circleName];
      this.checkArr = [circleName];
      this.query.circleId = data;
      this.saveQuery.circleId = data;
      this.dialogCirclePhotoVisible = true;
      this.getPhotoList();
    },

    // 增加时间列表
    addqueue() {
      var time = new Date().Format("yyyy-MM-dd");
      let recentlyTime = "";
      this.processedList.forEach((item, index) => {
        if (index == 0) {
          recentlyTime = item.date;
        }
      });
      if (recentlyTime != time) {
        this.processedList.unshift({
          date: time,
          dataList: [],
        });
      }
    },
    // 上传成功时
    handleUploadSuccess(response, file, fileList) {
      var time = new Date().Format("yyyy-MM-dd");
      this.processedList.forEach((item) => {
        if (item.date == time) {
          item.dataList.push({
            name: file.name,
            url: file.response.data.data.url,
            photoId: "",
            createDate: "",
            isShow: false,
          });
        }
      });
      this.saveQuery.photos.push({
        imgUrl: file.response.data.data.url,
        name: file.name,
        describe: "",
        size: file.size,
      });
    },
    // 图片预览
    handlePreview(item) {
      this.dialogImageUrl = item.url;
      this.dialogVisible = true;
    },
    // 图片移除
    handleRemove(itemO, itemI, indexI) {
      this.processedList.forEach((ele) => {
        if (ele.date == itemO.date) {
          ele.dataList.forEach((ele2, i) => {
            if (itemI.photoId && ele2.photoId == itemI.photoId) {
              ele.dataList.splice(i, 1);
              this.ids.push(itemI.photoId);
            } else if (indexI == i) {
              ele.dataList.splice(i, 1);
            }
          });
        }
      });
      this.saveQuery.photos.forEach((item, index) => {
        if (indexI == index) {
          this.saveQuery.photos.splice(index, 1);
        }
      });
    },
    // 保存
    handleSave() {
      this.loading = true;
      if (this.ids.length > 0) {
        removePhotoes({ ids: this.ids }).then((res) => {});
      }
      if (this.saveQuery.photos.length > 0) {
        uploadToCircle(this.saveQuery).then((res) => {
          if (res.data.data.businessCode == 1000) {
          }
        });
      }
      this.$notify({
        title: "成功",
        message: "保存成功",
        type: "success",
      });
      this.loading = false;
      this.dialogCirclePhotoVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.photo-container {
  max-height: 400px;
  overflow: auto;
  .title {
    font-size: 16px;
    display: flex;
    align-items: center;
  }
  .circle-chexkbox {
    padding: 15px 0;
  }
  .photo-list {
    display: flex;
    flex-wrap: wrap;
    .img-box {
      width: 148px;
      height: 148px;
      margin: 0 5px 5px 0;
      position: relative;
      > .el-image {
        width: 100%;
        height: 100%;
        border-radius: 6px;
      }
      .mengceng {
        width: 100%;
        height: 100%;
        border-radius: 6px;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        > i {
          cursor: pointer;
          color: #fff;
          font-size: 20px;
        }
        > i:last-child {
          margin-left: 15px;
        }
      }
    }
  }
}
</style>