<template>
  <v-chart ref="chart" :option="option" width="190" height="153"></v-chart>
</template>

<script>
export default {
  data() {
    return {
      option: {},
    };
  },
  methods: {
    setOption({ freeCount = 0, payCount = 0 }) {
      let payAngle = freeCount + payCount == 0 ? 180 : (payCount / (freeCount + payCount)) * 360;
      let startAngle = payAngle / 2;

      let chartDataFree = [
        {
          value: payCount,
          name: "收费票",
          itemStyle: {
            color: "rgba(0, 0, 0, 0)",
          },
        },
        {
          value: freeCount,
          name: "免费票",
          itemStyle: {
            color: "#15CBA1",
          },
          label: {
            position: "center",
          },
        },
      ];

      let chartDataPay = [
        {
          value: payCount,
          name: "收费票",
          itemStyle: {
            color: "#FFC028",
          },
          label: {
            show: true,
            formatter: "收",
            color: "#061A56",
            backgroundColor: "#FFC028"
          },
        },
        {
          value: freeCount,
          name: "免费票",
          itemStyle: {
            color: "#15CBA1",
          },
          label: {
            show: true,
            formatter: "免",
            color: "#061A56",
            backgroundColor: "#15CBA1"
          },
        },
      ];
      this.option = {};
      this.$nextTick(() => {
        this.option = {
          silent: true,
          avoidLabelOverlap: false,
          series: [
            {
              animation: false,
              type: "pie",
              radius: [0, "65"],
              itemStyle: {
                color: "rgba(0, 0, 0, 0)",
                borderWidth: 1,
                borderColor: "#FFFFFF",
                borderType: "dotted",
                borderType: [1, 3],
                borderDashOffset: 3,
              },
              label: {
                show: false,
              },
              data: [1],
            },
            {
              type: "pie",
              startAngle,
              left: 0,
              radius: ["37", "55"],
              itemStyle: {
                borderWidth: 0,
              },
              label: {
                show: true,
                formatter(params) {
                  return [
                    "{a|免费占比}",
                    `{b|${Math.round(params.percent)}%}`,
                  ].join("\n");
                },
                rich: {
                  a: {
                    color: "#3BB0E7",
                    fontSize: 12,
                    lineHeight: 17,
                  },
                  b: {
                    color: "#3BB0E7",
                    fontSize: 30,
                    lineHeight: 35,
                  },
                },
              },
              labelLine: {
                show: false,
              },
              data: chartDataFree,
            },
            {
              type: "pie",
              startAngle,
              radius: ["37", "50"],
              label: {
                show: true,
                borderRadius: 15,
                fontWeight: 'bold',
                fontSize: 14,
                padding: 5
              },
              labelLine: {
                show: false,
                length: 0,
                length2: 0,
              },
              itemStyle: {
                borderWidth: 0,
              },
              data: chartDataPay,
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
  width: 190px;
  height: 153px;
}
</style>
