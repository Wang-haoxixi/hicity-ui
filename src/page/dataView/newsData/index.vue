<template>
  <div class="news-data-container">
    <div class="data-item charts">
      <div style="padding: 0 20px;">
        <title-button ref="chartTitleButton" title="城市内容数据统计" :buttons="buttonsChart" @change="chartParamsChange"></title-button>
        <div class="news-type-select">
          <div class="news-type-item" :class="{selected: chartParams.statisticsType == 1}" @click="chartParamsChange({statisticsType: 1})">发布数</div>
          <div class="news-type-item" :class="{selected: chartParams.statisticsType == 2}" @click="chartParamsChange({statisticsType: 2})">浏览数</div>
          <div class="news-type-item" :class="{selected: chartParams.statisticsType == 3}" @click="chartParamsChange({statisticsType: 3})">评论数</div>
          <div class="news-type-item" :class="{selected: chartParams.statisticsType == 4}" @click="chartParamsChange({statisticsType: 4})">点赞数</div>
          <div class="news-type-item" :class="{selected: chartParams.statisticsType == 5}" @click="chartParamsChange({statisticsType: 5})">分享数</div>
        </div>
        <charts ref="charts"></charts>
      </div>
    </div>
    <div class="data-item rank">
      <div style="padding: 0 20px;">
        <title-button ref="popularTitleButton" title="最受欢迎榜" :buttons="buttonsPopular" @change="popularParamsChange"></title-button>
      </div>
      <div class="rank-box">
        <div class="rank-line rank-header">
          <div class="rank-item rank-num">名次</div>
          <div class="rank-item news-name">内容名称</div>
          <div class="rank-item news-type">类别</div>
          <div class="rank-item heat">热度</div>
        </div>
        <div class="rank-body">
          <div v-for="(item, index) in popularList" :key="index" class="rank-line">
            <div class="rank-item rank-num">{{index + 1}}</div>
            <div class="rank-item news-name">{{item.dataName}}</div>
            <div class="rank-item news-type">{{item.typeName}}</div>
            <div class="rank-item heat">{{item.count}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { newsStatistics, newsPopularStatistics } from '@/api/dataView/index'
import charts from './charts'
import TitleButton from '../TitleButton'
export default {
  components: { TitleButton, charts },
  data () {
    return {
      chartParams: {
        statisticsType: 1,
        dateDimension: 1,
      },
      popularParams: {
        dateDimension: 1,
        size: 5
      },
      popularList: [],
      buttonsChart: [
        {
          label: '日',
          value: {
            dateDimension: 1
          }
        },
        {
          label: '月',
          value: {
            dateDimension: 2
          }
        },
        {
          label: '年',
          value: {
            dateDimension: 3
          }
        }
      ],
      buttonsPopular: [
        {
          label: '月度',
          value: {
            dateDimension: 1
          }
        },
        {
          label: '季度',
          value: {
            dateDimension: 2
          }
        },
        {
          label: '年度',
          value: {
            dateDimension: 3
          }
        }
      ]
    }
  },
  methods: {
    refreshChartData () {
      newsStatistics(this.chartParams).then(({data}) => {
        this.$refs.charts.setOption(data.data.data)
      })
    },
    refreshPopularData () {
      newsPopularStatistics(this.popularParams).then(({data}) => {
        this.popularList = data.data.data
      })
    },
    chartParamsChange (data) {
      this.chartParams = {
        ...this.chartParams,
        ...data
      }
      this.refreshChartData()
    },
    popularParamsChange (data) {
      this.pupularParams = {
        ...this.pupularParams,
        ...data
      }
      this.refreshPopularData()
    },
    resetCity (cityId) {
      this.chartParams.dateDimension = 1
      this.chartParams.statisticsType = 1
      this.chartParams.cityId = cityId
      this.$refs.chartTitleButton.reset()
      this.refreshChartData()
      this.popularParams.dateDimension = 1
      this.popularParams.cityId = cityId
      this.$refs.popularTitleButton.reset()
      this.refreshPopularData()
    },
  }
}
</script>

<style lang="scss" scoped>
.data-item {
  &.charts {
    margin-top: 11px;
    height: 214px;
  }
  &.rank {
    margin-top: 10px;

  }
}
.news-type-select {
  margin-top: 2px;
  height: 19px;
  width: 235px;
  line-height: 19px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-image: url('/images/dataView/icon_news_type_bg.png');
  .news-type-item {
    height: 17px;
    line-height: 17px;
    color: #2C68AC;
    font-size: 12px;
    cursor: pointer;
    &.selected {
      color: #87C2F8;
    }
  }
}
.rank-box {
  padding: 0 6px;
  margin-top: 11px;
  .rank-line {
    padding: 0 20px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: center;
    .rank-num {
      flex: 30px 0 0 ;
      text-align: center;
    }
    .news-name {
      flex: 235px 1 1;
      padding: 0 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .news-type {
      flex: 80px 0 0;
    }
    .heat {
      flex: 50px 0 0;
      text-align: right;
    }
  }
  .rank-header {
    color: #87C2F8;
    font-size: 14px;
    background: linear-gradient(107deg, rgba(4, 25, 83, 0.3) 0%, rgba(8, 33, 96, 0.45) 11%, #0B296C 49%, rgba(8, 33, 96, 0.41) 91%, rgba(4, 26, 84, 0.3) 99%, rgba(4, 25, 83, 0.3) 100%);
  }
  .rank-body {
    margin-top: 8px;
    .news-name,.news-type {
      color: #2C68AC;
    }
    .rank-num,.heat {
      color: #87C2F8;
    }
  }
}
</style>
