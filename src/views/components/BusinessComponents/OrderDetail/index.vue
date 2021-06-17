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
    <el-form-item label="订单状态：">
      {{getDicValue('STORE_ORDER_STATUS', detail.storeOrderStatus)}}
    </el-form-item>
    <template v-if="detail.storeOrderStatus == 3 || detail.storeOrderStatus == 4">
      <el-form-item label="取消时间：">
        {{detail.cancelTime}}
      </el-form-item>
      <el-form-item label="取消原因：">
        {{detail.cancelReason}}
      </el-form-item>
    </template>
    <el-form-item label="支付金额：">
      ￥{{detail.paymentAmount}}
    </el-form-item>
    <template v-if="detail.storeOrderStatus == 5">
      <el-form-item label="支付时间：">
        {{detail.paymentTime}}
      </el-form-item>
      <el-form-item label="支付方式：">
        {{detail.paymentMethod == '1' ? '微信支付' : ''}}
      </el-form-item>
    </template>
    <el-form-item label="平台抽成模式：">
      {{getDicValue('PERCENTAGE_TYPE', detail.percentageType)}}
    </el-form-item>
    <el-form-item v-if="detail.percentageType == 2 || detail.percentageType == 3" label="平台抽成比例：">
      {{detail.percentageMoney}}%
    </el-form-item>
    <el-form-item v-if="detail.percentageType == 4" label="平台抽成金额：">
      ￥{{detail.percentageMoney}}
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
      {{detail.cashierPhone}}
    </el-form-item>
    <el-form-item label="店铺名称：">
      {{detail.storeName}}
    </el-form-item>
    <el-form-item label="店铺统一社会信用代码：">
      {{detail.businessLicense}}
    </el-form-item>

    <h3 class="form-title">优惠信息</h3>
    <el-form-item label="优惠总额：">
      ￥{{detail.totalDiscount}}
    </el-form-item>
    <el-form-item label="店铺固定优惠抵扣：">
      {{detail.storeFixedDiscount}}折
    </el-form-item>
    <el-form-item label="平台/商家优惠券抵扣：">
      ￥{{detail.couponDeduction}}
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
      ￥{{detail.unavailableAmount}}
    </el-form-item>

    <template v-if="detail.storeOrderStatus == 5">
      <h3 class="form-title">订单金额</h3>
      <el-form-item label="订单总金额：">
        ￥{{detail.orderTotal}}
      </el-form-item>
      <el-form-item label="用户实际支付：">
        ￥{{detail.paymentAmount}}
      </el-form-item>
      <el-form-item label="微信交易手续费：">
        ￥{{detail.totalServiceCharge}}
      </el-form-item>
      <el-form-item label="平台抽成总额：">
        ￥{{detail.totalCommission}}
      </el-form-item>
      <el-form-item label="商户实收金额：">
        ￥{{detail.receivedAmount}}
      </el-form-item>

      <template v-if="detail.commissionListPc && detail.commissionListPc.length > 0">
        <h3 class="form-title">平台分成信息</h3>
        <el-form-item v-for="(item, index) in detail.commissionListPc" :key="index" :label="getAccount(item.accountType) + item.account + '分成金额：'">
          ￥{{item.money}}
        </el-form-item>
      </template>

      <template v-if="detail.serviceChargeListPc && detail.serviceChargeListPc.length > 0">
        <h3 class="form-title">微信手续费分摊信息</h3>
        <el-form-item v-for="(item, index) in detail.serviceChargeListPc" :key="'wx' + index" :label="getAccount(item.accountType) + item.account + '分摊金额：'">
          ￥{{item.money}}
        </el-form-item>
      </template>

      <h3 class="form-title">商户分账信息</h3>
      <template v-if="detail.arriveStatus">
        <el-form-item label="到账状态：">
          {{getArriveStatus(detail.arriveStatus)}}
        </el-form-item>
        <el-form-item label="到账账户：">
          {{detail.accountReceived}}
        </el-form-item>
        <el-form-item label="到账金额：">
          ￥{{detail.arriveAmount}}
        </el-form-item>
        <el-form-item v-if="detail.arriveStatus == '2'" label="到账时间：">
          {{detail.arriveTime}}
        </el-form-item>
      </template>
      <template v-if="detail.settleStatus">
        <el-form-item label="平台券结算状态：">
          {{getSettleStatus(detail.settleStatus)}}
        </el-form-item>
        <el-form-item label="平台券结算账户：">
          {{detail.settleAccount}}
        </el-form-item>
        <el-form-item v-if="detail.settleStatus == '2'" label="平台券结算金额：">
          ￥{{detail.settleAmount}}
        </el-form-item>
        <el-form-item v-if="detail.settleStatus == '2'" label="平台券结算日期：">
          {{detail.settleTime}}
        </el-form-item>
        <el-form-item v-if="detail.settleStatus != '2'" label="平台券待结算金额：">
          ￥{{detail.settleAmount}}
        </el-form-item>
        <el-form-item v-if="detail.settleStatus != '2'" label="平台券预计结算日期：">
          {{detail.platformCouponSettlementDate}}
        </el-form-item>
      </template>
    </template>



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
    getDicValue,
    toViewMerchant (merchantId) {
      this.$emit('merchant-view', merchantId)
    },
    getCategory (category) {
      return getDicValue('COUPONS_CATEGORY', category)
    },
    getArriveStatus (status) {
      switch (status) {
        case '1':
          return '未到账'
        case '2':
          return '已到账'
        case '3':
          return '到账失败'
        default:
          return ''
      }
    },
    getSettleStatus (status) {
      switch (status) {
        case '1':
          return '未结算'
        case '2':
          return '已结算'
        case '3':
          return '结算失败'
        default:
          return ''
      }
    },
    getAccount (type) {
      if (type == '1') {
        return '商户'
      } else if (type == '2') {
        return '合伙人'
      } else if (type == '3') {
        return '平台'
      } else {
        return ''
      }2
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
