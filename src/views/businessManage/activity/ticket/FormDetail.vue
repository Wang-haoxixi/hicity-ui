<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="1000px"
    append-to-body
    :before-close="dialogBeforeClose">
    <div class="form-detail-container">
      <el-form ref="form" :model="formData" label-width="auto" :rules="formRules">
        <el-row>
          <el-col :span="8">
            <el-form-item label="票务种类：" prop="ticketingType">
              <el-select v-model="formData.ticketingType" style="width: 80%;" @change="typeChange" :disabled="isBuy">
                <el-option label="免费票" value="1">免费票</el-option>
                <el-option label="付费票" value="2">付费票</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="票务名称：" prop="ticketingName">
              <el-input v-model="formData.ticketingName" placeholder="如早鸟票、普通票、VIP票" style="width: 80%;" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="票种数量：" prop="number">
              <el-input-number v-model="formData.number" :min="1" :max="10000" placeholder="" style="width: 80%;" :disabled="isBuy"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单次购票数量：" prop="limitTicket">
              <el-input-number v-model="formData.limitTicket" :min="1" :max="10000" placeholder="" style="width: 80%;"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col  :span="8">
            <el-form-item v-if="formData.ticketingType == 1" label="票种审核：" prop="needAudit">
              <el-switch v-model="formData.needAudit" :active-value="true" :inactive-value="false"></el-switch>
            </el-form-item>
            <el-form-item v-if="formData.ticketingType == 2" label="允许退票：" prop="allowedRefund">
              <el-switch v-model="formData.allowedRefund" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="formData.ticketingType == 2">
          <el-col :span="8">
            <el-form-item label="票务金额：" prop="price">
              <hc-input v-model="priceTemp" :decimal="2" :min="0.01" :max="99999999.99" maxlength="11" style="width: 200px;" :disabled="isBuy">
                <div slot="append">元</div>
              </hc-input>
              <!-- <el-input v-model="priceTemp">
                <div slot="append">元</div>
              </el-input> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="票务备注" prop="remarks">
          <el-input v-model="formData.remarks" type="textarea" maxlength="100" show-word-limit :autosize="{minRows: 4, maxRows: 8}" placeholder="请输入备注内容"></el-input>
        </el-form-item>
        <el-form-item label="其他内容" prop="others">
          <el-switch v-model="hasOthers"></el-switch>
        </el-form-item>
        <el-form-item v-if="hasOthers" label="" prop="ticketConfig">
          <option-form ref="optionForm" :init-form="ticketConfig"></option-form>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="save()">保 存</el-button>
      <el-button @click="reset()">重 置</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addTicket, updateTicket } from "@/api/activity/ticketing"
import { deepClone } from "@/util/util"
import OptionForm from "./OptionForm.vue"
import HcInput from "@/views/components/HcForm/HcInput/index"
export default {
  components: { OptionForm, HcInput },
  data () {
    return {
      isBuy: false,//是否购票
      dialogVisible: false,
      detailType: 'add',
      resetFormData: {},
      formData: {
        ticketingType: '1',
        ticketingName: '免费票',
        number: 1,
        limitTicket: 1,
        // needAudit: true,
        needAudit: false,
      },
      formRules: {
        ticketingType: [{required: true, message: '请选择票务种类', trigger: 'blur'}],
        ticketingName: [{required: true, message: '请填写票务名称', trigger: 'blur'}],
        number: [{required: true, message: '请填写票种数量', trigger: 'blur'}],
        limitTicket: [{required: true, message: '请填写单词购票数量', trigger: 'blur'}],
        price: [{validator: this.priceValidator, message: '请填写票务金额', trigger: 'blur'}],
        others: {validator: this.othersValidator, trigger: 'blur'}
      },
      price: 0.01,
      priceTemp: '0.01',
      priceReset: {
        price: 0.01,
        priceTemp: '0.01',
      },
      ticketConfig: {},
      resetTicketConfig: {},
      hasOthers: false,
      resetHasOthers: false,
    }
  },
  computed: {
    title () {
      return this.detailType == 'add' ? '添加票务' : this.detailType == 'edit' ? '编辑票务' : '票务'
    }
  },
  methods: {
    priceValidator (rules, value, callback) {
      try {
        let price = parseFloat(this.priceTemp)
        if (price == 0 || isNaN(price)) {
          price = this.price
        } else {
          price = price.toFixed(2)
        }
        this.priceTemp = price
        this.price = parseFloat(price)
      } catch (e) {
        this.priceTemp = this.price.toFixed(2)
      }
      callback()
    },
    othersValidator (rules, value, callback) {
      if (this.hasOthers) {
        this.$refs.optionForm.validator().then(() => {
          callback()
        }, () => {
          callback(new Error(' '))
        })
      } else {
        callback()
      }
    },
    open (activityId, ticket = {}) {
      console.log('ticket...',ticket)
      this.hasOthers = false
      this.detailType = ticket.id ? 'edit' : 'add'
      if(ticket.id && ticket.surplus != ticket.number){
        this.isBuy = true
      }
      if (ticket.ticketingType == '2') {
        this.price = ticket.rmb || 0.01
        this.priceTemp = this.price.toFixed(2)
        ticket.allowedRefund = ticket.allowedRefund ? 1 : 0
      } else {
        this.price = 0.01
        this.priceTemp = '0.01'
      }
      this.activityId = activityId
      this.formData = {
        ticketingType: '1',
        ticketingName: '免费票',
        number: 1,
        limitTicket: 1,
        // needAudit: true,
        needAudit: false,
        allowedRefund: 0,
        ...ticket
      }
      if (ticket.ticketingconfigList && ticket.ticketingconfigList.id) {
        this.hasOthers = true
        this.ticketConfig = ticket.ticketingconfigList
      } else {
        this.ticketConfig = {}
      }
      this.resetFormData = deepClone(this.formData)
      this.resetTicketConfig = deepClone(this.ticketConfig)
      this.resetHasOthers = this.hasOthers
      this.priceReset = {
        price: this.price,
        priceTemp: this.priceTemp
      }
      this.dialogVisible = true
    },
    typeChange (type) {
      if (type == '1') {
        this.formData.ticketingName = '免费票'
        this.priceTemp = '0.01'
        this.price = 0.01
      } else if (type == '2') {
        this.formData.needAudit = false
        this.formData.ticketingName = '付费票'
      }
    },
    save () {
      console.log('query...',this.formData)
      this.$refs.form.validate(valid => {
        let formData = {
          activityId: this.activityId,
          ...this.formData,
        }
        if (this.hasOthers) {
          formData.conferenceFormDTOList = [this.$refs.optionForm.formData]
        } else {
          formData.conferenceFormDTOList = []
        }
        let fun = formData.id ? updateTicket : addTicket
        if (formData.ticketingType == '2') {
          formData.payMethodList = [
            {
              type: 'OfflinePay',
              amount: this.price
            }
          ]
          formData.rmb = this.price
        } else {
          formData.payMethodList = []
          formData.rmb = 0
        }
        if (valid) {
          fun(formData).then(({data}) => {
            this.$message.success(formData.id ? '编辑成功' : '新增成功')
            this.$emit('finish')
          })
        }
      })
    },
    reset () {
      this.formData = deepClone(this.resetFormData)
      this.hasOthers = this.resetHasOthers
      this.$nextTick(() => {
        this.ticketConfig = deepClone(this.resetTicketConfig)
        this.price = this.priceReset.price
        this.priceTemp = this.priceReset.priceTemp
      })
    },
    dialogBeforeClose (next) {
      next()
    },
    close () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.form-detail-container {
  /deep/.el-input-number__increase {
    border-left: 1px solid #DCDFE6 !important;
    right: 1px !important;
  }
}

</style>
