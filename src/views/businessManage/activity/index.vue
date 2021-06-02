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
          <span style="margin-left: 30px; color: #919397">
            活动圈子：2021城市超级APP体检官方活动群
            <el-tag size="mini" type="danger">官方</el-tag>
          </span>
          <span style="margin-left: 30px">
            <el-button type="text" @click="handleRelevanceMore(props)"
              >关联更多圈子</el-button
            >
          </span>
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

    <!-- 关联更多圈子弹框 -->
    <el-dialog
      title="2021城市超级APP免费体检活动"
      :visible.sync="dialogVisibleRelevanceMore"
      width="40%"
      @close="closeDialogMore"
    >
      <div class="relevance-more-box">
        <div class="search">
          <span>搜索圈子</span>
          <el-select
            v-el-select-loadmore="loadmore"
            v-model="relevanceQuery.circleId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in searchOrgList"
              :key="item.circleId"
              :label="item.name"
              :value="item.circleId"
            >
            </el-option>
          </el-select>

          <el-button type="primary" round @click="toRelevance">关 联</el-button>
        </div>
        <el-divider></el-divider>
        <div class="circle-list">
          <div class="tiitle-org">关联圈子</div>
          <div v-if="orgedArr.length != 0">
            <div
              class="circle-item"
              v-for="(item, index) in orgedArr"
              :key="index"
            >
              <span>{{ item.circleName }}</span>
              <el-button
                type="danger"
                round
                size="mini"
                @click="deleteCircleItem(item.id)"
                >删除</el-button
              >
            </div>
          </div>
          <div style="text-align: center; padding-top: 10px;color:#909399;" v-else>
            暂无关联
          </div>
        </div>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  activitiesList,
  activityDelete,
  checkCity,
  searchOrg,
  relevanceSave,
  orgedList,
  deleteOrg,
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
      dialogVisibleRelevanceMore: false,
      img: "", //签到码地址
      relevanceQuery: {
        activityId: "", //活动id
        circleId: "", //圈子id
      },
      loading: false,
      //搜索圈子参数
      searchOrgQuery: {
        searchKey: "",
        size: 10,
        current: 1,
      },
      searchOrgList: [], //圈子搜索结果
      orgedArr: [],
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
  directives: {
    "el-select-loadmore": {
      inserted(el, binding) {
        /** el可以获取当前dom节点，并且进行编译，也可以操作事件 **/
        /** binding指的是一个对象，一般不用 **/
        /** vnode 是 Vue 编译生成的虚拟节点 **/
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
        );
        SELECTWRAP_DOM.addEventListener("scroll", function () {
          /**
           * scrollHeight 获取元素内容高度(只读)
           * scrollTop 获取或者设置元素的偏移值,常用于计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
           * clientHeight 读取元素的可见高度(只读)
           * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
           * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
           */
          const condition =
            this.scrollHeight - this.scrollTop <= this.clientHeight + 1;
          if (condition) {
            binding.value();
          }
        });
      },
    },
  },
  methods: {
    closeDialogMore() {
      this.relevanceQuery.circleId = "";
      this.searchOrgList = [];
      this.orgedArr = [];
    },
    getOrgList(query) {
      searchOrg(query).then((res) => {
        this.searchOrgList = res.data.data.data.records;
        this.loading = false;
      });
    },
    remoteMethod(query) {
      if (query != "") {
        this.loading = true;
        this.searchOrgQuery.searchKey = query;
        this.searchOrgQuery.current = 1;
        this.getOrgList(this.searchOrgQuery);
      } else {
        this.searchOrgList = [];
      }
    },
    loadmore() {
      this.searchOrgQuery.current += 1;
      searchOrg(this.searchOrgQuery).then((res) => {
        this.searchOrgList = this.searchOrgList.concat(
          res.data.data.data.records
        );
      });
    },
    deleteCircleItem(id) {
      this.$confirm("此操作将取消关联该圈子, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteOrg(id).then((res) => {
            if (res.data.data.businessCode == 1000) {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.getOrgedList({
                activityId: this.relevanceQuery.activityId,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    toRelevance() {
      // relevance code...
      relevanceSave(this.relevanceQuery).then((res) => {
        if (res.data.data.businessCode == 1000) {
          this.getOrgedList({
            activityId: this.relevanceQuery.activityId,
          });
        }
      });
    },
    //已关联圈子数据
    getOrgedList(query) {
      orgedList(query).then((res) => {
        this.orgedArr = res.data.data.data;
      });
    },
    handleRelevanceMore({ row }) {
      this.dialogVisibleRelevanceMore = true;
      this.relevanceQuery.activityId = row.id;
      let query = { activityId: row.id };
      this.getOrgedList(query);
    },
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
