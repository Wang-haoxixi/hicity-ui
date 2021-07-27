<template>
  <div class="wel-container-view">
    <div class="wel-container">
      <div class="wel-container-header">
        <div class="header-date">
          {{dateFormat(time, 'yyyy年MM月dd日 星期W')}}
        </div>
        <div class="header-title"></div>
        <div class="header-right">
          <div class="header-time">{{dateFormat(time, 'hh:mm:ss')}}</div>
          <div v-show="!fullScreen" class="icon-fullscreen" @click="handleFullScreen"></div>
        </div>
      </div>
      <div class="wel-container-body">
        <div class="body-left">
          <div class="activity-box">
            <div class="module-title">活动行</div>
            <activity-data ref="activityView"></activity-data>
          </div>
          <div class="order-box">
            <div class="module-title">订单统计</div>
            <order-data ref="orderView"></order-data>
          </div>
        </div>
        <div class="body-center">
          <div class="top-data-box">
            <div class="top-data-item">
              <div class="item-title">累计举办活动场次</div>
              <div class="item-content data-view-number">{{ topData.activityCount }}</div>
            </div>
            <div class="top-data-item">
              <div class="item-title">内容发布数量</div>
              <div class="item-content data-view-number">{{ topData.newsCount }}</div>
            </div>
            <div class="top-data-item">
              <div class="item-title">入住商家总数</div>
              <div class="item-content data-view-number">{{ topData.shopCount }}</div>
            </div>
          </div>
          <div class="selected-area">
            <span>当前区域：{{ currentCity.name }}</span>
            <div class="button-back"
              v-show="currentCity.parentId && currentCity.cityId !== userInfo.manageCityId"
              @click="cityChange(currentCity.parentId)"
            >返回上一级</div>
          </div>
          <div class="map-box">
            <div class="map-container">
              <map-data ref="mapView" @city-change="cityChange"></map-data>
            </div>
          </div>
          <div class="operate-box">
            <div class="module-title">超能APP运营数据</div>
            <operate-data></operate-data>
          </div>
        </div>
        <div class="body-right">
          <div class="news-box">
            <div class="module-title">内容运营</div>
            <news-data ref="newsView"></news-data>
          </div>
          <div class="recruit-box">
            <div class="module-title">就业易统计</div>
            <div class="recruit-data-list">
              <div class="recruit-data-item">
                <div class="item-title">职位累计发布数</div>
                <div class="item-content data-view-number1">{{ recruitData.recruitCount }}</div>
              </div>
              <div class="recruit-data-item">
                <div class="item-title">当前在职职位数</div>
                <div class="item-content data-view-number1">
                  {{ recruitData.userRecruitCount }}
                </div>
              </div>
              <div class="recruit-data-item">
                <div class="item-title">招聘单位数</div>
                <div class="item-content data-view-number1">
                  {{ recruitData.validRecruitCount }}
                </div>
              </div>
            </div>
          </div>
          <div class="group-box">
            <div class="module-title">社群圈子统计</div>
            <circle-data ref="circleView"></circle-data>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <div :class="{ 'wel-full': fullScreen }">
  </div> -->
</template>

<script>
import MapData from "./dataView/MapData";
import NewsData from "./dataView/newsData/index";
import OrderData from "./dataView/orderData/index";
import CircleData from "./dataView/circleData/index";
import ActivityData from "./dataView/activityData/index";
import OperateData from "./dataView/operateData/index";
import { dateFormat } from '@/util/date'
import {
  recruitStatistics,
  newsStatistics,
  newsStatisticsMap,
  shopStatisticsMap,
  activityStatisticsMap,
} from "@/api/dataView/index";
import { setfullscreen, listenfullscreen } from "@/util/util";
import { mapGetters } from "vuex";

function reconsitutionCity(city, parentId) {
  let currentCity = {
    cityId: city.id,
    name: city.regionName,
    cityCode: city.regionCode,
    parentId,
  };
  if (city.children && city.children.length > 0) {
    let children = city.children;
    let childrenC = [];
    for (let i = 0; i < children.length; i++) {
      childrenC.push({
        cityId: children[i].id,
        cityCode: children[i].regionCode,
        name: children[i].regionName,
      });
    }
    currentCity.children = childrenC;
  }
  return currentCity;
}

function getCurrentCityById(cityList, cityId, parentId) {
  for (let i = 0; i < cityList.length; i++) {
    let city = cityList[i];
    if (city.id == cityId) {
      return reconsitutionCity(city, parentId);
    } else if (city.children && city.children.length > 0) {
      let currentCity = getCurrentCityById(city.children, cityId, city.id);
      if (currentCity) {
        return currentCity;
      }
    }
  }
}

export default {
  name: "Wel",
  components: {
    MapData,
    NewsData,
    OrderData,
    CircleData,
    ActivityData,
    OperateData,
  },
  data() {
    return {
      currentCity: {},
      fullScreen: false,
      topData: {
        newsCount: 0,
        shopCount: 0,
        activityCount: 0,
      },
      recruitData: {
        recruitCount: 0,
        userRecruitCount: 0,
        validRecruitCount: 0,
      },
      time: null
    };
  },
  computed: {
    ...mapGetters(["cityTree", "userInfo"]),
  },
  created () {
    this.time = new Date()
    this.interval = setInterval(() => {
      this.time = new Date()
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.interval)
    this.interval = null
  },
  mounted() {
    this.refreshData(this.userInfo.manageCityId);
    listenfullscreen((value) => {
      const isFullScreen =
        document.fullScreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen ||
        document.msFullscreenElement;
      if (!isFullScreen) {
        this.$store.commit('SET_VIEWFULL', false)
        this.fullScreen = false;
      }
    });
  },
  methods: {
    dateFormat,
    refreshData(cityId) {
      this.currentCity = getCurrentCityById(this.cityTree, cityId);
      this.getMapStatisticsData(cityId).then((data) => {
        this.$refs.mapView.setOption(this.currentCity, data);
      });
      this.getRecruitStatisticsData(cityId);
      this.$refs.newsView.resetCity(cityId);
      this.$refs.orderView.resetCity(cityId);
      this.$refs.circleView.resetCity(cityId);
      this.$refs.activityView.resetCity(cityId);
    },
    getMapStatisticsData(cityId) {
      return new Promise((resolve, reject) => {
        let promises = [];
        promises.push(
          new Promise((res, rej) => {
            newsStatisticsMap(cityId)
              .then(
                ({ data }) => {
                  if (data.code === 0) {
                    let newsData = data.data.data;
                    let newsCount = 0;
                    for (let i = 0; i < newsData.length; i++) {
                      newsCount += newsData[i].count;
                    }
                    this.topData.newsCount = newsCount;
                    res({
                      news: data.data.data,
                    });
                  } else {
                    res({
                      news: [],
                    });
                  }
                },
                () => {
                  res({
                    news: [],
                  });
                }
              )
              .catch(() => {
                res({
                  news: [],
                });
              });
          })
        );
        promises.push(
          new Promise((res, rej) => {
            shopStatisticsMap(cityId)
              .then(
                ({ data }) => {
                  if (data.code === 0) {
                    let shopData = data.data.data;
                    let shopCount = 0;
                    for (let i = 0; i < shopData.length; i++) {
                      shopCount += shopData[i].count;
                    }
                    this.topData.shopCount = shopCount;
                    res({
                      shop: data.data.data,
                    });
                  } else {
                    res({
                      shop: [],
                    });
                  }
                },
                () => {
                  res({
                    shop: [],
                  });
                }
              )
              .catch(() => {
                res({
                  shop: [],
                });
              });
          })
        );
        promises.push(
          new Promise((res, rej) => {
            activityStatisticsMap(cityId)
              .then(
                ({ data }) => {
                  if (data.code === 0) {
                    let activityData = data.data.data;
                    let activityCount = 0;
                    for (let i = 0; i < activityData.length; i++) {
                      activityCount += activityData[i].count;
                    }
                    this.topData.activityCount = activityCount;
                    res({
                      activity: data.data.data,
                    });
                  } else {
                    res({
                      activity: [],
                    });
                  }
                },
                () => {
                  res({
                    activity: [],
                  });
                }
              )
              .catch(() => {
                res({
                  activity: [],
                });
              });
          })
        );
        Promise.all(promises).then((dataList) => {
          let result = {};
          for (let i = 0; i < dataList.length; i++) {
            result = {
              ...result,
              ...dataList[i],
            };
          }
          resolve(result);
        });
      });
    },
    cityChange(cityId) {
      if (cityId && cityId != this.currentCity.cityId) {
        this.refreshData(cityId);
      }
    },
    getRecruitStatisticsData(cityId) {
      recruitStatistics(cityId).then(({ data }) => {
        this.recruitData = data.data.data;
      });
    },
    handleFullScreen() {
      this.$store.commit('SET_VIEWFULL', true)
      this.fullScreen = true;
      setfullscreen();
    },
  },
};
</script>

<style scoped="scoped" lang="scss">
.wel-full {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10000;
  overflow: auto;
}
.wel-container-view {
  user-select: none;
  height: 100%;
  width: 100%;
  min-height: 1080px;
  min-width: 1920px;
  background-color: #101b3c;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wel-container {
  position: relative;
  height: 1080px;
  width: 1920px;
  overflow: hidden;
  background-color: #101b3c;

  background-image: url("/images/dataView/pic_bg.png");
  background-size: 1487px 1050px;
  background-position: 224px 0px;
  background-repeat: no-repeat;
  .wel-container-header {
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    height: 77px;
    background-image: url("/images/dataView/pic_biaoti_bg.png");
    .header-date {
      flex: 250px 0 0;
      padding: 15px 0 34px;
      height: 28px;
      line-height: 28px;
      color: #3e92e0;
      font-size: 20px;
    }
    .header-title {
      flex: 525px 0 0;
      height: 42px;
      width: 525px;
      background-image: url("/images/dataView/pic_title.png");
    }
    .header-right {
      padding: 11px 0 26px 0;
      display: flex;
      align-items: center;
      justify-content: start-end;
      .header-time {
        height: 40px;
        line-height: 45px;
        font-size: 30px;
        color: #3e92e0;
        font-family: Oxanium-Bold;
        text-align: right;
      }
      .icon-fullscreen {
        margin-left: 22px;
        height: 27px;
        width: 50px;
        cursor: pointer;
        background-image: url("/images/dataView/icon_fullscreen.png");
      }
    }
  }
  .wel-container-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 24px;
    .body-left {
      height: 945px;
      flex: 534px 0 0;
      .activity-box {
        height: 565px;
        width: 534px;
        background-image: url("/images/dataView/pic_bg_activity.png");
      }
      .order-box {
        height: 372px;
        width: 534px;
        margin-top: 8px;
        background-image: url("/images/dataView/pic_bg_order.png");
      }
    }
    .body-center {
      margin: 0 12px;
      height: 945px;
      flex: 100px 1 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .top-data-box {
        display: flex;
        height: 130px;
        flex: 130px 0 0;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        .top-data-item {
          height: 130px;
          width: 266px;
          background-image: url("/images/dataView/pic_shuju_bgbig.png");
          .item-title {
            padding-top: 20px;
            text-align: center;
            color: #87c2f8;
            font-size: 16px;
          }
          .item-content {
            margin-top: 8px;
            font-size: 48px;
            height: 56px;
            line-height: 56px;
            color: #d4eaff;
            text-align: center;
          }
        }
      }
      .map-box {
        position: relative;
        z-index: 0;
        width: 100%;
        flex: 100px 1 1;
        display: flex;
        flex-direction: column;
        padding: 2px 0 4px;
        justify-content: center;
        align-items: center;
        .map-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 500px;
        }
      }
      .operate-box {
        z-index: 2;
        flex: 333px 0 0;
        height: 333px;
        width: 822px;
        background-image: url("/images/dataView/pic_bg_operate.png");
      }
    }
    .body-right {
      height: 945px;
      flex: 490px 0 0;
      .news-box {
        height: 518px;
        width: 490px;
        background-image: url("/images/dataView/pic_bg_news.png");
      }
      .recruit-box {
        margin-top: 8px;
        height: 150px;
        width: 490px;
        background-image: url("/images/dataView/pic_bg_recruit.png");
        .recruit-data-list {
          margin-top: 15px;
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .recruit-data-item {
            text-align: center;
            .item-title {
              height: 22px;
              line-height: 22px;
              font-size: 16px;
              color: #87c2f8;
            }
            .item-content {
              margin-top: 2px;
              height: 32px;
              line-height: 32px;
              font-size: 28px;
              color: #d4eaff;
            }
          }
        }
      }
      .group-box {
        margin-top: 8px;
        height: 262px;
        width: 490px;
        background-image: url("/images/dataView/pic_bg_group.png");
      }
    }
  }
  .module-title {
    position: relative;
    margin-left: 20px;
    padding: 23px 0 0 23px;
    height: 32px;
    line-height: 32px;
    font-family: PingFangSC-Semibold;
    font-size: 24px;
    color: #d4eaff;
    &:before {
      content: "";
      position: absolute;
      height: 10px;
      width: 10px;
      bottom: 11px;
      left: 0;
      background-image: url("/images/dataView/icon_module_title.png");
    }
  }
  .selected-area {
    display: flex;
    margin-top: 2px;
    width: 100%;
    height: 20px;
    color: #87c2f8;
    .button-back {
      margin-left: 10px;
      height: 20px;
      line-height: 20px;
      padding: 0 10px;
      font-size: 8px;
      border-radius: 2px;
      font-size: 10px;
      background-color: #3185da;
      color: #ffffff;
      cursor: pointer;
    }
  }
}
</style>
