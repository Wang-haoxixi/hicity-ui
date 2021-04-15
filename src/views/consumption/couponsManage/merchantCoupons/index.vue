<template>
  <basic-container class="container">
    <hc-table-form
      :title="title"
      :formVisible="formShow"
      @go-back="goBack">
      <el-tabs v-model="couponStatus">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="上架中" name="1"></el-tab-pane>
        <el-tab-pane label="待上架" name="0"></el-tab-pane>
        <el-tab-pane label="已售罄" name="2"></el-tab-pane>
        <el-tab-pane label="已下架" name="3"></el-tab-pane>
        <el-tab-pane label="仓库中" name="4"></el-tab-pane>
      </el-tabs>
      <hc-crud ref="hcCrud" :fetchListFun="fetchListFun" :option="tableOption">
        <template v-if="userType == 2 || userType == 3" v-slot:menuLeft="">
          <el-button size="mini" @click="recommendManage">推荐管理</el-button>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-button type="text" size="mini" @click="toView(scope.row)">查看</el-button>
          <el-button v-if="scope.row.status == 1" type="text" size="mini" @click="toShelfOff(scope.row)">下架</el-button>
          <el-button v-if="(userType == 2 || userType == 3) && scope.row.isTop == '0'" type="text" size="mini" @click="recommend(scope.row)">推荐</el-button>
        </template>
      </hc-crud>
      <template slot="form">
        <coupons-detail v-if="formType == 'coupons'" :detail="couponsDetail" @merchant-view="merchantView"></coupons-detail>
        <merchant-detail v-if="formType == 'merchant'" :detail="merchantDetail"></merchant-detail>
      </template>
    </hc-table-form>
    <recommend-manage ref="recommend" @refresh="recommendRefresh"></recommend-manage>
  </basic-container>
</template>

<script>
import { tableOption } from "./const";
import { mapGetters } from "vuex";
import { getPlatformCouponsPage, getCityCouponsPage, getCouponsDetail, couponsDown, couponsRecommend } from "@/api/merchantSystem/coupons"
import { getMerchantDetail } from "@/api/mms/merchant";
import CouponsDetail from "@/views/components/BusinessComponents/CouponsDetail/index"
import MerchantDetail from "@/views/components/BusinessComponents/MerchantDetail/index"
import RecommendManage from './RecommendManage'
export default {
  name: "SysUser",
  components: { CouponsDetail, MerchantDetail, RecommendManage },
  data() {
    return {
      couponStatus: 'all',
      formShow: false,
      formType: '',
      couponsDetail: {},
      merchantDetail: {}
    };
  },
  computed: {
    ...mapGetters(["permissions", "userInfo", "dicList", "userType"]),
    tableOption() {
      return tableOption(this.userType == 1 || this.userType == 2);
    },
    getCouponsPage () {
      if (this.userType == 1) {
        return getPlatformCouponsPage
      } else if (this.userType == 2 || this.userType == 3) {
        return getCityCouponsPage
      }
    },
    title () {
      if (!this.formShow) {
        return '商户券'
      } else {
        if (this.formType == 'coupons') {
          return '商户券-详情'
        } else if (this.formType == 'merchant') {
          return '商户详情'
        }
      }
    }
  },
  watch: {
    couponStatus (val) {
      let status = val != 'all' ? val : undefined
      let params = {
        status
      }
      if (status == '0') {
        params.isDepository = '0'
      } else if (status == '4') {
        params = {
          status: '0',
          isDepository: '1'
        }
      } else {
        params.isDepository = undefined
      }
      this.$refs.hcCrud.refresh({}, params)
    }
  },
  methods: {
    goBack () {
      if (this.formShow) {
        if (this.formType == 'merchant') {
          this.formType = 'coupons'
        } else {
          this.formShow = false
        }
      } 
    },
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        this.getCouponsPage({
          ...params,
          type: '0',
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
    toView ({id}) {
      getCouponsDetail(id).then(({ data }) => {
        let couponsDetail = data.data.data
        this.couponsDetail = couponsDetail
        this.formShow = true
        this.formType = 'coupons'
      });
    },
    toShelfOff ({ id }) {
      this.$confirm("是否确认下架该优惠券?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        couponsDown(id).then(({ data }) => {
          this.$notify({
            title: "成功",
            message: "下架成功",
            type: "success",
            duration: 2000,
          });
          this.$refs.hcCrud.refresh()
        });
      }).catch(function () {});
    },
    recommend ({ id }) {
      couponsRecommend({id}).then(({data}) => {
        this.$message.success('操作成功')
        this.$refs.hcCrud.refresh()
      })
    },
    recommendManage () {
      this.$refs.recommend.open()
    },
    recommendRefresh () {
      this.$refs.hcCrud.refresh()
    },
    merchantView (merchantId) {
      getMerchantDetail({ merchantId }).then(({ data }) => {
        this.merchantDetail = data.data.data;
        this.formShow = true
        this.formType = 'merchant'
      });
    }
  },
};
</script>
<style lang="scss" scoped>
.container {
  /deep/.el-input-number__increase {
    right: 1px !important;
    border-left: 1px solid #dcdfe6 !important;
  }
  .form-title {
    padding: 0 20px;
    height: 40px;
  }
}

</style>

