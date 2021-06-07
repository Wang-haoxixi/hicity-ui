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
  for (let i = 0; i < city.children.length; i++) {
    let cityC = city.children[i]
    let child = getCityTree(cityC, idList)
    if (child) {
      children.push(child)
    }
  }
  if (children.length > 0) {
    if (children.length == city.children.length) {
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
  let children = []
  for (let i = 0; i < city.children.length; i++) {
    let cityC = city.children[i]
    let child = getCityRange(cityC, cityRange)
    if (child) {
      children.push(child)
    }
  }
  if (children.length > 0) {
    return {
      ...cityData,
      children,
      selfDisabled: city.children.length != children.length
    }
  } else if (cityRange.includes(city.id)) {
    return {
      ...cityData,
      children: city.children
    }
  }
  return null
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
        usedCity = getCityRange(usedCity, cityRange)
      }
      let cityTree = getCityTree(usedCity, initCityList)
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
