<template>
  <basic-container>
    <hc-table-form
      :title="title"
      :formVisible="viewShow"
      @go-back="goBack">
      <hc-crud ref="hcCrud" :fetchListFun="fetchListFun" :option="tableOption">
        <template slot="menu" slot-scope="scope">
          <!-- <el-button type="text" size="mini" @click="toView(scope.row)">查看</el-button> -->
          <el-button v-if="!scope.row.isHidden" type="text" size="mini" @click="toHide(scope.row)">隐藏</el-button>
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
import { getStoreOrderPage, getStoreOrderDetail, hide } from "@/api/mms/store"
import { getCommentPage, hideComment } from "@/api/cms/common"
import StoreOrderDetail from './detail'
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
        return '评论详情'
      } else {
        return '店铺评论'
      }
    }
  },
  methods: {
    fetchListFun (params) {
      let time = params.time
      if (time) {
        params.startTime = time[0]
        params.endTime = time[1]
        delete params.time
      }
      console.log(params)
      return new Promise((resolve, reject) => {
        getCommentPage({
          type: 5,
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
    toView ({commentId}) {
      this.orderDetail = {}
      getStoreOrderDetail({storeOrderId}).then(({ data }) => {
        this.orderDetail = data.data.data
        this.viewShow = true
      })
    },
    toHide ({commentId}) {
      this.$confirm("是否确认隐藏该条评论？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        hideComment([commentId]).then(({data}) => {
          if (data.code === 0) {
            this.$message.success('隐藏成功')
            this.$refs.hcCrud.refresh()
          }
        }).catch(function() {
        })
      });
    },
    goBack () {
      this.viewShow = false
    },
  },
};
</script>
<style lang="scss" scoped>
</style>

