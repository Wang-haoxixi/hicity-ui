<template>
  <basic-container>
    <hc-table-form
      :title="title"
      :formVisible="viewShow"
      @go-back="goBack">
      <hc-crud :option="tableOption" :fetchListFun="fetchListFun" @groupView="groupView"></hc-crud>
      <template v-slot:form>
        <div class="circle-detail">
          <el-image class="circle-detail-image" :src="formData.avatar"></el-image>
          <div class="circle-detail-info">
            <div class="info-name">{{formData.name}}</div>
            <div class="info-others">
              <div class="info-others-line">
                <div class="info-item">圈子ID：{{formData.circleId}}</div>
                <div class="info-item">创建城市：{{formData.createByCity}}</div>
              </div>
              <div class="info-others-line" style="margin-top: 10px;">
                <div class="info-item">创建者：{{formData.telephone}}</div>
                <div class="info-item">群主姓名：{{formData.createByName}}</div>
                <div class="info-item">注册时间：{{formData.createTime}}</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </hc-table-form>
  </basic-container>
</template>

<script>
import { tableOption } from "./const";
import { mapGetters } from "vuex";
import { getCircleList, dismissCircle, circleDetail } from "@/api/admin/circle"

export default {
  data() {
    return {
      viewShow: false,
      formData: {},
      showDetail: false,
    };
  },
  computed: {
    ...mapGetters(["permissions", "userInfo", "dicList"]),
    tableOption() {
      return tableOption();
    },
    title () {
      if (!this.viewShow) {
        return '圈子'
      } else {
        return '圈子-详情'
      }
    }
  },
  methods: {
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        getCircleList(params).then(({ data }) => {
          resolve({
            records: data.data.data.records,
            page: {
              total: data.data.data.total
            }
          })
        }, error => reject(error))
      })
    },
    goBack () {
      this.viewShow = false
    },
    groupView ({circleId}) {
      circleDetail({circleId}).then(({ data }) => {
        this.viewShow = true
        this.formData = data.data.data
      })
    },
    toDelete({ circleId }) {
      this.$confirm("是否确认此操作?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        dismissCircle(circleId).then(({ data }) => {
          this.$notify({
            title: "成功",
            message: "解散成功",
            type: "success",
            duration: 2000,
          });
          this.$refs.hcCrud.refresh()
        });
      })
      .catch(function () {});
    },
  },
};
</script>
<style lang="scss" scope>
.circle-detail {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 120px;
  padding: 24px;
  border: 1px solid #D9D9D9;
  .circle-detail-image {
    height: 120px;
    width: 120px;
  }
  .circle-detail-info {
    margin-left: 24px;
    height: 120px;
    .info-name {
      margin-top: 11px;
      height: 22px;
      line-height: 22px;
      font-size: 16px;
      color: #333333;
    }
    .info-others {
      margin-top:25px;
      .info-others-line {
        height: 22px;
        line-height: 22px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .info-item {
          height: 22px;
          line-height: 22px;
          flex: 200px 0 0;
          color: #666666;
          font-size: 14px;
        }
      }
    }
  }
}

.form-title {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  .form-title-name {
    height: 60px;
    line-height: 60px;
    font-size: 20px;
  }
}
</style>

