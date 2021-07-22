<template>
  <div class="circle-data-container">
    <div class="circle-total">
      <div class="circle-total-item">
        <div class="total-item-title">圈子总数量</div>
        <div class="total-item-content data-view-number1">{{totalData.circleCount}}</div>
      </div>
      <div class="circle-total-item" style="margin-top: 10px;">
        <div class="total-item-title">圈子成员数量</div>
        <div class="total-item-content data-view-number1">{{totalData.circleUserCount}}</div>
      </div>
    </div>
    <div class="circle-charts">
      <charts ref="charts"></charts>
    </div>
  </div>
</template>

<script>
import { circleStatistics } from '@/api/dataView/index'
import charts from './charts'
export default {
  components: { charts },
  data () {
    return {
      totalData: {
        circleCount: 0,
        circleUserCount: 0
      }
    }
  },
  methods: {
    resetCity (cityId) {
      circleStatistics({cityId}).then(({data}) => {
        let circleData = data.data.data
        this.totalData = {
          circleCount: circleData.circleCount,
          circleUserCount: circleData.circleUserCount
        }
        this.$refs.charts.setOption(data.data.data.circleType)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.circle-data-container {
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .circle-total {
    padding: 18px;
    .circle-total-item {
      height: 70px;
      width: 150px;
      background-image: url('/images/dataView/pic_shuju_bgsmall.png');
      .total-item-title {
        padding-top: 10px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        font-size: 16px;
        color: #87C2F8;
      }
      .total-item-content {
        margin-top: 1px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        font-size: 28px;
        color: #D4EAFF;
      }
    }
  }
  .circle-charts {

  }
}
</style>
