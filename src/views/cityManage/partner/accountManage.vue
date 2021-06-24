<template>
  <div>
    <hc-crud ref="accountCrud" :option="option" :fetchListFun="fetchListFun" :auto-load="false">
      <template slot="menuLeft">
        账户余额：{{amount}}
        <el-button size="mini" style="margin-left: 20px;" @click="toRecharge">充值</el-button>
        <el-button size="mini" @click="toSettle">结算</el-button>

      </template>
      <template
        slot="menu"
        slot-scope="scope">
        <el-button
          v-if="scope.row.transactionType == '3' || scope.row.transactionType == '7'"
          type="text"
          size="mini"
          @click="toOrderView(scope.row)">查看订单详情</el-button>

        <el-button
          v-if="scope.row.transactionType == '9'"
          type="text"
          size="mini"
          @click="toVoucherView(scope.row)">查看结算凭证</el-button>

        <el-button
          v-if="scope.row.transactionType == '11'"
          type="text"
          size="mini"
          @click="toVoucherView(scope.row)">查看充值凭证</el-button>

      </template>
    </hc-crud>
    <el-dialog
      :title="handleType == 'recharge' ? '充值' : '结算'"
      :visible.sync="dialogVisible"
      append-to-body
      width="400px"
      center>
      <el-form ref="form" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="金额：" prop="amount">
          <hc-input style="width: 200px;" v-model="formData.amount" :decimal="2" maxlength="9" :max="999999.99" :min="0.01">
            <div slot="append">元</div>
          </hc-input>
        </el-form-item>
        <el-form-item label="凭证：" prop="voucher">
          <hc-image-upload single :limit="1" v-model="formData.voucher" :init-data="formData.voucher" @change="$refs.form.validateField('voucher')"></hc-image-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button :loading="formLoading" @click="dialogVisible = false">取 消</el-button>
        <el-button :loading="formLoading" type="primary" @click="saveVoucher">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="凭证详细"
      :visible.sync="viewDialogVisible"
      append-to-body
      width="500px">
      <el-form ref="form" :rules="rules" label-width="100px">
        <el-form-item label="订单号：">
          {{detail.orderNumber}}
        </el-form-item>
        <el-form-item label="结算时间：">
          {{detail.finishTime}}
        </el-form-item>
        <el-form-item label="操作人：">
          {{detail.reckonerName}}
        </el-form-item>
        <el-form-item label="金额：">
          {{detail.amount}}
        </el-form-item>
        <el-form-item label="凭证：">
          <hc-image-upload single :limit="1" :value="detail.settleVoucher" disabled></hc-image-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="viewDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="订单详情"
      :visible.sync="orderVisible"
      append-to-body
      width="70%">
      <order-detail :detail="orderDetail"></order-detail>
      <div slot="footer">
        <el-button @click="orderVisible = false">返 回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPartnerAccountPage, getPartnerAmount, accountRecharge, accountSettle } from '@/api/fms/account'
import HcImageUpload from "@/views/components/HcImageUpload/index"
import HcInput from "@/views/components/HcForm/HcInput/index"
import OrderDetail from '@/views/components/BusinessComponents/OrderDetail/index'
import { getStoreOrderDetail } from "@/api/mms/store";
export default {
  components: { HcInput, HcImageUpload, OrderDetail },
  data () {
    return {
      accountUserId: '',
      option: {
        labelWidth: 160,
        menuWidth: 120,
        menu: true,
        columns: [
          {
            label: '订单号',
            prop: 'orderNumber',
            search: true,
            maxlength: 50,
          },
          {
            label: '订单创建日期',
            prop: 'orderCreateTime',
            width: '160',
          },
          {
            label: '交易类型',
            prop: 'transactionType',
            type: 'select',
            width: '100',
            dicData: [
              {
                label: '抽成',
                value: 3
              },
              {
                label: '微信手续费',
                value: 7
              },
              {
                label: '充值',
                value: 11
              },
              {
                label: '结算',
                value: 9
              }
            ],
            search: true,
            formatter: function (row) {
              return row.transactionTypeStr
            }
          },
          {
            label: '交易金额',
            prop: 'amount',
            width: '120',
            formatter: function (row) {
              return row.type === 1 ? `-${row.amount}` : row.amount
            }
          },
          {
            label: '账户余额',
            prop: 'balance',
            width: '120',
          },
          {
            label: '订单支付时间',
            prop: 'finishTime',
            width: '160',
          },
        ]
      },
      amount: 0,
      handleType: '',
      dialogVisible: false,
      formData: {
        amount: 0,
        voucher: '',
      },
      rules: {
        amount: [{ required: true, message: '请填写金额', trigger: 'blur'}],
        voucher: [{ required: true, message: '请上传凭证', trigger: 'change'}],
      },
      formLoading: false,
      viewDialogVisible: false,
      detail: {},
      orderVisible: false,
      orderDetail: {}
    }
  },
  methods: {
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        getPartnerAccountPage({
          ...params,
          userId: this.accountUserId
        }).then(({data}) => {
          resolve({
            records: data.data.data.records,
            page: {
              total: data.data.data.total
            }
          })
        }, (error) => {
          reject(error)
        })
      })
    },
    open (userId) {
      this.accountUserId = userId
      this.getAmount()
      this.$refs.accountCrud.resetSearch()
      this.$refs.accountCrud.coverSearch()
    },
    getAmount () {
      getPartnerAmount({userId: this.accountUserId}).then(({data}) => {
        this.amount = data.data.data.amount
      })
    },
    toRecharge () {
      this.formData = {
        amount: 0,
        voucher: '',
      }
      this.formLoading = false
      this.handleType = 'recharge'
      this.dialogVisible = true
    },
    toSettle () {
      this.formData = {
        amount: 0,
        voucher: '',
      }
      this.formLoading = false
      this.handleType = 'settle'
      this.dialogVisible = true
    },
    saveVoucher () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let fun = this.handleType == 'recharge' ? accountRecharge : accountSettle
          this.formLoading = true
          fun({
            userId: this.accountUserId,
            amount: this.formData.amount,
            settleVoucher: this.formData.voucher
          }).then(({data}) => {

            this.$message.success('操作成功')
            this.dialogVisible = false
            this.$refs.accountCrud.refresh()
            this.getAmount()
          }).finally(() => {
            this.formLoading = false
          })
        }
      })
    },
    toVoucherView (row) {
      this.detail = row
      this.viewDialogVisible = true
    },
    toOrderView ({orderNumber}) {
      getStoreOrderDetail({ orderNum: orderNumber }).then(({ data }) => {
        this.orderDetail = data.data.data;
        this.orderVisible = true
      });
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
