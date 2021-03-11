<template>
  <div>
    <basic-container>
      <div class="title">
        <div>人员管理</div>
        <el-button @click="backClick">返回</el-button>
      </div>
      <div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="能者" width="180">
          </el-table-column>
          <el-table-column prop="" label="报名信息" width="180">
          </el-table-column>
          <el-table-column prop="createTime" label="报名时间">
          </el-table-column>
          <el-table-column prop="ticketingName" label="票名"> </el-table-column>
          <el-table-column prop="orderNum" label="购票数量"> </el-table-column>
          <el-table-column prop="orderStatus" label="订单状态">
          </el-table-column>
          <el-table-column prop="applyStatusName" label="报名状态">
          </el-table-column>
          <el-table-column prop="cancelNum" label="核销状态"> </el-table-column>
          <el-table-column prop="auditStatus" label="审核状态">
          </el-table-column>
          <el-table-column prop="" label="批注"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="handleSignIn(scope.row)"
                >核销签到</el-button
              >
            </template>
          </el-table-column>
        </el-table>

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
      </div>
    </basic-container>
  </div>
</template>

<script>
import { peopleManagement } from "@/api/activity/personnel";
export default {
  data() {
    return {
      tableData: [
        {
          name: "张三",
          createTime: "2020-12-29 10:39",
          ticketingName: "早餐票",
          orderNum: "2",
          orderStatus: "支付成功",
          applyStatusName: "报名成功",
          cancelNum: "0/1",
          auditStatus: "审核通过",
        },
      ],
      query: {
        activityId: null,
        name: "",
        orderStatus: "",
        current: "",
        size: "",
      },
      currentPage: 1,
      pageSize: 20,
      total: 0,
    };
  },
  created() {
    this.query.activityId = this.$route.query.id;
    this.getPeopleManagementList();
    // console.log(this.$route.query.id)
  },
  methods: {
    backClick() {
      this.$router.go(-1);
    },
    handleSignIn(row){},
    getPeopleManagementList() {
      peopleManagement(this.query).then((res) => {
        console.log(res);
      });
    },
    handleSizeChange() {},
    handleCurrentChange() {},
  },
};
</script>

<style lang="scss" scoped>
.title {
  padding-bottom: 20px;
  font-size: 18px;
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.paging {
  margin-top: 20px;
  text-align: right;
}
</style>