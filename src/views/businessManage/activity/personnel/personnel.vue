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
          <el-table-column prop="" label="报名时间"> </el-table-column>
          <el-table-column prop="" label="票名"> </el-table-column>
          <el-table-column prop="" label="购票数量"> </el-table-column>
          <el-table-column prop="" label="订单状态"> </el-table-column>
          <el-table-column prop="" label="核销状态"> </el-table-column>
          <el-table-column prop="" label="审核状态"> </el-table-column>
          <el-table-column prop="" label="批注"> </el-table-column>
          <el-table-column label="操作"> </el-table-column>
        </el-table>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { peopleManagement } from "@/api/activity/personnel";
export default {
  data() {
    return {
      tableData: [],
    };
  },
  created() {
      this.getPeopleManagementList()
  },
  methods: {
    backClick() {
      this.$router.go(-1);
    },
    getPeopleManagementList(){
        peopleManagement().then(res=>{
            console.log(res)
        })
    }
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
</style>