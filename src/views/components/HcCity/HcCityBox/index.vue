<template>
  <hc-city-box ref="box" @save="save"></hc-city-box>
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

export default {
  components: { HcCityBox },
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters(['allCityTree']),
  },
  methods: {
    open (cityId = 1, initCityList = [], viewOnly = false) {
      let usedCity = getUsedCity(this.allCityTree, cityId)
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
