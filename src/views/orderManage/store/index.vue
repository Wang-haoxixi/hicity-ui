<template>
  <basic-container>
    <hc-table-form
      :title="title"
      :formVisible="viewShow"
      @go-back="goBack">
      <hc-crud ref="hcCrud" :fetchListFun="fetchListFun" :option="tableOption">
        <template slot="menu" slot-scope="scope">
          <el-button type="text" size="mini" @click="toView(scope.row)">查看</el-button>
        </template>
      </hc-crud>
      <template slot="form">
        <store-order-detail :detail="orderDetail"></store-order-detail>
      </template>
    </hc-table-form>
    
  </basic-container>
</template>

<script>
import { tableOption } from "./const";
import { mapGetters } from "vuex";
import { getStoreOrderPage, getStoreOrderDetail } from "@/api/mms/store"
import StoreOrderDetail from './orderDetail'
export default {
  components: { StoreOrderDetail },
  data() {
    return {
      viewShow: false,
      orderDetail: {}
    };
  },
  computed: {
    ...mapGetters(["permissions", "userInfo", "dicList", "userType"]),
    tableOption() {
      return tableOption();
    },
    title () {
      if (this.viewShow) {
        return '订单详情'
      } else {
        return '订单管理'
      }
    }
  },
  methods: {
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        getStoreOrderPage({
          ...params,
        }).then(({ data }) => {
          resolve({
            records: data.data.data.records,
            page: {
              total: data.data.data.total
            }
          })
        }, error => {
          reject(error)
        })
      })
    },
    toView ({storeOrderId}) {
      this.orderDetail = {}
      getStoreOrderDetail({storeOrderId}).then(({ data }) => {
        this.orderDetail = data.data.data
        this.viewShow = true
      })
    },
    goBack () {
      this.viewShow = false
    },
  },
};
</script>
<style lang="scss" scoped>
</style>

