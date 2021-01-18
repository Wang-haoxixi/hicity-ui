<template>
  <div class="city-box">
    <div class="city-result"></div>
    <div class="city-select">
      <div class="city-select-nav">
        <div v-for="city in citys" :key="city.key" class="city-select-nav-item" :class="{'checked': selectKey == city.key}">{{city.key}}</div>
      </div>
      <div class="city-select-list"></div>
    </div>
  </div>
</template>

<script>
import pinyin from 'pinyin'
function formatCitys (cityList) {
  let dataList = []
  cityList.sort((a, b) => {
    return pinyin.compare(a, b)
  })
  let data = {}
  for (let i = 0; i < cityList.length; i++) {
    let firstLetter = pinyin(cityList[i].name, {style: pinyin.STYLE_INITIALS})[0].toUpperCase()
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
          cityList: cityList[i]
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
  console.log(dataList)
  return dataList
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
    }
  },
  computed: {
    citys () {
      if (viewOnly) {
        return formatCitys()
      }
    }
  }
}
</script>

<style lang="" scoped>
</style>
