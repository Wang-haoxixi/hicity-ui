<template>
  <basic-container>
    <hc-table-form title="合伙人申请列表">
      <hc-crud
        :option="tableOption"
        :fetchListFun="fetchListFun"
        :addFun="addFun"
        :updateFun="updateFun"
        :deleteFun="deleteFun"
        @handleView="handleView"
      >
        <!-- <div slot="nameForm" slot-scope="scope">
          <el-input v-model="scope.formData.id"></el-input>
        </div> -->
        <!-- <div slot="name" slot-scope="scope">
           <div>{{scope}}</div>
         </div> -->
      </hc-crud>
    </hc-table-form>

    <!-- 合伙人详情 -->
    <el-dialog title="合伙人详情" :visible.sync="dialogFormVisible" width="50%" append-to-body>
      <div class="item">用户账号：{{ partner.id }}</div>
      <div class="item">姓名：{{ partner.name }}</div>
      <div class="item">联系方式：{{ partner.mobile }}</div>
      <div class="item">地区：{{ partner.cityName }}</div>
      <div class="item">合作意向：{{ partner.cooperationIntention }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import { tableOption } from "./const.js";
import { partnerList, partnerDetail } from "@/api/content/partners";
export default {
  data() {
    return {
      tableOption: tableOption,
      dialogFormVisible: false,
      partner: {},
      tableLoading: false,
    };
  },
  methods: {
    // 查看 详情
    handleView(row) {
      this.dialogFormVisible = true;
      partnerDetail(row.id).then((res) => {
        this.partner = res.data.data.data;
      });
    },
    // 获取合伙人列表
    fetchListFun(params) {
      return new Promise((resolve, reject) => {
        partnerList(params).then((res) => {
          resolve({
            records: res.data.data.data.records,
            page: {
              total: res.data.data.data.total,
            },
          });
        }, (error) => {
          reject(error)
        });
      });
    },
    deleteFun(data, next) {
      console.log("删除", data);
      setTimeout(() => {
        next();
      }, 1000);
    },
    addFun(data, next) {
      console.log("新增", data);
      setTimeout(() => {
        next();
      }, 1000);
    },
    updateFun(data, next) {
      console.log("编辑", data);
      setTimeout(() => {
        next();
      }, 1000);
    },
  },
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
.item {
  line-height: 35px;
  font-size: 16px;
}
</style>