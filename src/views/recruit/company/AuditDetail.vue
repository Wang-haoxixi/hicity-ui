<template>
  <div>
    <div v-for="(detail, index) in details" :key="index" class="audit-detail">
      <div v-if="detail.certificationStatus != 0" class="audit-item audit-result">
        <div class="item-time">{{detail.updateTime}}</div>
        <div class="item-content">
          <div class="item-content-title">{{detail.certificationStatus == 1 ? '审核通过' : '审核不通过'}}</div>
          <div v-if="detail.certificationStatus == 2">
            驳回原因：{{detail.certificationDesc}}
          </div>
        </div>
      </div>
      <div class="audit-item audit-wait">
        <div class="item-time">{{detail.createTime}}</div>
        <div class="item-content">
          <div class="item-content-title">提交招聘资质认证</div>
          <div class="item-content-user">
            <el-image class="avatar" :src="detail.avatar"></el-image>
            <div class="name">{{detail.createByName}}</div>
          </div>
          <div class="item-content-company">公司名称：{{detail.companyName}}</div>
          <el-image class="item-content-license" :src="detail.businessLicense" fit="cover" :preview-src-list="[detail.businessLicense]"></el-image>
          <div v-if="detail.certificationStatus == 0" class="btn-list">
            <el-button class="button-item" @click="toAuditBack(detail.id)">驳回</el-button>
            <el-button class="button-item" type="primary" @click="auditPass(detail.id)">通过</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="驳回原因"
      :visible.sync="dialogVisible"
      width="400px">
      <el-form>
        <el-form-item label="拒绝理由" label-width="80px">
          <el-select v-model="reasonType" @change="reason = ''">
            <el-option v-for="(option, index) in reasons" :key="index" :value="option.value" :label="option.label">{{option.label}}</el-option>
          </el-select>
          <el-input v-if="reasonType == '其他'" v-model="reason" style="margin-top: 20px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="auditBack">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { audit } from "@/api/recruit/company"
import { offShelf } from "@/api/recruit/position"
import { mapGetters } from "vuex"
import { getDicValue } from "@/util/dic"
export default {
  props: {
    details: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dialogVisible: false,
      handleId: '',
      reasonType: '',
      reason: '',
    }
  },
  computed: {
    ...mapGetters(['dicList']),
    reasons () {
      return [
        ...this.dicList['COMPANY_REJECT_REASON'],
        {
          label: '其他',
          value: '其他'
        }
      ]
    }
  },
  methods: {
    auditPass (id) {
      audit({
        id,
        certificationStatus: 1
      }).then(({data}) => {
        this.$message.success(`操作成功`)
        this.$emit('refresh')
      })
    },
    auditBack () {
      let reason = ''
      if (!this.reasonType) {
        this.$message.warning('请选择驳回理由')
      }
      if (this.reasonType != '其他') {
        reason = getDicValue('COMPANY_REJECT_REASON', this.reasonType)
      } else {
        reason = this.reason
      }
      if (reason) {
        audit({
          id: this.handleId,
          certificationStatus: 2,
          certificationDesc: reason
        }).then(({data}) => {
          this.$message.success(`操作成功`)
          this.$emit('refresh')
        })
      } else {
        this.$message.warning('请填写驳回理由')
      }
    },
    toAuditBack (id) {
      this.handleId = id
      this.dialogVisible = true
    },
  }
}
</script>

<style lang="scss" scoped>
.audit-detail {
  margin-left: 100px;
  width: 600px;
  font-size: 14px;
  padding: 20px 0;
  &:not(:first-child) {
    border-top: 1px solid #DDDDDD;
  }
}
.audit-item {
  display: flex;
  .item-time {
    flex: 160px 0 0;
    height: 40px;
    line-height: 40px;
    color: #999999;
  }
  .item-content {
    font-size: 16px;
    flex: 200px 1 1;
    .item-content-title {
      height: 40px;
      line-height: 40px;
    }
    .item-content-user {
      margin-top: 10px;
      height: 40px;
      display: flex;
      align-items: center;
      .avatar {
        flex: 30px 0 0;
        height: 30px;
        width: 30px;
        border-radius: 40px;
      }
      .name {
        margin-left: 10px;
        height: 30px;
        line-height: 30px;
        font-size: 16px;
      }
    }
    .item-content-company {
      margin-top: 10px;
      height: 40px;
      line-height: 40px;
    }
    .item-content-license {
      margin-top: 10px;
      height: 150px;
      width: 300px;
    }
    .btn-list {
      margin-top: 10px;
      .button-item {
        margin-right: 20px;
        padding: {
          left: 40px;
          right: 40px;
        }
      }
    }
  }
}
</style>
