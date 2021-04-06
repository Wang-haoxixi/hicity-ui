<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="70%"
    :before-close="dialogBeforeClose">
    <el-tabs v-model="type">
      <el-tab-pane label="订单信息" name="order">
        <template>
          <div class="coupons-info">
            <el-image class="coupons-img"></el-image>
            <div class="coupons-name">三只鱼儿满100减15元券</div>
          </div>
          <div class="order-info">
            <p>用户名：齐小</p>
            <p>联系电话：13666666666</p>
            <p>领取时间：2020-01-01</p>
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane label="核销信息" name="writeOff">
        <div class="off-info">
          <p>核销券名：爱消费新人5元代金券爱消费官方</p>
          <p>核销商户：衡阳市高新技术产业开发区惠怡美烟酒公安店</p>
          <p>核销人员：暂无</p>
          <p>核销人员手机号：13666666666</p>
          <p>核销时间：2020-01-01</p>
          <p>核销券码：202103011731413PiZor6a</p>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      type: 'order',
      dialogVisible: false,
    }
  },
  methods: {
    open (type = 'order', id) {
      this.type = type
      this.dialogVisible = true
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
