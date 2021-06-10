<template>
  <div>
    <basic-container>
      <div class="title">
        <div>人员管理</div>
        <el-button @click="$router.back(-1)">返回</el-button>
      </div>
      <div class="search-box">
        <el-form :inline="true" :model="query" class="demo-form-inline" ref="searchForm">
          <el-button
            type="primary"
            style="margin-right: 10px"
            @click="handleExportData"
            >导出</el-button
          >
          <el-form-item prop="selectType">
            <el-input
              placeholder="请输入关键字"
              v-model="searchName"
              class="input-with-select"
            >
              <el-select
                slot="prepend"
                placeholder="请选择"
                v-model="selectType"
                @change="changeType"
              >
                <el-option label="全部" value="all"></el-option>
                <el-option label="用户名" value="user"></el-option>
                <el-option label="手机号" value="cell"></el-option>
                <el-option label="单位" value="unit"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="订单状态:" prop="orderStatus">
            <el-select v-model="query.orderStatus">
              <el-option label="全部" value=""></el-option>
              <el-option label="待支付" value="0"></el-option>
              <el-option label="支付成功" value="1"></el-option>
              <el-option label="支付失败" value="2"></el-option>
              <el-option label="取消支付" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="票种类型:" prop="ticketingType">
            <el-select v-model="query.ticketingType">
              <el-option label="全部" value=""></el-option>
              <el-option label="付费票" value="2"></el-option>
              <el-option label="免费票" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="核销状态:" prop="cancelStatus">
            <el-select v-model="query.cancelStatus">
              <el-option label="全部" value=""></el-option>
              <el-option label="未核销" value="0"></el-option>
              <el-option label="已核销" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="人员类型:" prop="isVip">
            <el-select v-model="query.isVip">
              <el-option label="全部" value=""></el-option>
              <el-option label="vip" value="1"></el-option>
              <el-option label="普通" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态:" prop="auditStatus">
            <el-select v-model="query.auditStatus">
              <el-option label="全部" value=""></el-option>
              <el-option label="无需审核" value="0"></el-option>
              <el-option label="待审核" value="1"></el-option>
              <el-option label="审核通过" value="2"></el-option>
              <el-option label="审核未通过" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handlecheck">查 询</el-button>
            <el-button icon="el-icon-refresh" @click="resetForm">重 置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        border
        style="width: 100%"
        v-loading="loading"
        :cell-style="{ background: '#fff' }"
        :data="tableData"
        :span-method="mergeCell"
        :header-cell-style="{ background: '#FAFAFA' }"
      >
        <el-table-column prop="userName" label="名称" fixed width="120">
          <template slot-scope="scope">
            {{ !scope.row.rows ? scope.row.userName : scope.row.enroleName }}
          </template>
        </el-table-column>
        <el-table-column label="报名信息" width="500px">
          <template slot-scope="scope">
            <span class="info-item">{{
              scope.row.userName ? scope.row.userName : "no data"
            }}</span>
            <span class="info-item">{{
              scope.row.phone ? scope.row.phone : "no data"
            }}</span>
            <span class="info-item">{{
              scope.row.company ? scope.row.company : "no data"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="购票信息" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="handleCheckTicketInfo(scope.row)">{{
              scope.row.ticketingType | ticketingTypeFilter
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="是否为vip" width="100">
          <template slot-scope="scope">
            <el-switch
              @change="changeVip(scope.row)"
              v-model="scope.row.isVip"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="座位号" width="200">
          <template slot-scope="scope">
            <el-button
              plain
              @click="handleToSet(scope.row)"
              v-if="scope.row.isShowBtn"
              >{{ scope.row.seatNumber
              }}<i class="el-icon-edit el-icon--right"></i
            ></el-button>
            <el-input
              ref="saveInputRef"
              maxlength="15"
              show-word-limit
              v-model="scope.row.seatNumber"
              placeholder="设置座位号"
              @blur="blurInput(scope.row)"
              v-else
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="报名时间" width="180"> </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" width="120">
          <template slot-scope="scope">
            {{ scope.row.orderStatus | orderStatusFilter }}
          </template>
        </el-table-column>
        <el-table-column label="核销状态" width="80">
          <template slot-scope="scope">
            {{ scope.row.cancelStatus | cancelStatusFilter }}
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="120">
          <template slot-scope="scope">
            {{ scope.row.auditStatus | auditStatusFilter }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="text"
              v-if="scope.row.auditStatus != 0"
              @click="handleAudit(scope.row)"
              >审核</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.current"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="query.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <TicketInfo ref="ticketInfoRef" />
      <EditApplyInfo ref="editApplyInfoRef" @refresh="getList" />
      <PersonnelAudit ref="personnelAuditRef" @refresh="getList" />
    </basic-container>
  </div>
</template>

<script>
import {
  peopleManagement,
  set_vip_or_seat,
  checkFormInfo,
  dataExport,
} from "@/api/activity/personnel.js";
import TicketInfo from "./components/TicketInfo";
import EditApplyInfo from "./components/EditApplyInfo";
import PersonnelAudit from "./components/PersonnelAudit";
export default {
  components: {
    TicketInfo,
    EditApplyInfo,
    PersonnelAudit,
  },
  data() {
    return {
      isShowBtn: true,
      loading: false,
      total: 0,
      query: {
        activityId: "",
        current: 1,
        size: 10,
        userName: "",
        phone: "",
        orderStatus: "",
        ticketingType: "",
        cancelStatus: "",
        isVip: "",
        auditStatus: "",
      },
      selectType: "all",
      searchName: "",
      tableData: [],
      vipQuery: {
        id: "",
        code: "vip",
        vip: "",
        seatNumber: "",
      },
      seatQuery: {
        id: "",
        code: "seatNumber",
        vip: "",
        seatNumber: "",
      },
    };
  },
  filters: {
    orderStatusFilter(data) {
      if (data == 0) {
        return "待支付";
      } else if (data == 1) {
        return "支付成功";
      } else if (data == 2) {
        return "支付失败";
      } else if (data == 3) {
        return "待支付取消报名";
      } else if (data == 4) {
        return "取消报名退款成功";
      } else if (data == 5) {
        return "取消报名待退款";
      } else if (data == 6) {
        return "取消报名退款失败";
      } else {
        return "暂无";
      }
    },
    cancelStatusFilter(data) {
      if (data == 0) {
        return "0/1";
      } else if (data == 1) {
        return "1/1";
      } else {
        return "0/0";
      }
    },
    auditStatusFilter(data) {
      if (data == 0) {
        return "不需要审核";
      } else if (data == 1) {
        return "待审核";
      } else if (data == 2) {
        return "审核通过";
      } else if (data == 3) {
        return "审核未通过";
      } else {
        return "暂无";
      }
    },
    ticketingTypeFilter(data) {
      if (data == 1) {
        return "免费票";
      } else if (data == 2) {
        return "付费票";
      }
    },
  },
  created() {
    this.query.activityId = this.$route.query.id;
    // this.searchForm.activityId = this.$route.query.id;
    this.getpeopleManagementPage();
  },
  methods: {
    resetForm(){
      this.$refs.searchForm.resetFields()
      this.selectType = "all"
      this.searchName = ""
      this.query.userName = ""
      this.query.phone = ""
    },
    getList() {
      this.getpeopleManagementPage();
    },
    handleExportData() {
      console.log("exportData...");
      dataExport(this.$route.query.id);
    },
    changeType(data) {
      console.log("data", data);
      this.searchName = "";
    },
    handlecheck() {
      if (this.selectType == "all") {
        this.query.userName = "";
        this.query.phone = "";
      } else if (this.selectType == "user") {
        this.query.userName = this.searchName;
        this.query.phone = "";
      } else if (this.selectType == "cell") {
        this.query.userName = "";
        this.query.phone = this.searchName;
      } else if (this.selectType == "unit") {
      }
      console.log("searQuery...", this.query);
      this.getpeopleManagementPage();
    },
    mergeCell({ row, column, rowIndex, columnIndex }) {
      if (!columnIndex) {
        if (row.rows) {
          return {
            colspan: 1,
            rowspan: row.rows,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    // 处理获取的列表数据
    handleData(data) {
      let newList = [];
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].list.length; j++) {
          newList.push({
            ...data[i].list[j],
            rows: j == 0 ? data[i].list.length : 0,
            isVip: data[i].list[j].isVip == 0 ? false : true,
            isShowBtn: true,
          });
        }
      }
      this.tableData = newList;
      console.log('data...',this.tableData)
    },
    // 获取人员数据
    getpeopleManagementPage() {
      this.loading = true;
      peopleManagement(this.query).then((res) => {
        this.total = res.data.data.data.total;
        this.handleData(res.data.data.data.records);
        this.loading = false;
      });
    },
    handleSizeChange(val) {
      console.log("每页显示条数", val);
    },
    handleCurrentChange(val) {
      console.log("当前页", val);
      this.query.current = val;
      this.getpeopleManagementPage();
    },
    handleEdit(row) {
      console.log("修改", row.enroleId);
      checkFormInfo({ id: row.enroleId }).then((res) => {
        let data = res.data.data.data;
        this.$refs.editApplyInfoRef.openApplyInfoDialog(data,row.enroleId);
      });
    },
    handleAudit(row) {
      console.log("审核", row);
      // this.$refs.personnelAuditRef.openAuditDialog(2,123);
      this.$refs.personnelAuditRef.openAuditDialog(
        row.auditStatus,
        row.enroleId
      );
    },
    changeVip(row) {
      console.log("vips", row);
      this.vipQuery.id = row.enroleId;
      this.vipQuery.vip = row.isVip ? 1 : 0;
      this.vipQuery.seatNumber = row.seatNumber;
      console.log("vipQuery", this.vipQuery);
      set_vip_or_seat(this.vipQuery).then((res) => {
        console.log("setVip...", res);
      });
    },
    handleToSet(row) {
      console.log("toSet...", row);
      row.isShowBtn = !row.isShowBtn;
      this.$nextTick(() => {
        this.$refs.saveInputRef.focus();
      });
    },
    blurInput(row) {
      row.isShowBtn = !row.isShowBtn;
      this.seatQuery.id = row.enroleId;
      this.seatQuery.vip = row.isVip ? 1 : 0;
      this.seatQuery.seatNumber = row.seatNumber;
      set_vip_or_seat(this.seatQuery).then((res) => {
        if (res.data.data.businessCode === 1000) {
          this.$notify({
            title: "座位号",
            message: "座位号设置成功",
            type: "success",
          });
        }
      });
    },
    handleCheckTicketInfo(row) {
      checkFormInfo({ id: row.enroleId }).then((res) => {
        let data = res.data.data.data;
        this.$refs.ticketInfoRef.openTicketInfoDialog(data);
      });
    },
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
.search-box {
  .el-form-item {
    margin-right: 20px;
  }
  .input-with-select {
    width: 400px;
    .el-select--medium {
      width: 100px;
    }
  }
}
.pagination {
  text-align: right;
  padding-top: 20px;
}
.info-item {
  margin-right: 10px;
}
</style>