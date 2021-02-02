<template>
  <basic-container>
    <avue-crud
      v-show="!showDetail"
      ref="crud"
      :option="tableOption"
      :page="page"
      :table-loading="tableLoading"
      :data="tableData"
      @on-load="getList"
      @refresh-change="handleRefreshChange"
    >
      <template slot="menu" slot-scope="scope">
        <template>
          <el-button type="text" size="mini" @click="toView(scope.row)"
            >详情</el-button
          >
          <!-- <el-button type="text" size="mini" @click="toDelete(scope.row)"
            >锁定</el-button
          > -->
        </template>
      </template>
    </avue-crud>
    <div v-show="showDetail">
      <div class="form-title">
        <div class="form-title-name">圈子详情</div>
        <el-button @click="showDetail = false">返 回</el-button>
      </div>
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
    </div>
  </basic-container>
</template>

<script>
import { tableOption } from "./const";
import { mapGetters } from "vuex";
import { getCircleList, dismissCircle, circleDetail } from "@/api/admin/circle"

export default {
  data() {
    return {
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false, // 是否倒序
      },
      tableLoading: false,
      tableData: [],
      formData: {},
      showDetail: false,
    };
  },
  computed: {
    ...mapGetters(["permissions", "userInfo", "dicList"]),
    tableOption() {
      return tableOption();
    },
  },
  created() {
  },
  watch: {},
  methods: {
    getList(page = this.page, params) {
      this.tableLoading = true;
      let form = {
        current: page.currentPage,
        size: page.pageSize,
      };
      getCircleList(form)
      .then(({ data }) => {
        this.tableData = data.data.data.records;
        this.page.total = data.data.data.total;
      })
      .finally(() => {
        this.tableLoading = false;
      });
    },
    toView ({circleId}) {
      circleDetail({circleId}).then(({ data }) => {
        this.showDetail = true
        this.formData = data.data.data
        console.log(data)
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
          this.getList();
        });
      })
      .catch(function () {});
    },
    handleRefreshChange() {
      this.getList(this.page);
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

