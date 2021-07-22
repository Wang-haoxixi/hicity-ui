<template>
  <div class="operate-container">
    <div class="overview-data">
      <div class="overview-item">
        <div class="overview-item-title">全国注册用户数</div>
        <div class="overview-item-content data-view-number1">{{overviewData.userTotalRegister}}</div>
      </div>
      <div class="overview-item">
        <div class="overview-item-title">月活跃用户数</div>
        <div class="overview-item-content data-view-number1">{{overviewData.monthActivity}}</div>
      </div>
      <div class="overview-item">
        <div class="overview-item-title">月新增用户数</div>
        <div class="overview-item-content data-view-number1">{{overviewData.thisMonthUserRegister}}</div>
      </div>
    </div>

    <div class="active-trend-data">
      <active-trend></active-trend>
    </div>
    <div class="terminal-ranking-data">
      <terminal-rank></terminal-rank>
    </div>
  </div>
</template>

<script>
import { overviewData } from '@/api/dataView/index'
import ActiveTrend from './ActiveTrend'
import TerminalRank from './TerminalRank'
export default {
  components: { ActiveTrend, TerminalRank },
  data () {
    return {
      overviewData: {
        userTotalRegister: 0,
        monthActivity: 0,
        thisMonthUserRegister: 0
      }
    }
  },
  created () {
    overviewData().then(({data}) => {
      this.overviewData = data.data.data
    })
  }
}
</script>

<style lang="scss" scoped>
.operate-container {
  display: flex;
  padding-left: 20px;
  align-items: flex-start;
  .overview-data {
    flex: 150px 0 0;
    padding-top: 16px;
    .overview-item {
      margin-bottom: 10px;
      height: 70px;
      width: 150px;
      background-image: url('/images/dataView/pic_shuju_bgsmall.png');
      .overview-item-title {
        padding-top: 10px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        font-size: 16px;
        color: #87C2F8;
      }
      .overview-item-content {
        margin-top: 1px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        font-size: 28px;
        color: #D4EAFF;
      }
    }
  }
  .active-trend-data {
    margin-left: 15px;
    padding-top: 12px;
    flex: 335px 0 0;
  }
  .terminal-ranking-data {
    margin-left: 20px;
    padding-top: 12px;
    flex: 100px 1 1;
  }
}
</style>
