<template>
  <div>
    <title-button ref="button" title="用户活跃趋势" :buttons="buttons" @change="paramsChange"></title-button>
    <div class="terminal-list">
      <div class="terminal-item" :class="{selected: chartParams.terminal == 1}" @click="paramsChange({terminal: 1})">安卓</div>
      <div class="terminal-item" :class="{selected: chartParams.terminal == 2}" @click="paramsChange({terminal: 2})">苹果</div>
      <div class="terminal-item" :class="{selected: chartParams.terminal == 3}" @click="paramsChange({terminal: 3})">小程序</div>
    </div>
    <charts ref="charts"></charts>
  </div>
</template>

<script>
import TitleButton from '../TitleButton'
import charts from './ActiveTrendCharts'
import { activeTrend } from '@/api/dataView/index'
export default {
  components: { TitleButton, charts },
  data () {
    return {
      chartParams: {
        type: 1,
        terminal: 1
      },
      buttons: [
        {
          label: '日活',
          value: {
            type: 1
          }
        },
        {
          label: '周活',
          value: {
            type: 2
          }
        },
        {
          label: '月活',
          value: {
            type: 3
          }
        }
      ]
    }
  },
  created () {
    this.refreshChartData()
  },
  methods: {
    paramsChange (data) {
      this.chartParams = {
        ...this.chartParams,
        ...data
      }
      this.refreshChartData()
    },
    refreshChartData () {
      activeTrend(this.chartParams).then(({data}) => {
        this.$refs.charts.setOption(data.data.data.reverse())
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.terminal-list {
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .terminal-item {
    margin-right: 8px;
    width: 43px;
    height: 19px;
    line-height: 19px;
    text-align: center;
    font-size: 12px;
    color: #2C68AC;
    background-image: url('/images/dataView/icon_bt_bg.png');
    cursor: pointer;
    &.selected {
      color: #87C2F8
    }
  }
}
</style>
