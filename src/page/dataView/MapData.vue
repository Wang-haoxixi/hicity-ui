<template>
  <v-chart ref="chart" width="822" height="500" @click="mapSelect"></v-chart>
</template>

<script>
import * as echarts from 'echarts';
import { mapGetters } from 'vuex'
import { getMapJson } from '@/api/dataView/index'


export default {
  created() {
    echarts.registerMap("china", {
      "type": "FeatureCollection",
      "features": []
    })
  },
  computed: {
    ...mapGetters(['cityTree'])
  },
  data() {
    return {
      option: {
      },
    };
  },
  methods: {
    setOption (currentCity, statisticsData) {
      let cityCode = currentCity.cityCode
      let mapData = []
      if (currentCity.children) {
        mapData = [...currentCity.children]
      } else {
        mapData = [{
          cityId: currentCity.cityId,
          cityCode: currentCity.cityCode,
          name: currentCity.name
        }]
      }
      for (let i = 0; i < mapData.length; i++) {
        mapData[i].data = {
          news: 0,
          shop: 0,
          activity: 0
        }
        let shopData = statisticsData.shop || []
        let newsData = statisticsData.news || []
        let activityData = statisticsData.activity || []

        for (let j = 0; j < shopData.length; j++) {
          if (mapData[i].cityId == shopData[j].cityId) {
            mapData[i].data.shop = shopData[j].count
          }
        }
        for (let j = 0; j < newsData.length; j++) {
          if (mapData[i].cityId == newsData[j].cityId) {
            mapData[i].data.news = newsData[j].count
          }
        }
        for (let j = 0; j < activityData.length; j++) {
          if (mapData[i].cityId == activityData[j].cityId) {
            mapData[i].data.activity = activityData[j].count
          }
        }
      }
      if (!echarts.getMap(cityCode)) {
        getMapJson((currentCity.children && currentCity.cityCode != 710000) ? currentCity.cityCode + "_full" : currentCity.cityCode).then(geoJson => {
          echarts.registerMap(cityCode, geoJson.data)
          this.refreshMap(cityCode, mapData)
        })
      } else {
        this.refreshMap(cityCode, mapData)
      }
    },
    refreshMap (cityCode, mapData) {
      let geo = [
        {
          top: 2,
          bottom: 45,
          show: true,
          map: cityCode,
          silent: true,
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: false,
            },
          },
          roam: false,
          itemStyle: {
            normal: {
              borderWidth: 0,
              shadowColor: "#000000",
              shadowOffsetY: 16,
              shadowBlur: 40,
            },
          },
          geoIndex: 14
        },
        {
          top: 2,
          bottom: 45,
          show: true,
          map: cityCode,
          silent: true,
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: false,
            },
          },
          roam: false,
          itemStyle: {
            normal: {
              borderWidth: 0,
              shadowColor: "#062c6a",
              shadowOffsetY: 15,
              shadowBlur: 0,
            },
          },
          geoIndex: 10
        }
      ]

      if (cityCode == '100000') {
        geo.unshift({
          top: 2,
          bottom: 45,
          show: true,
          map: "china",
          silent: true,
          zoom: .15,
          layoutCenter: ['85%', '75%'],
          layoutSize: 822,
          label: {
            normal: {
              show: true,
              color: '#FFFFFF',
            },
            emphasis: {
              show: false,
            },
          },
          itemStyle: {
            normal: {
              areaColor: "#3185da",
              borderWidth: 0,
              shadowColor: "#062c6a",
              shadowOffsetY: 1,
              shadowBlur: 0,
            },
          },
        })
      }

      this.$refs.chart.clear()
      setTimeout(() => {
        this.$refs.chart.setOption(
          {
            tooltip: {
              trigger: "item",
            },
            toolbox: {
              show: false,
            },
            geo,
            animation: false,
            series: [
              {
                top: 2,
                bottom: 45,
                type: "map",
                mapType: cityCode,
                geoIndex: 20,
                itemStyle: {
                  borderWidth: .3,
                  borderColor: '#062c6a',
                  areaColor: "#3185da",
                },
                select: {
                  itemStyle: {
                    borderWidth: .3,
                    borderColor: '#062c6a',
                    areaColor: "#3185da",
                  },
                  label: {
                    show: false,
                  }
                },
                emphasis: {
                  label: {
                    show: true,
                    color: '#FFFFFF',
                    textShadowColor: '#062c6a',
                    textShadowBlur: 5,
                  },
                  itemStyle: {
                    areaOffsetY: 10,
                    shadowColor: "#062c6a",
                    shadowOffsetY: 3,
                    shadowBlur: 2,
                    borderWidth: 0,
                    areaColor: {
                      type: "linear",
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [
                        {
                          offset: 0,
                          color: "#aaecff", // 100% 处的颜色
                        },
                        {
                          offset: 1,
                          color: "#4b86f4", // 0% 处的颜色
                        },
                      ],
                    },
                  },
                },
                tooltip: {
                  formatter: (param) => {
                    return `<div class="tool-tip">
                      <div class="tip-item">已发布<span class="number">${param.data.data.news}</span>条内容</div>
                      <div class="tip-item">已举办<span class="number">${param.data.data.activity}</span>场活动</div>
                      <div class="tip-item">已入驻<span class="number">${param.data.data.shop}</span>家店铺</div>
                    </div>`
                  },
                  padding: 0,
                  backgroundColor: 'rgba(0 , 0, 0, 0)'
                },
                data: mapData,
              },
            ],
          })
      }, 100)
    },
    mapSelect ({data}) {
      this.$emit('city-change', data.cityId)
    }
  }
};
</script>

<style lang="scss" scoped>
/**
 * 默认尺寸为 822px×400px，如果想让图表响应尺寸变化，可以像下面这样
 * 把尺寸设为百分比值（同时请记得为容器设置尺寸）。
 */
.echarts {
  width: 822px;
  height: 500px;
}
/deep/.tool-tip {
  box-sizing: border-box;
  height: 108px;
  width: 180px;
  background-image: url('/images/dataView/pic_tanchuan_bg.png');
  padding: 30px 21px;

  .tip-item {
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    color: #FFFFFF;
    &:not(:first-child) {
      margin-top: 3px;
    }
    .number {
      padding: 0 4px;
      font-size: 14px;
      color: #FFDA2D;
    }
  }
}
</style>
