<template>
  <basic-container>
    <div class="title">活动列表</div>

    <el-row>
      <el-col :span="2">
        <el-button
          @click="addCreate"
          type="primary"
          size="mini"
          class="el-icon-plus"
        >
          新增</el-button
        >
      </el-col>
      <el-col :span="6">
        <el-input
          clearable
          prefix-icon="el-icon-search"
          size="mini"
          v-model="name"
          placeholder="请输入"
          @keyup.enter.native="enterCheck"
          @clear="clearName"
          @input="inputVal"
        ></el-input>
      </el-col>
    </el-row>

      <!-- :row-key="getRowKeys" -->
      <!-- :expand-row-keys="expends" -->
    <el-table
      style="margin-top: 10px"
      :header-cell-style="{ background: '#FAFAFA' }"
      :data="tableData"
    >
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template slot-scope="props">
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
            >发布时间：2020-12-29 10:39</span
          >
        </template>
      </el-table-column>
      <!-- 其他列表页 -->
      <el-table-column label="活动封面" width="200">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.poster"
            fit="contain"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="活动信息">
        <template slot-scope="scope">
          <div>{{ scope.row.name }}</div>
          <div>
            <i class="el-icon-time" style="margin-right: 5px"></i
            >{{ scope.row.startTime }} 至 {{ scope.row.endTime }}
          </div>
          <div>
            <i class="el-icon-location-outline" style="margin-right: 5px"></i
            >{{ scope.row.field }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="活动状态" width="130">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.statusFlag == '0'">草稿</el-tag>
          <el-tag v-if="scope.row.statusFlag == '1'" type="success"
            >进行中</el-tag
          >
          <el-tag v-if="scope.row.statusFlag == '2'" type="info"
            >已结束</el-tag
          >
          <el-tag v-if="scope.row.statusFlag == '3'" type="warning"
            >被下架</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column v-if="userType == 1 || userType == 2" prop="exhibits" label="展示范围" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="check(scope.row.id)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="joinNumber"
        label="报名人数"
        width="100"
      ></el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="scope" v-if="userType <= scope.row.source">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageSize"
      :total="total"
      background
      layout="total, sizes, prev, pager, next, jumper"
      class="paging"
    ></el-pagination>

    <!-- 查看城市范围弹窗 -->
    <hc-city-box ref="hcCityBox"></hc-city-box>
  </basic-container>
</template>

<script>
import {
  activitiesList,
  activityDelete,
  checkCity,
} from "@/api/activity/activity";
import HcCityBox from "@/views/components/HcCity/HcCityBox/index";
import { mapGetters } from "vuex";
export default {
  components: { HcCityBox },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      expends: [], // 展开行数组id
      showCityDialogVisible: false, //控制展示城市
      allCityList: [],
      initCityList: [],

      name: "", //活动名称
    };
  },
  computed: {
    ...mapGetters(['userInfo', 'userType'])
  },
  filters: {},
  methods: {
    // 获取活动列表数据
    getActivitiesListFn() {
      activitiesList({
        name: this.name,
        current: this.currentPage,
        size: this.pageSize,
      }).then((res) => {
        // console.log(res);
        if (res.data.code !== 0) {
          return this.$message.error("获取活动数据失败！");
        }
        this.tableData = res.data.data.data.records;
        this.total = res.data.data.data.total;
        this.currentPage = res.data.data.data.current;
        this.pageSize = res.data.data.data.size;
        console.log(this.tableData);
      });
    },
    // 根据活动名搜索查询
    enterCheck(e) {
      console.log(e.target.value);
      this.getActivitiesListFn();
    },
    // 清空
    clearName() {
      this.getActivitiesListFn();
    },
    // 输入框值改变触发
    inputVal(e) {
      if (e.trim().length == 0) {
        this.getActivitiesListFn();
      }
    },
    // 编辑
    handleEdit(res) {
      // console.log("编辑", res);
      this.$router.push({
        path: "/publish",
        query: {
          id: res.id,
        },
      });
    },
    // 删除
    handleDelete(res) {
      console.log("删除", res);
      this.$confirm("确定删除该活动?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log("确定");
          activityDelete(res.id).then((data) => {
            console.log("删除成功", data);
            if (data.data.code !== 0) {
              this.$message.error("删除活动失败!");
            }
            this.$message.success("删除活动成功!");
            this.getActivitiesListFn();
          });
        })
        .catch(() => {
          this.$message("取消删除成功!");
        });
    },
    // 查看
    check(id) {
      console.log(id);
      checkCity({
        activityId: id,
      }).then((res) => {
        this.$refs.hcCityBox.open(this.userInfo.manageCityId, res.data.data.data || [], true)
      });
      this.showCityDialogVisible = true;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getActivitiesListFn();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getActivitiesListFn();
    },
    // 新增
    addCreate() {
      this.$router.push("/publish");
    },
    // 人员管理
    peopleManagement() {},
    // 票务管理
    ticketManagement() {},
    // 遍历数据获取展开列id
    getExpends() {
      let Id = this.tableData.map((item) => item.id);
      this.expends = Id;
      console.log("tableData", this.tableData);
      console.log(this.expends);
    },
    // 行数据的 Key
    // getRowKeys(row) {
    //   return row.id;
    // },
  },
  created() {
    this.getActivitiesListFn();
    // this.getExpends();
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.title {
  padding-bottom: 5px;
  font-size: 18px;
  font-weight: 400;
}
.paging {
  margin-top: 20px;
  text-align: right;
}
.managBtn {
  color: #c0c4cc;
  font-size: 14px;
}
</style>
