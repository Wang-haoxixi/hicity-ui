<template>
  <v-chart ref="chart" :option="option" width="314" height="153"></v-chart>
</template>

<script>
export default {
  data() {
    return {
      option: {},
    };
  },
  methods: {
    setOption({
      meetingCount = 0,
      exhibitionCount = 0,
      sharonCount = 0,
      trainCount = 0,
      otherCount = 0,
    }) {
      let totalCount = meetingCount + exhibitionCount + sharonCount + trainCount + otherCount;
      let chartData = [
        {
          value: meetingCount,
          name: "会议",
          itemStyle: {
            color: "#28C1FB",
          },
        },
        {
          value: exhibitionCount,
          name: "展会",
          itemStyle: {
            color: "#868BFC",
          },
        },
        {
          value: sharonCount,
          name: "沙龙",
          itemStyle: {
            color: "#FF98A0",
          },
        },
        {
          value: trainCount,
          name: "培训",
          itemStyle: {
            color: "#FFC028",
          },
        },
        {
          value: otherCount,
          name: "其他",
          itemStyle: {
            color: "#15CBA1",
          },
        },
      ];

      let percentage = {
        会议: totalCount == 0 ? 0 : Math.round((meetingCount / totalCount) * 100),
        展会: totalCount == 0 ? 0 : Math.round((exhibitionCount / totalCount) * 100),
        沙龙: totalCount == 0 ? 0 : Math.round((sharonCount / totalCount) * 100),
        培训: totalCount == 0 ? 0 : Math.round((trainCount / totalCount) * 100),
        其他: totalCount == 0 ? 0 : Math.round((otherCount / totalCount) * 100),
      };

      this.option = {};
      this.$nextTick(() => {
        this.option = {
          tooltip: {
            trigger: "item",
          },
          grid: {
            containLabel: true,
            bottom: 30,
          },
          legend: {
            orient: "vertical",
            padding: 0,
            type: "plain",
            icon: "rect",
            temGap: 5,
            itemWidth: 9,
            itemHeight: 9,
            borderRadius: 0,
            borderWidth: 0,
            selectedMode: false,
            textStyle: {
              padding: [3, 0, 0, 0],
              rich: {
                a: {
                  color: "#3E92E0",
                  fontSize: 12,
                },
              },
            },
            itemStyle: {
              borderWidth: 0,
            },
            left: 190,
            right: 0,
            top: 'center',
            bottom: 0,
            formatter(name) {
              return `{a|${name}占比：${percentage[name]}%}`;
            },
          },
          series: [
            {
              type: "pie",
              left: 0,
              radius: ["33", "67"],
              itemStyle: {
                borderColor: "#101B3C",
                borderWidth: 2,
              },
              minAngle: 10,
              label: {
                show: false,
              },
              labelLine: {
                length2: 4,
                lineStyle: {
                  color: "#87C2F8",
                },
              },
              emphasis: {
                scaleSize: 6,
              },
              right: 100,
              data: chartData,
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
  width: 314px;
  height: 153px;
}
</style>
