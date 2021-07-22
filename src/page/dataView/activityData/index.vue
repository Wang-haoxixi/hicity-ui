<template>
  <div class="activity-data-container">
    <div class="data-item count">
      <div class="count-item">
        <div class="count-item-title">累计报名人次</div>
        <div class="count-item-pipe">
          <pipe-line
            :height="14"
            :width="244"
            :percentage="enrollPer"
          ></pipe-line>
        </div>
        <div class="count-item-num data-view-number1">{{ topData.enrollNum }}</div>
      </div>
      <div class="count-item" style="margin-top: 5px">
        <div class="count-item-title">累计参会人次</div>
        <div class="count-item-pipe">
          <pipe-line
            :height="14"
            :width="244"
            :percentage="attendance"
            color="linear-gradient(270deg, #FFC028 0%, #FFC028 0%, rgba(255, 192, 40, 0.1) 100%)"
          ></pipe-line>
        </div>
        <div class="count-item-num data-view-number1">{{ topData.attendance }}</div>
      </div>
    </div>
    <div class="data-item charts">
      <div class="chart-left">
        <div class="chart-title">付费票免费票占比</div>
        <charts-left ref="chartsLeft"></charts-left>
      </div>
      <div class="chart-right">
        <div class="chart-title" style="padding-right: 100px;">活动类型占比</div>
        <charts-right ref="chartsRight"></charts-right>
      </div>
    </div>
    <div class="data-item rank">
      <div style="padding: 0 20px">
        <title-button
          ref="rankTitleButton"
          title="活动英雄榜"
          :buttons="buttons"
          @change="rankParamsChange"
        ></title-button>
      </div>
      <div class="rank-box">
        <div class="rank-line rank-header">
          <div class="rank-item rank-num">名次</div>
          <div class="rank-item activity-name">活动名称</div>
          <div class="rank-item heat">参会人数</div>
        </div>
        <div class="rank-body">
          <div
            v-for="(item, index) in rankList"
            :key="index"
            class="rank-line"
          >
            <div class="rank-item rank-num">{{ index + 1 }}</div>
            <div class="rank-item activity-name">{{ item.activityName }}</div>
            <div class="rank-item heat data-view-number">{{ item.count || '--' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  activityStatistics,
  activityRank,
} from "@/api/dataView/index";
import ChartsLeft from "./chartsLeft";
import ChartsRight from "./chartsRight";
import TitleButton from "../TitleButton";
import PipeLine from "./PipeLine";
export default {
  components: { TitleButton, ChartsLeft, ChartsRight, PipeLine },
  data() {
    return {
      params: {
        type: "month",
      },
      topData: {
        enrollNum: 0,
        attendance: 0,
      },
      rankList: [],
      buttons: [
        {
          label: "月度",
          value: {
            type: "month",
          },
        },
        {
          label: "季度",
          value: {
            type: "quarter",
          },
        },
        {
          label: "年度",
          value: {
            type: "years",
          },
        },
      ],
    };
  },
  computed: {
    enrollPer() {
      if (!this.topData.enrollNum) {
        return 0;
      } else if (this.topData.enrollNum < 1000) {
        return 100 / 3;
      } else if (this.topData.enrollNum < 100000) {
        return 200 / 3;
      } else {
        return 100;
      }
    },
    attendance() {
      if (!this.topData.enrollNum) {
        return 0;
      } else if (this.topData.enrollNum < 1000) {
        return (100 / 3) * (this.topData.attendance / this.topData.enrollNum);
      } else if (this.topData.enrollNum < 100000) {
        return (200 / 3) * (this.topData.attendance / this.topData.enrollNum);
      } else {
        return 100 * (this.topData.attendance / this.topData.enrollNum);
      }
    },
  },
  methods: {
    refreshData() {
      activityStatistics(this.params).then(({ data }) => {
        this.topData = {
          enrollNum: data.data.data.enrollNum,
          attendance: data.data.data.attendance,
        };
        this.$refs.chartsLeft.setOption({payCount: data.data.data.payCount, freeCount: data.data.data.freeCount});
        this.$refs.chartsRight.setOption(
          {
            meetingCount: data.data.data.meetingCount,
            exhibitionCount: data.data.data.exhibitionCount,
            sharonCount: data.data.data.sharonCount,
            trainCount: data.data.data.trainCount,
            otherCount: data.data.data.otherCount
          }
        );
      });
      this.refreshRankData();
    },
    refreshRankData() {
      activityRank(this.params).then(({data}) => {
        let rankList = data.data.data || []
        let rankLength = rankList.length
        if (rankLength < 5) {
          for (let i = 0; i < 5 - rankLength; i++) {
            rankList.push({
              activityName: '最受欢迎活动名次评比中'
            })
          }
        }
        this.rankList = rankList
      })
    },
    rankParamsChange(data) {
      this.params = {
        ...this.params,
        ...data,
      };
      this.refreshRankData();
    },
    resetCity(cityId) {
      this.params.type = "month"
      this.params.cityId = cityId;
      this.refreshData();
      this.$refs.rankTitleButton.reset()
    },
  },
};
</script>

<style lang="scss" scoped>
.data-item {
  &.count {
    margin-top: 12px;
    padding: 0 20px;
  }
  &.charts {
    margin-top: 21px;
    height: 175px;
    padding: 0 20px;
  }
  &.rank {
  }
}

.charts {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .chart-left {
    flex: 190px 0 0;
    height: 175px;
  }
  .chart-right {
    flex: 300px 0 0;
    height: 175px;
  }
  .chart-title {
    height: 22px;
    line-height: 22px;
    font-size: 16px;
    color: #87C2F8;
    text-align: center;
  }
}

.count-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  .count-item-title {
    flex: 100px 0 0;
    height: 22px;
    line-height: 22px;
    color: #87c2f8;
    font-size: 16px;
  }
  .count-item-pipe {
    margin-left: 20px;
    height: 14px;
    flex: 244px 0 0;
  }
  .count-item-num {
    margin-left: 5px;
    flex: 100px 1 1;
    height: 32px;
    line-height: 32px;
    font-size: 28px;
    color: #ffffff;
    text-align: right;
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
      flex: 30px 0 0;
      text-align: center;
    }
    .activity-name {
      flex: 235px 1 1;
      padding: 0 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .heat {
      flex: 100px 0 0;
      text-align: right;
    }
  }
  .rank-header {
    color: #87c2f8;
    font-size: 14px;
    background: linear-gradient(
      107deg,
      rgba(4, 25, 83, 0.3) 0%,
      rgba(8, 33, 96, 0.45) 11%,
      #0b296c 49%,
      rgba(8, 33, 96, 0.41) 91%,
      rgba(4, 26, 84, 0.3) 99%,
      rgba(4, 25, 83, 0.3) 100%
    );
  }
  .rank-body {
    margin-top: 8px;
    .activity-name {
      color: #2c68ac;
    }
    .rank-num,
    .heat {
      color: #87c2f8;
    }
  }
}
</style>
