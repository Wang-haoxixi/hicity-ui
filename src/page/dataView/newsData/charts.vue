<template>
  <v-chart ref="chart" :option="option" width="450" height="164"></v-chart>
</template>

<script>
export default {
  data () {
    return {
      option: {
      },
    }
  },
  methods: {
    setOption (dataList) {
      let source = []
      for (let i = 0; i < dataList.length; i++) {
        let item = [dataList[i].time, 0, 0, 0, 0]
        let dataTypeList = dataList[i].dataTypeList
        for (let j = 0; j < dataTypeList.length; j++) {
          item.splice(dataTypeList[j].type, 1, dataTypeList[j].count)
        }
        source.push(item)
      }
      this.option = {}
      this.$nextTick(() => {
        this.option = {
          legend: {
            type: 'plain',
            show: true,
            icon: 'rect',
            data: [
              '城市游记', '城市热议', '城市头条', '新闻资讯'
            ],
            itemGap: 40,
            itemWidth: 10,
            itemHeight: 10,
            borderRadius: 0,
            borderWidth: 0,
            textStyle: {
              padding: [3, 0, 0, 0],
              rich: {
                a: {
                  color: "#3E92E0",
                  fontSize: 12,
                },
              },
            },
            left: 'center',
            bottom: 0,
            formatter(name) {
              return `{a|${name}}`;
            },
          },
          tooltip: {},
          bottom: 0,
          dataset: {
            source
          },
          dataZoom: [
            {
              type: 'inside',
              show: true,
              realtime: true,
              zoomLock: true,
              startValue: source.length - 5,
              endValue: source.length - 1
            },
          ],
          grid:{
              left: 0,
              top :20,
              right: 0,
              bottom: 30,
              containLabel:true
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              color: '#3E92E0',
              fontSize: 12,
            },
            axisTick: {show: false},
            axisLine: {
              lineStyle: {
                color: '#3862D3'
              }
            },
          },
          yAxis: {
            axisLine: {show:false},
            axisTick: {show:false},
            splitLine: {show:false},
            axisLabel: {
              color: '#3E92E0',
              fontSize: 12,
            },
            scale: true,
            minInterval: 1
          },
          series: [
            {type: 'bar', barWidth: '15', color: '#FF98A0', name: '城市游记'},
            {type: 'bar', barWidth: '15', color: '#FFC028', name: '城市热议'},
            {type: 'bar', barWidth: '15', color: '#28C1FB', name: '城市头条'},
            {type: 'bar', barWidth: '15', color: '#868BFC', name: '新闻资讯', barCategoryGap: 40, barGap: '7%'},
          ]
        }
      })


    }
  }
}
</script>

<style lang="scss" scoped>
.echarts {
  width: 450px;
  height: 164px;
}
</style>
