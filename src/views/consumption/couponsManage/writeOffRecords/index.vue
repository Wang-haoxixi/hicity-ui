<template>
  <basic-container>
    <hc-table-form
      :title="title"
      :formVisible="viewShow"
      @go-back="viewShow = false">
      <hc-crud ref="hcCrud" :fetchListFun="fetchListFun" :option="tableOption">
        <template v-slot:name="scope">
          <span style="color: #0909ff;cursor: pointer" @click="couponsView(scope.row.couponsId)">{{scope.row.name}}</span>
        </template>
        <template v-slot:merchantName="scope">
          <span style="color: #0909ff;cursor: pointer" @click="merchantView(scope.row.merchantId)">{{scope.row.merchantName}}</span>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-button type="text" size="mini" @click="toView(scope.row)">查看</el-button>
        </template>
      </hc-crud>
      <template slot="form">
        <coupons-detail v-if="viewType == 'coupons'"  :detail="couponsDetail"></coupons-detail>
        <merchant-detail v-if="viewType == 'merchant'" :detail="merchantDetail"></merchant-detail>
      </template>
    </hc-table-form>
    
    <coupons-records-view ref="view"></coupons-records-view>
  </basic-container>
</template>

<script>
import { tableOption } from "./const";
import { mapGetters } from "vuex";
import { getMerchantDetail } from "@/api/mms/merchant"
import { getPlatformWriteoffList, getCityWriteoffList, getCouponsDetail } from "@/api/merchantSystem/coupons"
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
      merchantDetail: {},
    };
  },
  computed: {
    ...mapGetters(["permissions", "userInfo", "dicList", "userType"]),
    tableOption() {
      return tableOption(this.userType == 1 || this.userType == 2);
    },
    title () {
      if (this.viewShow) {
        return '券详情'
      } else {
        return '核销记录'
      }
    }
  },
  methods: {
    fetchListFun (params) {
      let getWriteoffList = this.userType == 1 ? getPlatformWriteoffList : getCityWriteoffList
      return new Promise((resolve, reject) => {
        getWriteoffList({
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
      this.$refs.view.open('writeOff', row.couponsId)
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
  },
};
</script>
<style lang="scss" scoped>
</style>

