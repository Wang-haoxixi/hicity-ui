<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="70%"
    :before-close="dialogBeforeClose">
    <el-tabs v-model="type">
      <el-tab-pane label="订单信息" name="order">
        <template>
          <div class="coupons-info">
            <el-image class="coupons-img" :src="orderDetail.logo"></el-image>
            <div class="coupons-name">{{orderDetail.name}}</div>
          </div>
          <div class="order-info">
            <p>用户名：{{orderDetail.userName}}</p>
            <p>联系电话：{{orderDetail.phone}}</p>
            <p>领取时间：{{orderDetail.createTime}}</p>
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane label="核销信息" name="writeOff" :disabled="!writeOff">
        <div class="off-info">
          <p>核销券名：{{writeoffDetail.name}}</p>
          <p>核销商户：{{writeoffDetail.merchantName}}</p>
          <p>核销人员：{{writeoffDetail.writeOffUserName}}</p>
          <p>核销人员手机号：{{writeoffDetail.writeOffUserPhone}}</p>
          <p>核销时间：{{writeoffDetail.writeOffTime}}</p>
          <p>核销券码：{{writeoffDetail.merchantNum}}</p>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import { getOrderDetail, getWriteoffDetail } from "@/api/merchantSystem/coupons"
export default {
  data () {
    return {
      type: 'order',
      dialogVisible: false,
      orderDetail: {},
      writeoffDetail: {},
      writeOff: true
    }
  },
  methods: {
    open (type = 'order', id, writeOff = true) {
      this.type = type
      this.writeOff = writeOff
      this.dialogVisible = true
      if (writeOff) {
        getWriteoffDetail({id}).then(({ data }) => {
          this.writeoffDetail = data.data.data
        })
      }
      getOrderDetail({id}).then(({data}) => {
        this.orderDetail = data.data.data
      })
    },
    dialogBeforeClose (next) {
      next()
    }
  }
}
</script>

<style lang="scss" scoped>
.coupons-info {
  display: flex;
  .coupons-img {
    height: 100px;
    width: 150px;
    flex: 150px 0 0;
  }
  .coupons-name {
    margin-left: 40px;
    line-height: 20px;
  }
}
.order-info, .off-info {
  margin-top: 20px;
  p {
    margin-top: 5px;
    height: 20px;
    line-height: 20px;
  }
}
</style>
