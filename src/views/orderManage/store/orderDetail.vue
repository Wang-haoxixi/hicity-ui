<template>
  <el-form
    ref="form"
    class="dialog-main-tree"
    :model="detail"
    label-width="200px">
    <h3 class="form-title">基础信息</h3>
    <el-form-item label="订单号：">
      {{detail.orderNum}}
    </el-form-item>
    <el-form-item label="创建时间：">
      {{detail.createTime}}
    </el-form-item>
    <el-form-item label="支付金额：">
      {{detail.paymentAmount}}
    </el-form-item>
    <el-form-item label="订单状态：">
      {{detail.orderStatus}}
    </el-form-item>
    <el-form-item label="取消时间：">
      {{detail.cancelTime}}
    </el-form-item>
    <el-form-item label="取消原因：">
      {{detail.cancelReason}}
    </el-form-item>
    <el-form-item label="支付时间：">
      {{detail.paymentTime}}
    </el-form-item>
    <el-form-item label="支付方式：">
      {{detail.paymentMethod}}
    </el-form-item>
    <el-form-item label="平台抽成模式：">
      {{detail.percentageType}}
    </el-form-item>
    <el-form-item label="平台抽成比例：">
      {{detail.percentageMoney}}
    </el-form-item>

    <h3 class="form-title">交易双方信息</h3>
    <el-form-item label="付款人：">
      {{detail.payerName}}
    </el-form-item>
    <el-form-item label="付款账户：">
      {{detail.payerPhone}}
    </el-form-item>
    <el-form-item label="收款商户姓名：">
      {{detail.storeManagerName}}
    </el-form-item>
    <el-form-item label="收款商户账户：">
      {{detail.storeManagerAccount}}
    </el-form-item>
    <el-form-item label="收银员姓名：">
      {{detail.cashierName}}
    </el-form-item>
    <el-form-item label="收银员账户：">
      {{detail.cashierAccount}}
    </el-form-item>
    <el-form-item label="店铺名称：">
      {{detail.storeName}}
    </el-form-item>
    <el-form-item label="店铺统一社会信用代码：">
      {{detail.businessLicense}}
    </el-form-item>

    <h3 class="form-title">交易双方信息</h3>
    <el-form-item label="优惠总额：">
      {{detail.totalDiscount}}元
    </el-form-item>
    <el-form-item label="店铺固定优惠抵扣：">
      {{detail.storeFixedDiscount}}折
    </el-form-item>
    <el-form-item label="平台/商家优惠券抵扣：">
      {{detail.couponDeduction}}
    </el-form-item>
    <el-form-item label="核销优惠券ID：">
      {{detail.writeOffCouponsId}}
    </el-form-item>
    <el-form-item label="核销优惠券名称：">
      {{detail.writeOffCouponsName}}
    </el-form-item>
    <el-form-item label="优惠券编号：">
      {{detail.couponNumber}}
    </el-form-item>
    <el-form-item label="不可用优惠券商品金额：">
      {{detail.unavailableAmount}}元
    </el-form-item>

    <h3 class="form-title">订单金额</h3>
    <el-form-item label="订单总金额：">
      {{detail.orderTotal}}元
    </el-form-item>
    <el-form-item label="用户实际支付：">
      {{detail.paymentAmount}}元
    </el-form-item>
    <el-form-item label="平台抽成总额：">
      {{detail.shareTotal}}元
    </el-form-item>
    <el-form-item label="商户实收金额：">
      {{detail.receivedAmount}}元
    </el-form-item>

    <h3 class="form-title">平台分成信息</h3>
    <el-form-item v-for="(item, index) in shareList" :key="index" :label="item.shareAccount + '分成金额：'">
      {{item.shareAmount}}元
    </el-form-item>

  </el-form>
</template>

<script>
import { getDicValue } from "@/util/dic"
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index"

export default {
  components: { HcCitySelect },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    shareList () {
      if (this.detail && this.detail.shareJson) {
        return JSON.parse(this.detail.shareJson) || []
      } else {
        return []
      }
    }
  },
  methods: {
    toViewMerchant (merchantId) {
      this.$emit('merchant-view', merchantId)
    },
    getCategory (category) {
      return getDicValue('COUPONS_CATEGORY', category)
    },
    getTypey (detail) {
      if (detail.deductionType == '1') {
        return '店铺折扣券'
      } else if (detail.type == '0') {
        return '商户券'
      } else if (detail.type == '1') {
        return '平台券'
      } else {
        return ''
      }
    },
    getClass (detail) {
      let name = ''
      if (detail.receiveType == '1') {
        name += '新人'
      } else if (detail.receiveType == '2') {
        name += '首单'
      }
      if (detail.deductionType == '1') {
        name += '店铺折扣券'
      } else if (detail.deductionType == '2') {
        name += '立减现金券'
      } else if (detail.deductionType == '3') {
        name += '满减现金券'
      } else if (detail.deductionType == '4') {
        name += '满减折扣券'
      } else if (detail.deductionType == '4') {
        name += '立减折扣券'
      }
      return name
    },
    getDeduction (detail) {
      if (detail.deductionType == '1') {
        return `${detail.discountRatio}折`
      } else if (detail.deductionType == '2') {
        return `减`
      } else if (detail.deductionType == '3') {
        return `满${detail.conditionPrice}减${detail.deductionPrice}`
      } else if (detail.deductionType == '4') {
        return `满${detail.conditionPrice}打${detail.discountRatio}折`
      } else if (detail.deductionType == '4') {
        return `${detail.discountRatio}折`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
