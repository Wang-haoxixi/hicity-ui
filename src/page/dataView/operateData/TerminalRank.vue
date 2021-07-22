<template>
  <div>
    <div>
      <title-button ref="button" style="padding-right: 15px" title="注册渠道排行统计" :buttons="buttons" @change="paramsChange"></title-button>
    </div>
    <div class="rank-box">
      <div class="rank-line rank-header">
        <div class="rank-item rank-num">名次</div>
        <div class="rank-item terminal">渠道</div>
        <div class="rank-item number">注册量</div>
      </div>
      <div class="rank-body">
        <div v-for="(item, index) in rankList" :key="index" class="rank-line">
          <div class="rank-item rank-num">{{index + 1}}</div>
          <div class="rank-item terminal">{{item.name}}</div>
          <div class="rank-item number">{{item.count}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleButton from '../TitleButton'
import { terminalRanking } from '@/api/dataView/index'
export default {
  components: { TitleButton },
  data () {
    return {
      params: {
        type: 1
      },
      buttons: [
        {
          label: '日',
          value: {
            type: 1
          }
        },
        {
          label: '周',
          value: {
            type: 2
          }
        },
        {
          label: '月',
          value: {
            type: 3
          }
        }
      ],
      rankList: []
    }
  },
  created () {
    this.refreshData()
  },
  methods: {
    paramsChange (data) {
      this.params = {
        ...this.params,
        ...data
      }
      this.refreshData()
    },
    refreshData () {
      terminalRanking(this.params).then(({data}) => {
        this.rankList = data.data.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.rank-box {
  padding-right: 8px;
  margin-top: 11px;
  color: #87C2F8;
  .rank-line {
    padding: 0 12px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: center;
    .rank-num {
      flex: 28px 0 0 ;
      text-align: center;
    }
    .terminal {
      flex: 100px 1 1;
      padding: 0 15px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .number {
      flex: 60px 0 0;
      text-align: right;
    }
  }
  .rank-body {
    margin-top: 6px;
    .rank-line {
      height: 20px;
      line-height: 20px;
      padding-top: 6px;
    }
  }
  .rank-header {
    font-size: 14px;
    background: linear-gradient(107deg, rgba(4, 25, 83, 0.3) 0%, rgba(8, 33, 96, 0.45) 11%, #0B296C 49%, rgba(8, 33, 96, 0.41) 91%, rgba(4, 26, 84, 0.3) 99%, rgba(4, 25, 83, 0.3) 100%);
  }
}
</style>
