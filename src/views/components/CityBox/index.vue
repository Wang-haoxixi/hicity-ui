<template>
  <div class="city-box">
    <div class="city-result">
      <div class="city-result-label">展示范围：</div>
      <div class="city-result-list">
        <div v-for="city in citySelected" :key="city.cityId" class="city-result-list-item">{{city.cityName}}</div>
      </div>
    </div>
    <div class="city-select">
      <div class="city-select-nav">
        <div v-for="city in citys" :key="city.key" class="city-select-nav-item" :class="{'checked': selectKey == city.key}" @click="cityArangeSelect(city)">{{city.key}}</div>
      </div>
      <div class="city-select-list">
        <div v-for="city in cityArange" :key="city.cityId" class="city-select-list-item"  :class="{'checked': hasSelected(city.cityId).checked}" @click="selectCity(city)">{{city.cityName}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import pinyin from 'pinyin'
import { adminCityList } from '@/api/admin/city'

function formatCitys (tempCityList) {
  let cityList = Object.assign([], tempCityList)
  let dataList = []
  cityList.sort((a, b) => {
    return pinyin.compare(a.cityName, b.cityName)
  })
  let data = {}
  for (let i = 0; i < cityList.length; i++) {
    let firstLetter = pinyin(cityList[i].cityName, {style: pinyin.STYLE_INITIALS, segment: true})[0][0][0].toUpperCase()
    if (data.key) {
      if ( data.key.includes(firstLetter) ) {
        data.cityList.push(cityList[i])
      } else if (data.key.length < 3) {
        data.key = data.key + firstLetter
        data.cityList.push(cityList[i])
      } else {
        dataList.push({
          key: data.key,
          cityList: Object.assign([], data.cityList)
        })
        data = {
          key: firstLetter,
          cityList: [cityList[i]]
        }
      }
    } else {
      data = {
        key: firstLetter,
        cityList: [cityList[i]]
      }
    }
  }
  if (data.key) {
    dataList.push(data)
  }
  return dataList
}

function getSelected (cityList) {
  let selectedList = []
  for (let i = 0; i < cityList.length; i++) {
    if (cityList[i].isOpening) {
      selectedList.push({
        cityId: cityList[i].cityId,
        cityName: cityList[i].cityName
      })
    }
  }
  return selectedList
}

export default {
  props: {
    viewOnly: {
      type: Boolean,
      default: false,
    },
    cityList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      selectKey: '',
      allCityList: [],
      cityArange: [],
      citySelected: [],
      citys: []
    }
  },
  created () {
    this.init()
  },
  watch: {
    cityList () {
      this.init()
    }
  },
  methods: {
    init () {
      if (!this.viewOnly) {
        adminCityList().then(({data}) => {
          let cityList = data.data.data
          let allCityList = []
          for (let i = 0; i < cityList.length; i++) {
            allCityList.push({
              cityId: cityList[i].id,
              cityName: cityList[i].regionName
            })
          }
          this.citys = formatCitys(allCityList)
          this.citys.push({
          key: '全国',
          cityList: [{
            cityId: 1,
            cityName: '全国'
          }]
        })
          this.citySelected = Object.assign([], this.cityList)
        })
      } else {
        this.citySelected = getSelected(this.cityList)
        this.citys = formatCitys(this.cityList)
      }
    },
    cityArangeSelect ({key, cityList}) {
      this.selectKey = key
      this.cityArange = cityList
    },
    hasSelected (cityId) {
      for (let i = 0; i < this.citySelected.length; i++) {
        if (this.citySelected[i].cityId == cityId) {
          return {
            checked: true,
            index: i
          }
        }
      }
      return false
    },
    selectCity (city) {
      if (!this.viewOnly) {
        let hasSelected = this.hasSelected(city.cityId)
        if (hasSelected.checked) {
          this.citySelected.splice(hasSelected.index, 1)
        } else {
          this.citySelected.push(city)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.city-box {
  .city-result {
    display: flex;
    padding: 20px 0;
    justify-content: flex-start;
    align-items: flex-start;
    .city-result-label {
      flex: 70px 0 0;
      height: 32px;
      line-height: 32px;
    }
    .city-result-list {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;
      flex: 100px 1 1;
      min-height: 30px;
      padding: 0 12px;
      border: 1px solid #D9D9D9;
      border-radius: 4px;
      .city-result-list-item {
        height: 30px;
        line-height: 30px;
        &:not(:last-child) {
          &::after {
            content: '/';
            padding: 0 5px;
            color: #D9D9D9;
          }
        }
      }
    }
  }
  .city-select {
    .city-select-nav {
      position: relative;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 41px;
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        border-bottom: 1px solid #D9D9D9;
        z-index: 0;
      }
      .city-select-nav-item {
        position: relative;
        z-index: 1;
        height: 41px;
        line-height: 40px;
        padding: 0 10px;
        color: #6985AE;
        font-size: 14px;
        &.checked {
          color: #333333;
          &::after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            border: 1px solid #D9D9D9;
            border-bottom: 1px solid #FFFFFF;
          }
        }
      }
    }
    .city-select-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, 80px);
      grid-template-rows: repeat(auto-fill, 36px);
      grid-gap: 24px;
      .city-select-list-item {
        height: 36px;
        line-height: 36px;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #666666;
        &.checked {
          color: #1676FF;
        }
      }
    }
  }
}
</style>
