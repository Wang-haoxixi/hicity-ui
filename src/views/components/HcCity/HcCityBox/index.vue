<template>
  <hc-city-box ref="box" :title="title" :single="single" :province="province" @save="save"></hc-city-box>
</template>

<script>
import HcCityBox from './box'
import { mapGetters } from 'vuex'

function getUsedCity (cityTree, cityId) {
  for (let i = 0; i < cityTree.length; i++) {
    if (cityTree[i].id == cityId) {
      return cityTree[i]
    } else if (cityTree[i].children && cityTree[i].children.length > 0) {
      let city = getUsedCity(cityTree[i].children, cityId)
      if (city) {
        return city
      }
    }
  }
  return null
}

function getCityTree (city, idList) {
  let children = []
  let hasAllChildren = true
  for (let i = 0; i < city.children.length; i++) {
    let cityC = city.children[i]
    let child = getCityTree(cityC, idList)
    if (child) {
      children.push(child)
      if (child.children) {
        hasAllChildren = false
      }
    }
  }
  if (children.length > 0) {
    if (idList.includes(city.id) && hasAllChildren && children.length == city.children.length) {
      return {
        id: city.id,
        regionName: city.regionName
      }
    } else {
      return {
        id: city.id,
        regionName: city.regionName,
        children
      }
    }
  } else if (idList.includes(city.id)) {
    return {
      id: city.id,
      regionName: city.regionName
    }
  }
  return null
}

function getCityTreeMerge (city, idList) {
  let children = []
  let hasAllChildren = true
  for (let i = 0; i < city.children.length; i++) {
    let cityC = city.children[i]
    let child = getCityTreeMerge(cityC, idList)
    if (child) {
      children.push(child)
      if (child.children) {
        hasAllChildren = false
      }
    }
  }
  if (children.length > 0) {
    if (hasAllChildren && children.length == city.children.length) {
      return {
        id: city.id,
        regionName: city.regionName
      }
    } else {
      return {
        id: city.id,
        regionName: city.regionName,
        children
      }
    }
  } else if (idList.includes(city.id)) {
    return {
      id: city.id,
      regionName: city.regionName
    }
  }
  return null
}

function getCityRange (city, cityRange) {
  let cityData = {
    id: city.id,
    regionName: city.regionName,
  }
  let selfDisabled = false
  let children = []
  for (let i = 0; i < city.children.length; i++) {
    let cityC = city.children[i]
    let child = getCityRange(cityC, cityRange)
    if (child) {
      children.push(child)
      if (child.selfDisabled) {
        selfDisabled = true
      }
    }
  }
  if (children.length > 0) {
    return {
      ...cityData,
      children,
      selfDisabled: selfDisabled || city.children.length != children.length
    }
  } else if (cityRange.includes(city.id)) {
    return {
      ...cityData,
      children: city.children
    }
  }
  return null
}

function getCityRangeAll (cityList, cityRange, includeParent = false) {
  let allRange = []
  if (includeParent) {
    for (let i = 0; i < cityList.length; i++) {
      if (cityRange.includes(cityList[i].id)) {
        includeParent = false
      }
    }
  }
  for (let i = 0; i < cityList.length; i++) {
    if (cityList[i].children && cityList[i].children.length > 0) {
      let rangeC = getCityRangeAll(cityList[i].children, cityRange, cityRange.includes(cityList[i].id) || includeParent)
      allRange = [...allRange, ...rangeC]
    } else if (cityRange.includes(cityList[i].id) || includeParent) {
      allRange = [...allRange, cityList[i].id]
    }
  }
  return allRange
}

export default {
  components: { HcCityBox },
  props: {
    single: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '展示城市'
    },
    province: {
      type: Boolean,
      default: false
    },
    noMerge: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters(['allCityTree']),
  },
  methods: {
    open (cityId = 1, initCityList = [], viewOnly = false, cityRange) {
      let usedCity = getUsedCity(this.allCityTree, cityId)
      if (cityRange && cityRange.length > 0) {
        cityRange = getCityRangeAll(this.allCityTree, cityRange)
        usedCity = getCityRange(usedCity, cityRange)
      }
      let cityTree = this.noMerge ? getCityTree(usedCity, initCityList) : getCityTreeMerge(usedCity, initCityList)
      this.$refs.box.open(usedCity, cityTree, viewOnly)
    },
    save (city) {
      this.$refs.box.close()
      this.$emit('save', city)
    }
  }
}
</script>

<style lang="" scoped>
</style>
