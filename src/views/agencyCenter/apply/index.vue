<template>
  <basic-container>
    <div class="title">合伙人申请列表</div>
    <el-table
      border
      stripe
      :data="tableData"
      :header-cell-style="{ background: '#FAFAFA' }"
      style="width: 100%; margin-top: 10px"
      v-loading="tableLoading"
    >
      <el-table-column align="center" prop="id" label="用户账号">
      </el-table-column>
      <el-table-column align="center" prop="name" label="姓名">
      </el-table-column>
      <el-table-column align="center" prop="mobile" label="联系方式">
      </el-table-column>
      <el-table-column align="center" prop="cityName" label="地区">
      </el-table-column>
      <el-table-column
        align="center"
        prop="cooperationIntention"
        label="合作意向"
      >
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="handleLook(scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 合伙人详情 -->
    <el-dialog title="合伙人详情" :visible.sync="dialogFormVisible" width="50%">
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

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageSize"
      :total="total"
      background
      class="paging"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </basic-container>
</template>

<script>
import { partnerList, partnerDetail } from "@/api/content/partners";
export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      currentPage: 1,
      pageSize: 20,
      total: 0,
      partner: {},
      tableLoading: false,
    };
  },
  methods: {
    // 查看 详情
    handleLook(row) {
      this.dialogFormVisible = true;
      partnerDetail(row.id).then((res) => {
        this.partner = res.data.data.data;
      });
    },
    // 获取合伙人列表
    getPartnerList() {
      this.tableLoading = true;
      partnerList({
        current: this.currentPage,
        size: this.pageSize,
      })
        .then((res) => {
          let records = res.data.data.data.records;
          this.total = res.data.data.data.total;
          if (records) {
            this.tableData = records;
          }
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.getPartnerList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPartnerList();
    },
  },

  created() {
    this.getPartnerList();
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