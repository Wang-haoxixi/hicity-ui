<template>
  <v-chart ref="chart" :option="option" width="335" height="200"></v-chart>
</template>

<script>
import * as echarts from 'echarts'
export default {
  data() {
    return {
      option: {
      },
    };
  },
  methods: {
    setOption(dataList) {
      let data = []
      let times = []
      for (let i = 0; i < dataList.length; i++) {
        data.push(dataList[i].count)
        times.push(dataList[i].time)
      }

      this.option = {};
      this.$nextTick(() => {
        this.option = {
          tooltip: {
            trigger: 'axis'
          },
          bottom: 0,
          dataZoom: [
            {
              type: "inside",
              show: true,
              realtime: true,
              zoomLock: true,
              startValue: times.length - 7,
              endValue: times.length - 1,
            },
          ],
          grid: {
            left: 0,
            top: 20,
            right: 0,
            bottom: 0,
            containLabel: true,
          },
          xAxis: {
            type: "category",
            axisLabel: {
              color: "#3E92E0",
              fontSize: 12,
            },
        boundaryGap: false,
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                color: "#3862D3",
              },
            },
            data: times
          },
          yAxis: {
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: {
              color: "#3E92E0",
              fontSize: 12,
            },
            scale: true,
            minInterval: 1,
          },
          series: [
            {
              type: "line",
              name: "活跃数",
              smooth: true,
              lineStyle: {
                width: 2,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#3ddcea",
                  },
                  {
                    offset: 1,
                    color: "#115cc0",
                  },
                ])
              },
              areaStyle: {
                opacity: 1,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 1,
                    color: "#0A3E9C",
                  },
                  {
                    offset: 0.01,
                    color: "rgba(14, 37, 99, 0.01)",
                  },
                  {
                    offset: 0,
                    color: "rgba(14, 37, 99, 0)",
                  },
                ]),
              },
              data
            },
          ],
        };
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.echarts {
  width: 335px;
  height: 200px;
  color: #3ddcea;
  color: #115cc0;
}
</style>
