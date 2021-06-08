<template>
  <el-form
    ref="form"
    class="dialog-main-tree"
    :model="detail"
    label-width="200px">
    <h3 class="form-title">基本信息</h3>
    <el-form-item label="券ID：">
      {{detail.couponsId}}
    </el-form-item>
    <el-form-item label="券名称：">
      {{detail.couponsName}}
    </el-form-item>
    <el-form-item label="券类型：" prop="category">
      {{getType(detail)}}
    </el-form-item>
    <el-form-item label="券门类：" prop="category">
      {{getDicValue('COUPONS_CATEGORY', detail.category)}}
    </el-form-item>
    <el-form-item label="使用说明：">
      {{detail.instructions}}
    </el-form-item>
    <el-form-item label="优惠券种类：">
      {{getClass(detail)}}
    </el-form-item>
    <el-form-item label="优惠内容：">
      {{detail.conditionPriceTip}}
    </el-form-item>

    <el-form-item label="使用范围：">
      {{getScope(detail)}}
    </el-form-item>
    <el-form-item label="可使用商品：">
      {{detail.isAllCategory ? '全部商品可用' : '部分商品可用'}}
    </el-form-item>
    <el-form-item v-if="!detail.isAllCategory" label="特殊说明：">
      {{detail.specialRemarks}}
    </el-form-item>
    <el-form-item label="有效期：">
      {{detail.effectiveTimeTip}}
    </el-form-item>
    <el-form-item label="上架时间：">
      {{detail.upTime}}
    </el-form-item>
    <el-form-item label="下架时间：">
      {{detail.downTime}}
    </el-form-item>
    <el-form-item label="优惠券状态：">
      {{getDicValue('COUPONS_STATUS', detail.status)}}
    </el-form-item>

    <h3 class="form-title">发券信息</h3>
    <el-form-item label="发券人：">
      {{detail.userRealName}}
    </el-form-item>
    <el-form-item label="发券人账户：">
      {{detail.userAccount}}
    </el-form-item>
    <template v-if="detail.type == '0'">
      <el-form-item label="发券店铺：">
        {{detail.storeName}}
      </el-form-item>
      <el-form-item label="发券店铺统一社会信用代码：">
        {{detail.storeBusinessLicense}}
      </el-form-item>
    </template>
    <el-form-item label="发券时间：">
      {{detail.createTime}}
    </el-form-item>
    <el-form-item label="发券数量：">
      {{detail.supply}}
    </el-form-item>

    <h3 class="form-title">领券信息</h3>
    <el-form-item label="已领取数量：">
      {{detail.receivedNum}}
    </el-form-item>
    <el-form-item label="已核销数量：">
      {{detail.writtenOffNum}}
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
  methods: {
    getDicValue,
    toViewMerchant (merchantId) {
      this.$emit('merchant-view', merchantId)
    },
    getType (detail) {
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
    getScope (detail) {
      if (detail.type == '1') {
        return detail.storeName
      } else {
        return `限店铺 “${detail.storeName}”`
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
      } else if (detail.deductionType == '5') {
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
