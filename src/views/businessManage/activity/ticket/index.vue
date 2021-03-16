<template>
  <basic-container>
    <div class="title">
      <div>票务管理</div>
      <el-button @click="goBack">返回</el-button>
    </div>
    <div class="hc-crud-header">
      <div class="menu-left">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="toAddTicket()">新增</el-button>
        <!-- <el-button>票款统计</el-button> -->
      </div>
    </div>
    <el-table :data="tableData" stripe border style="width: 100%" header-row-class-name="hc-crud-table-header" :header-cell-style="{backgroundColor: '#FAFAFA', color: '#333333'}" v-loading="tableLoading">
      <el-table-column label="票务种类/名称">
        <template v-slot="scope">
          {{scope.row.ticketingType == '1' ? '免费票' : '付费票'}} / {{scope.row.ticketingName}}
        </template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template v-slot="scope">
          {{scope.row.updateTime}}
        </template>
      </el-table-column>
      <el-table-column label="价格">
        <template v-slot="scope">
          {{getPrice(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column label="数量">
        <template v-slot="scope">
          {{scope.row.number}}
        </template>
    </el-table-column>
      <el-table-column label="操作"  width="100px">
        <template v-slot="scope">
          <el-button type="text" size="mini" @click="toUpdateTicket(scope.row)">编辑</el-button>
          <el-button type="text" size="mini" @click="toDeleteTicket(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <form-detail ref="form" @finish="handleFinish"></form-detail>
  </basic-container>
</template>

<script>
import { getTicketList, getTicketDetail, deleteTicket } from "@/api/activity/ticketing"
import FormDetail from "./FormDetail"
export default {
  components: { FormDetail },
  data () {
    return {
      tableLoading: false,
      tableData: [],
      activityId: '',
    }
  },
  created () {
    this.activityId = this.$route.params.id
    this.getTicketList()
  },
  methods: {
    getTicketList () {
      getTicketList({
        activityId: this.activityId
      }).then(({data}) => {
        this.tableData = data.data.data
      })
    },
    getPrice (ticket) {
      if (ticket.ticketingType == '1') {
        return '免费'
      } else {
        let price = ''
        let priceList = []
        let payMethodList = ticket.payMethodList || []
        for (let i = 0; i < payMethodList.length; i++) {
          if (payMethodList[i].type == 'OfflinePay') {
            priceList.push(`${payMethodList[i].amount}元`)
          } else if (payMethodList[i].type == 'WeCanPay') {
            priceList.push(`${payMethodList[i].amount}贝`)
          }
          price = priceList.join(' / ')
        }
        return price
      }
    },
    toAddTicket () {
      this.$refs.form.open(this.activityId)
    },
    toUpdateTicket ({id}) {
      getTicketDetail({id}).then(({ data }) => {
        this.$refs.form.open(this.activityId, data.data.data)
      })
    },
    toDeleteTicket ({id}) {
      this.$confirm("是否确定删除该票务?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteTicket({ids: [id]}).then(({ data }) => {
          this.getTicketList()
          this.$message.success('删除成功')
        })
      })
    },
    handleFinish () {
      this.getTicketList()
      this.$refs.form.close()
    },
    goBack() {
      this.$router.back();
    },
  }
}
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
.hc-crud-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
}
.hc-crud-table-header {
  color: #333333;
}
</style>
