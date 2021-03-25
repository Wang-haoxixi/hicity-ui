<template>
  <basic-container class="container">
    <hc-table-form
      :title="title"
      :formVisible="formShow"
      @go-back="goBack">
      <hc-crud ref="hcCrud" :fetchListFun="fetchListFun" :option="tableOption">
        <template slot="menu" slot-scope="scope">
          <el-button type="text" size="mini" @click="toView(scope.row)">查看</el-button>
          <el-button v-if="scope.row.shelfStatus == 1" type="text" size="mini" @click="toDelete(scope.row)">下架</el-button>
        </template>
      </hc-crud>
      <template slot="form">
        <coupons-detail v-if="formType == 'coupons'" :detail="couponsDetail" @merchant-view="merchantView"></coupons-detail>
        <merchant-detail v-if="formType == 'merchant'" :detail="merchantDetail"></merchant-detail>
      </template>
    </hc-table-form>
  </basic-container>
</template>

<script>
import { tableOption } from "./const";
import { mapGetters } from "vuex";
import { getCouponsPage, getCouponsDetail, couponsDown } from "@/api/merchantSystem/coupons"
import { getMerchantDetail } from "@/api/mms/merchant";
import CouponsDetail from "@/views/components/BusinessComponents/CouponsDetail/index"
import MerchantDetail from "@/views/components/BusinessComponents/MerchantDetail/index"
export default {
  name: "SysUser",
  components: { CouponsDetail, MerchantDetail },
  data() {
    return {
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
        getCouponsPage({
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
<style lang="scss" scope>
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

