<template>
  <div>
    <el-input :disabled="disabled" :value="cityName" readonly @focus="toSelect"></el-input>
    <hc-city-box ref="hcCityBox" :title="title" :single="single" @save="save"></hc-city-box>
  </div>
</template>

<script>
import HcCityBox from '@/views/components/HcCity/HcCityBox/index'
import { mapGetters } from 'vuex'

function getCityList (tree) {
  let cityList = []
  if (tree) {
    if (tree.children) {
      for (let i = 0; i < tree.children.length; i++) {
        cityList = [...cityList, ...getCityList(tree.children[i])]
      }
    } else {
      cityList.push(tree.id)
    }
  }
  return cityList
}

function getLastCity (citySelected) {
  if (citySelected) {
    if (citySelected.children && citySelected.children.length > 0) {
      return getLastCity(citySelected.children[0])
    } else {
      return citySelected.regionName
    }
  } else {
    return ''
  }
}

function getCityShow (citySelected) {
  let citys = []
  if (citySelected) {
    if (citySelected.children && citySelected.children.length > 0) {
      for (let i = 0; i < citySelected.children.length; i++) {
        let child = citySelected.children[i]
        if (child.children && child.children.length > 0) {
          citys.push(`${child.regionName}(${child.children.length})`)
        } else {
          citys.push(`${child.regionName}`)
        }
      }
    } else {
      citys.push(`${citySelected.regionName}`)
    }
  }
  return citys
}

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
  props: {
    value: {
      type: [Array, String, Number],
      required: true
    },
    cityId: {
      type: Number,
      default: 1
    },
    single: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '展示城市'
    },
    viewOnly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      citySelected: !this.single ? [] : '',
      cityChooseDialogVisible: false,
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'allCityTree']),
    cityName () {
      if (this.single) {
        return this.citySelected
      } else {
        let cityName = ''
        for (let i = 0; i < this.citySelected.length; i++) {
          cityName += cityName ? ` / ${this.citySelected[i]}` : this.citySelected[i]
        }
        return cityName
      }
    }
  },
  created () {
    this.initSelect()
  },
  watch: {
    value () {
      this.initSelect()
    }
  },
  methods: {
    initSelect () {
      let usedCity = getUsedCity(this.allCityTree, this.cityId)
      let cityTree = getCityTree(usedCity, this.single ? (this.value ? [this.value] : []) : this.value)
      this.citySelected = !this.single ? getCityShow(cityTree) : getLastCity(cityTree)
    },
    toSelect () {
      this.$refs.hcCityBox.open(this.cityId, this.single ? (this.value ? [this.value] : []) : (this.value || []), this.viewOnly)
    },
    save (city) {
      this.citySelected = !this.single ? getCityShow(city) : getLastCity(city)
      let cityList = getCityList(city)
      this.$emit('input', !this.single ? cityList : (cityList && (cityList.length > 0 ? cityList[0] : '')))
    },
  }
}
</script>

<style lang="" scoped>
</style>
