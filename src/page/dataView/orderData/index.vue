<template>
  <div class="order-data-container">
    <div class="data-item total">
      <div style="padding: 0 20px;">
        <div class="order-total">
          <div class="order-total-item">
            <span>订单总数</span><span class="total-number data-view-number1">{{totalData.orderQuantity}}</span><span>单</span>
          </div>
          <div class="order-total-item">
            <span>订单总金额</span><span class="total-number data-view-number1">{{totalData.orderAmount}}</span><span>元</span>
          </div>
        </div>

      </div>
    </div>
    <div class="data-item charts">
      <div style="padding: 0 20px;">
        <title-button ref="titleButton" title="订单总量趋势图" :buttons="buttons" @change="paramsChange"></title-button>
        <charts ref="charts"></charts>
      </div>
    </div>
  </div>
</template>

<script>
import { orderStatisticsTotal, orderStatistics } from '@/api/dataView/index'
import charts from './charts'
import TitleButton from '../TitleButton'
export default {
  components: { TitleButton, charts },
  data () {
    return {
      params: {
        type: 1,
      },
      totalData: {
        orderQuantity: 0,
        orderAmount: 0
      },
      buttons: [
        {
          label: '日',
          value: {
            type: 1
          }
        },
        {
          label: '月',
          value: {
            type: 2
          }
        },
        {
          label: '年',
          value: {
            type: 3
          }
        }
      ]
    }
  },
  methods: {
    refreshData (all = false) {
      if (all) {
        orderStatisticsTotal(this.params.cityId).then(({data}) => {
          this.totalData = data.data.data
        })
      }
      orderStatistics(this.params).then(({data}) => {
        this.$refs.charts.setOption(data.data.data)
      })
    },
    paramsChange (data) {
      this.params = {
        ...this.params,
        ...data
      }
      this.refreshData()
    },
    resetCity (cityId) {
      this.params.cityId = cityId
      this.params.type = 1
      this.$refs.titleButton.reset()
      this.refreshData(true)
    },
  }
}
</script>

<style lang="scss" scoped>
.data-item {
  &.total {
    margin-top: 20px;

  }
  &.charts {
    margin-top: 24px;
  }
}

.order-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .order-total-item {
    color: #87C2F8;
    font-size: 16px;
    span {
      line-height: 22px;
      vertical-align: bottom;
    }
    .total-number {
      margin: 0 4px 0 10px;
      line-height: 32px;
      font-size: 28px;
      color: #D4EAFF;
    }
  }
}
</style>
