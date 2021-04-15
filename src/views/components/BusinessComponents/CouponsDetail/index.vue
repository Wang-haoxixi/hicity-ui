<template>
  <el-form
    ref="form"
    class="dialog-main-tree"
    :model="detail"
    label-width="150px">
    <h3 class="form-title">基本信息</h3>
    <el-form-item label="券名称：">
      {{detail.name}}
    </el-form-item>
    <el-form-item label="券门类：" prop="category">
      {{getCategory(detail.category)}}
    </el-form-item>
    <el-form-item v-if="detail.type == '0'" label="所属商户：">
      <el-button type="text" @click="toViewMerchant(detail.merchantId)">{{detail.merchantName}}</el-button>
    </el-form-item>
    <el-form-item label="抵扣价：">
      ￥{{detail.deductionPrice}}
    </el-form-item>
    <el-form-item label="满足条件：">
      满{{detail.conditionPrice}}元可用
    </el-form-item><el-form-item label="是否放入仓库：">
      {{detail.isDepository == "1" ? "是" : '否'}}
    </el-form-item>
    <el-form-item v-if="detail.isDepository == '0'" label="可用时间：">
      {{detail.availableStartTime}} 至 {{detail.isPermanent == '1' ? '永久有效' : detail.availableEndTime}}
    </el-form-item>
    <el-form-item label="logo：">
      <el-image style="height: 150px;width: 150px;" :src="detail.logo"></el-image>
    </el-form-item>
    <el-form-item label="购买须知：">
      {{detail.instructions}}
    </el-form-item>

    <template v-if="detail.isDepository == '0'">
      <h3 class="form-title">上下架时间</h3>
      <el-form-item label="上架时间：">
        {{detail.upTime}}
      </el-form-item>
      <el-form-item label="下架时间：">
        {{detail.isPermanent == '1' ? '长期有效' : detail.downTime}}
      </el-form-item>
    </template>

    <h3 class="form-title">领取限制</h3>
    <el-form-item v-if="detail.type == '1'" label="发布城市：">
      <hc-city-select :value="detail.scopeOfUseCity.split(',').map(item => parseInt(item))" viewOnly :city-id="$store.getters.userInfo.manageCityId"></hc-city-select>
    </el-form-item>
    <el-form-item label="用户可领个数：">
      活动期间每个用户可参与 {{detail.limitNum}} 个
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
