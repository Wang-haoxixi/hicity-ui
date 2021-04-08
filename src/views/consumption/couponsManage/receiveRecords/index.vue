<template>
  <basic-container>
    <hc-table-form
      :title="title"
      :formVisible="viewShow"
      @go-back="goBack">
      <hc-crud ref="hcCrud" :fetchListFun="fetchListFun" :option="tableOption">
        <template v-slot:name="scope">
          <el-button type="text" @click="couponsView(scope.row.couponsId)">{{scope.row.name}}</el-button>
          <!-- <span style="color: #0909ff;cursor: pointer" @click="couponsView(scope.row.couponsId)">{{scope.row.name}}</span> -->
        </template>
        <template slot="menu" slot-scope="scope">
          <el-button type="text" size="mini" @click="toView(scope.row)">查看</el-button>
        </template>
      </hc-crud>
      <template slot="form">
        <coupons-detail v-if="viewType == 'coupons'" :detail="couponsDetail" @merchant-view="merchantView"></coupons-detail>
        <merchant-detail v-if="viewType == 'merchant'" :detail="merchantDetail"></merchant-detail>
      </template>
    </hc-table-form>
    
    <coupons-records-view ref="view"></coupons-records-view>
  </basic-container>
</template>

<script>
import { tableOption } from "./const";
import { mapGetters } from "vuex";
import { getPlatformReceiveList, getCityReceiveList, getCouponsDetail } from "@/api/merchantSystem/coupons"
import { getMerchantDetail } from "@/api/mms/merchant"
import CouponsRecordsView from "@/views/components/BusinessComponents/CouponsRecordsView/index"
import CouponsDetail from "@/views/components/BusinessComponents/CouponsDetail/index"
import MerchantDetail from "@/views/components/BusinessComponents/MerchantDetail/index"
import 'swiper/swiper.scss'
export default {
  components: { CouponsRecordsView, CouponsDetail, MerchantDetail },
  data() {
    return {
      viewShow: false,
      viewType: '',
      couponsDetail: {},
      merchantDetail: {}
    };
  },
  computed: {
    ...mapGetters(["permissions", "userInfo", "dicList", "userType"]),
    tableOption() {
      return tableOption();
    },
    title () {
      if (this.viewShow) {
        if (this.viewType == 'coupons') {
          return '券详情'
        } else if (this.viewType == 'merchant') {
          return '商户详情'
        }
      } else {
        return '领取记录'
      }
    }
  },
  methods: {
    fetchListFun (params) {
      let getReceiveList = this.userType == 1 ? getPlatformReceiveList : getCityReceiveList
      return new Promise((resolve, reject) => {
        getReceiveList({
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
    toView (row) {
      this.$refs.view.open('order', row.couponsId, row.writeOffStatus == '1')
    },
    couponsView (couponsId) {
      getCouponsDetail(couponsId).then(({ data }) => {
        this.couponsDetail = data.data.data
        this.viewShow = true
        this.viewType = 'coupons'
      });
    },
    merchantView (merchantId) {
      getMerchantDetail({ merchantId }).then(({ data }) => {
        this.merchantDetail = data.data.data;
        this.viewShow = true
        this.viewType = 'merchant'
      });
    },
    goBack () {
      if (this.viewShow) {
        if (this.viewType == 'merchant') {
          this.viewType = 'coupons'
        } else {
          this.viewShow = false
        }
      } 
    },
  },
};
</script>
<style lang="scss" scoped>
</style>

