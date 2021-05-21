<template>
  <el-form
    ref="form"
    class="dialog-main-tree"
    :model="detail"
    label-width="150px">
    <h3 class="form-title">基本信息</h3>
    <el-form-item label="券ID：">
      {{detail.id}}
    </el-form-item>
    <el-form-item label="券名称：">
      {{detail.name}}
    </el-form-item>
    <el-form-item label="券类型：" prop="category">
      {{getTypey(detail)}}
    </el-form-item>
    <el-form-item label="券门类：" prop="category">
      {{getCategory(detail.category)}}
    </el-form-item>
    <el-form-item label="使用说明：">
      {{detail.instructions}}
    </el-form-item>
    <el-form-item label="优惠券种类：">
      {{getClass(detail)}}
    </el-form-item>
    <el-form-item label="优惠内容：">
      {{getDeduction(detail)}}
    </el-form-item>
    <el-form-item label="上架时间：">
      {{detail.upTime}}
    </el-form-item>
    <el-form-item label="下架时间：">
      {{detail.isPermanent == '1' ? '长期有效' : detail.downTime}}
    </el-form-item>

  </el-form>
</template>

<script>
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
    toViewMerchant (merchantId) {
      this.$emit('merchant-view', merchantId)
    },
    getCategory (category) {
      if (category === 0) {
        return '餐饮外卖'
      } else if (category === 1) {
        return '商超购物'
      } else if (category === 2) {
        return '出行玩乐'
      } else if (category === 3) {
        return '电影演出'
      } else {
        return ''
      }
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
