<template>
  <v-chart ref="chart" :option="option" width="280" height="200"></v-chart>
</template>

<script>
const colors = ["#28C1FB", "#868BFC", "#FF98A0", "#FFC028"];
export default {
  data() {
    return {
      option: {},
    };
  },
  methods: {
    setOption(dataList) {
      dataList.sort((a, b) => {
        if (a.circleTypeLabel == '其他' || a.circleTypeLabel == '') {
          return 1
        } else if (b.circleTypeLabel == '其他' || b.circleTypeLabel == '') {
          return -1
        } else {
          return b.count - a.count
        }
      });

      let chartData = [];

      for (let i = 0; i < dataList.length && i < 3; i++) {
        chartData.push({
          value: dataList[i].count,
          name: dataList[i].circleTypeLabel,
          itemStyle: {
            color: colors[i],
          },
        });
      }
      if (dataList.length > 4) {
        let others = {
          value: 0,
          name: "其他",
          itemStyle: {
            color: colors[3],
          },
        };
        for (let i = 3; i < dataList.length; i++) {
          others.value += dataList[i].count;
        }
        chartData.push(others);
      } else if (dataList.length == 4) {
        chartData.push({
          value: dataList[3].count,
          name: dataList[3].circleTypeLabel,
          itemStyle: {
            color: colors[3],
          },
        });
      }
      let data = [];
      let times = [];
      for (let i = 0; i < dataList.length; i++) {
        data.push(dataList[i].count);
        times.push(dataList[i].name);
      }

      this.option = {};
      this.$nextTick(() => {
        this.option = {
          tooltip: {
            trigger: "item",
          },
          legend: {
            type: 'plain',
            icon: 'rect',
            show: true,
            itemGap: 5,
            itemWidth: 10,
            itemHeight: 10,
            borderRadius: 0,
            borderWidth: 0,
            selectedMode: false,
            left: 'center',
            textStyle: {
              padding: [3, 0, 0, 0],
              rich: {
                a: {
                  color: "#3E92E0",
                  fontSize: 12,
                },
              },
            },
            bottom: 20,
            formatter(name) {
              return `{a|${name}}`;
            },
          },
          grid:{
            containLabel:true,
            bottom: 30
          },
          series: [
            {
              type: "pie",
              left: 0,
              stillShowZeroSum: false,
              radius: ["33", "67"],
              itemStyle: {
                borderColor: "#101B3C",
                borderWidth: 2,
              },
              minAngle:10,
              label: {
                color: "#87C2F8",
                position: 'outer',
                alignTo: 'labelLine',
                bleedMargin: 5,
                formatter: '{d}%'
              },
              // labelLayout: (params) => {
              //   return {
              //     x: params.rect.x,
              //     y: params.rect.y + params.rect.height / 2,
              //     verticalAlign: "middle",
              //     align: "left",
              //   };
              // },
              labelLine: {
                length2: 4,
                lineStyle: {
                  color: "#87C2F8",
                },
              },
              emphasis: {
                scaleSize: 6,
              },
              bottom: 50,
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
  width: 280px;
  height: 200px;
  color: #3ddcea;
  color: #115cc0;
}
</style>
