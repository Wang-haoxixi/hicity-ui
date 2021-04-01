<template>
  <el-form label-width="100px" style="padding-left: 50px;">
    <el-form-item label="职位名称：">{{positionDetail.name}}</el-form-item>
    <el-form-item label="工作城市：">{{positionDetail.city}}</el-form-item>
    <el-form-item label="工作地点：">{{positionDetail.detailsAddress}}</el-form-item>
    <el-form-item label="经验：">{{positionDetail.experience}}</el-form-item>
    <el-form-item label="学历：">{{positionDetail.education}}</el-form-item>
    <el-form-item label="薪资范围：">{{positionDetail.salaryLable}}</el-form-item>
    <el-form-item label="职位描述：">
      <div style="max-width: 400px;">{{positionDetail.describe}}</div>
    </el-form-item>
    <el-form-item label="职位标签：">{{positionDetail.lableInfoList && positionDetail.lableInfoList.map(item => item.positionLable).join(' , ') || ''}}</el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    positionDetail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="" scoped>
</style>
