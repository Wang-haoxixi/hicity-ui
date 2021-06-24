<template>
  <hc-table-form title="分销管理" :formVisible="true" @go-back="goBack">
    <template slot="form">
      <hc-crud :option="tableOption" :fetchListFun="fetchListFun">
        <template v-slot:menu="scope">
          <el-button type="text" @click="handleInfo(scope.row)"
            >查看报名信息</el-button
          >
        </template>
      </hc-crud>
    </template>
    <!-- 报名信息弹窗 -->
    <el-dialog title="提示" append-to-body :visible.sync="dialogApplyInfoVisible" width="60%">
      <div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="日期" width="180">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="address" label="地址"> </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogApplyInfoVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogApplyInfoVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </hc-table-form>
</template>

<script>
import { activitiesList } from "@/api/activity/activity";
import { tableOption } from "./shareRecord";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["userInfo", "userType"]),
    tableOption() {
      return tableOption(this.userType == 1 || this.userType == 2);
    },
  },
  data() {
    return {
      dialogApplyInfoVisible: false, // 查看报名信息
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
    };
  },
  methods: {
    goBack(){
      this.$emit("hideShareRecord")
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
    handleInfo() {
      this.dialogApplyInfoVisible = true;
    },
  },
};
</script>

<style lang="sass" scoped>
</style>