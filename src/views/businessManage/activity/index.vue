<template>
  <basic-container>
    <hc-table-form title="活动列表">
      <hc-crud ref="hcCrud" :option="tableOption" :fetchListFun="fetchListFun">
        <template v-slot:menuLeft>
          <el-button
            @click="addCreate"
            type="primary"
            size="mini"
            class="el-icon-plus"
            >新增</el-button
          >
        </template>
        <template v-slot:expand="props">
          <el-button
            class="managBtn"
            icon="el-icon-user"
            size="mini"
            type="text"
            @click="peopleManagement(props)"
            >人员管理</el-button
          >
          <el-button
            class="managBtn"
            icon="el-icon-tickets"
            size="mini"
            type="text"
            @click="ticketManagement(props)"
            >票务管理</el-button
          >
          <span style="margin-left: 30px; color: #919397"
            >发布时间：{{ props.row.updateTime }}</span
          >
        </template>
        <template v-slot:poster="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.poster"
            fit="contain"
          ></el-image>
        </template>
        <template v-slot:info="scope">
          <div>{{ scope.row.name }}</div>
          <div>
            <i class="el-icon-time" style="margin-right: 5px"></i
            >{{ scope.row.startTime }} 至 {{ scope.row.endTime }}
          </div>
          <div>
            <i class="el-icon-location-outline" style="margin-right: 5px"></i
            >{{ scope.row.city }} {{ scope.row.field }}
          </div>
        </template>
        <template v-slot:status="scope">
          <el-tag v-if="scope.row.statusFlag == '0'">草稿</el-tag>
          <el-tag v-if="scope.row.statusFlag == '1'" type="success"
            >进行中</el-tag
          >
          <el-tag v-if="scope.row.statusFlag == '2'" type="info">已结束</el-tag>
          <el-tag v-if="scope.row.statusFlag == '3'" type="warning"
            >被下架</el-tag
          >
        </template>
        <template v-slot:exhibits="scope">
          <el-button type="text" @click="check(scope.row.id)">查看</el-button>
        </template>
        <template v-slot:menu="scope">
          <template v-if="userType <= scope.row.source">
            <el-button type="text" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button type="text" @click="handleDelete(scope.row)"
              >删除</el-button
            >
            <el-button type="text" @click="handleShowCode(scope.row)"
              >生成签到码</el-button
            >
          </template>
        </template>
      </hc-crud>
    </hc-table-form>

    <!-- 查看城市范围弹窗 -->
    <hc-city-box ref="hcCityBox"></hc-city-box>

    <!-- 签到码弹框 -->
    <el-dialog
      title="活动签到码"
      :visible.sync="showCodeDialogVisible"
      append-to-body
      width="30%"
    >
      <div class="code-img">
        <el-image :src="img">
          <div
            slot="error"
            style="
              line-height: 250px;
              text-align: center;
              background-color: #f5f7fa;
              color: #c0c4cc;
            "
          >
            草稿状态无签到码
          </div>
          <div
            slot="placeholder"
            style="line-height: 250px; text-align: center"
          >
            加载中<span class="dot">...</span>
            <i class="el-icon-loading"></i>
          </div>
        </el-image>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="downloadCode">下载签到码</el-button>
        <el-button type="primary" @click="showCodeDialogVisible = false"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  activitiesList,
  activityDelete,
  checkCity,
} from "@/api/activity/activity";
import { tableOption } from "./const.js";
import HcCityBox from "@/views/components/HcCity/HcCityBox/index";
import { mapGetters } from "vuex";
import Download from "downloadjs";
export default {
  components: { HcCityBox },
  data() {
    return {
      showCityDialogVisible: false, //控制展示城市
      showCodeDialogVisible: false, //展示签到码
      img: "", //签到码地址
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["userInfo", "userType"]),
    tableOption() {
      return tableOption(this.userType == 1 || this.userType == 2);
    },
  },
  activated() {
    this.$refs.hcCrud.refresh(); // 刷新表格数据
  },
  methods: {
    fetchListFun(params) {
      return new Promise((resolve, reject) => {
        activitiesList(params).then((res) => {
          if (res.data.code === 0) {
            resolve({
              records: res.data.data.data.records,
              page: {
                total: res.data.data.data.total,
              },
            });
          } else {
            this.$message.error("获取活动数据失败！");
          }
        });
      });
    },
    // 编辑
    handleEdit(res) {
      this.$router.push({
        path: "/publish",
        query: {
          id: res.id,
        },
      });
    },
    // 删除
    handleDelete(res) {
      this.$confirm("确定删除该活动?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          activityDelete(res.id).then((data) => {
            if (data.data.code !== 0) {
              this.$message.error("删除活动失败!");
            }
            this.$message.success("删除活动成功!");
            this.$refs.hcCrud.refresh();
          });
        })
        .catch(() => {});
    },
    // 展示签到码
    handleShowCode(row) {
      this.showCodeDialogVisible = true;
      this.img = row.weChatCode;
    },
    // 下载签到码
    downloadCode() {
      var a = document.createElement("a");
      a.download = "签到码";
      a.href = this.img;
      a.click();
    },
    // 查看
    check(id) {
      checkCity({
        activityId: id,
      }).then((res) => {
        this.$refs.hcCityBox.open(
          this.userInfo.manageCityId,
          res.data.data.data || [],
          true
        );
      });
      this.showCityDialogVisible = true;
    },
    // 新增
    addCreate() {
      this.$router.push("/publish");
    },
    // 人员管理
    peopleManagement(data) {
      this.$router.push({
        path: "/personnel",
        query: {
          id: data.row.id,
        },
      });
    },
    // 票务管理
    ticketManagement({ row }) {
      this.$router.push({
        path: "/activity/ticket/" + row.id,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles/index.scss";
</style>
