<template>
  <el-form label-width="100px" style="padding-left: 50px;">
    <el-form-item label="职位名称：">{{positionDetail.name}}</el-form-item>
    <el-form-item label="工作城市：">{{positionDetail.city}}</el-form-item>
    <el-form-item label="工作地点：">{{positionDetail.detailsAddress}}</el-form-item>
    <el-form-item label="经验：">{{positionDetail.experienceLable}}</el-form-item>
    <el-form-item label="学历：">{{positionDetail.educationLable}}</el-form-item>
    <el-form-item label="薪资范围：">{{positionDetail.salaryLable}}</el-form-item>
    <el-form-item label="职位描述：">
      <div style="max-width: 400px;">{{positionDetail.describe}}</div>
    </el-form-item>
    <el-form-item label="职位标签：">{{positionDetail.lableInfoList && positionDetail.lableInfoList.map(item => item.positionLable).join(' , ') || ''}}</el-form-item>
    <el-form-item>
      <el-button v-if="positionDetail.status == '1'" @click="offShelf(positionDetail)">下架</el-button>
      <template v-if="positionDetail.status == '3' && positionDetail.auditStatus == '1'">
        <el-button type="primary" @click="audit(positionDetail, 'pass')">上架</el-button>
        <el-button @click="audit(positionDetail, 'reject')">拒绝</el-button>
      </template>
    </el-form-item>
  </el-form>
</template>

<script>
import { offShelf, audit } from "@/api/recruit/position"
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
  },
  methods: {
    audit ({recruitPositionId}, sign) {
      let text = sign == 'pass' ? '上架' : '拒绝'
      this.$prompt(`${text}理由：`, text, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: `请输入${text}理由`,
        inputValidator: function (value) {
          if (value && value.length < 51) {
            return true
          } else if (!value) {
            return `${text}理由不能为空`
          } else {
            return `${text}理由不能超过50字`
          }
        },
      }).then(({ value }) => {
        audit({
          recruitPositionId,
          remarks: value,
          sign
        }).then(({ data }) => {
          this.$message.success(`${text}成功`)
          this.$emit('refresh')
        })
      }).catch(() => {
      });
    },
    offShelf ({recruitPositionId}) {
      this.$prompt('下架理由：', '下架', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '请输入下架理由',
        inputValidator: function (value) {
          if (value && value.length < 51) {
            return true
          } else if (!value) {
            return '下架理由不能为空'
          } else {
            return '下架理由不能超过50字'
          }
        },
      }).then(({ value }) => {
        offShelf({
          recruitPositionId,
          remarks: value
        }).then(({ data }) => {
          this.$message.success('下架成功')
          this.$emit('refresh')
        })
      }).catch(() => {
      });
    }
  }
}
</script>

<style lang="" scoped>
</style>
