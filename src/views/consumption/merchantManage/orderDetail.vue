<template>
  <el-form
    label-width="140px"
  >
    <el-form-item label="订单号：">
      {{detail.orderNum}}
    </el-form-item>
    <el-form-item label="订单创建时间：">
      {{detail.createTime}}
    </el-form-item>
    <el-form-item label="收款店铺：">
      {{detail.storeName}}
    </el-form-item>
    <el-form-item label="收款店铺地址：">
      {{detail.address}}
    </el-form-item>
    <el-form-item label="收银员：">
      {{detail.cashierName}}
    </el-form-item>
    <el-form-item label="收款金额：">
      {{detail.paymentAmount}}元
    </el-form-item>
    <el-form-item label="收款商户名称：">
      {{detail.storeManagerName}}
    </el-form-item>
    <el-form-item label="收款商户账户：">
      {{detail.storeManagerAccount}}
    </el-form-item>
    <el-form-item label="订单总额：">
      {{detail.orderTotal}}元
    </el-form-item>
    <el-form-item v-if="detail.totalDiscount" label="优惠总额：">
      {{detail.totalDiscount}}元
    </el-form-item>
    <el-form-item v-if="detail.storeFixedDiscount" label="店铺固定优惠抵扣：">
      {{detail.storeFixedDiscount}}折
    </el-form-item>
    <el-form-item v-if="detail.couponDeduction" label="优惠券抵扣：">
      {{detail.couponDeduction}}元
    </el-form-item>
    <el-form-item label="收款状态：">
      {{getDicValue('STORE_ORDER_STATUS', detail.storeOrderStatus)}}
    </el-form-item>
    <el-form-item v-if="detail.storeOrderStatus == '5'" label="收款成功时间：">
      {{detail.paymentTime}}
    </el-form-item>
    <el-form-item v-if="detail.storeOrderStatus == '3' || detail.storeOrderStatus == '4'" label="收款取消时间：">
      {{detail.cancelTime}}
    </el-form-item>
  </el-form>
</template>

<script>
import { getDicValue } from '@/util/dic'
import { mapGetters } from 'vuex'
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index"
import HcImageUpload from "@/views/components/HcImageUpload/index"
import HcMapView from "@/views/components/HcMap/HcMapView/index"
export default {
  components: {
    HcCitySelect,
    HcImageUpload,
    HcMapView
  },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    getDicValue
  },
  computed: {
    ...mapGetters(["userInfo"]),
  }
}
</script>

<style lang="scss" scoped>
.store-base {
  display: flex;
  height: 100px;
  .store-logo {
    height: 80px;
    width: 80px;
    flex: 80px 0 0;
  }
  .name-address {
    margin-left: 20px;
    height: 80px;
    flex: 80px 1 1;
    .name {
      height: 50px;
      line-height: 50px;
      font-size: 20px;
      font-weight: bold;
    }
    .address {
      height: 30px;
      line-height: 30px;
      font-size: 16px;
    }
  }
}
</style>
