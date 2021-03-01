<template>
  <div>
    <el-dialog
      title="展示城市"
      :visible.sync="dialogVisible"
      width="70%">
      <div class="hc-city-box">
        <div class="city-result">
          <div class="city-result-label">展示范围：</div>
          <div class="city-result-list">
            <div v-for="(city, index) in cityShowSelected" :key="index" class="city-result-list-item">{{city}}</div>
          </div>
        </div>
        <div class="city-select">
          <div class="city-select-nav">
            <div v-for="city in cityMapList" :key="city.key" class="city-select-nav-item" :class="{'checked': selectKey == city.key}" @click="cityArangeSelect(city)">{{city.key}}</div>
          </div>
          <div class="city-select-list">
            <!-- <div v-for="city in cityArange" :key="city.id" class="city-select-list-item"  :class="{'checked': hasSelected(city.id)}" @click="selectCity(city)">
              <div class="item-name">{{city.regionName}}</div>
              <div class="item-number">{{cityChildren(city.id)}}</div>  
            </div> -->
            <city-name v-for="city in cityArange" :key="city.id" :checked="!!hasSelected(city.id)"
              :name="city.regionName"
              :number="cityChildren(city.id)"
              @click.native="selectCity(city)"></city-name>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">返 回</el-button>
        <el-button v-if="!viewOnly" type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
    <hc-city-box v-if="handleNext" ref="box" :single="single" @save="saveSelect"></hc-city-box>
  </div>
</template>

<script>
import pinyin from 'pinyin'
import { deepClone } from '@/util/util'
import HcCityBox from './box'
import CityName from './CityName'
const cqRegexp  = /^重庆/

function formatCitys (tempCityList) {
  let cityList = Object.assign([], tempCityList)
  let dataList = []
  cityList.sort((a, b) => {
    let a_name = a.regionName.replace(cqRegexp, '崇庆')
    let b_name = b.regionName.replace(cqRegexp, '崇庆')
    return pinyin.compare(a_name, b_name)
  })
  let data = {}
  for (let i = 0; i < cityList.length; i++) {
    let firstLetter = ''
    if (cqRegexp.test(cityList[i].regionName)) {
      firstLetter = 'C'
    } else {
      firstLetter = pinyin(cityList[i].regionName, {style: pinyin.STYLE_FIRST_LETTER, segment: true})[0][0][0].toUpperCase()
    }
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

export default {
  name: 'HcCityBox',
  components: { HcCityBox, CityName },
  props: {
    single: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectKey: '',
      cityArange: [],
      citySelected: [],
      cityMapList: [],
      dialogVisible: false,

      viewOnly: false,
      allCityTree: {},
      initCityTree: {},
      handleNext: false,
      handleCityId: '',
    }
  },
  computed: {
    cityShowSelected () {
      let citys = []
      let citySelected = this.citySelected
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
  },
  methods: {
    open (allCityTree = {}, initCityTree = {}, viewOnly = false) {
      this.selectKey = ''
      this.cityArange = []
      this.dialogVisible = true
      this.allCityTree = allCityTree
      this.initCityTree = initCityTree
      this.viewOnly = viewOnly
      this.init()
    },
    close () {
      this.dialogVisible = false
    },
    init () {
      this.citySelected = deepClone(this.initCityTree)
      this.cityMapList = formatCitys(this.allCityTree.children)
      this.cityMapList.push({
        key: this.allCityTree.regionName,
        cityList: [{
          id: this.allCityTree.id,
          regionName: this.allCityTree.regionName
        }]
      })
      this.cityArangeSelect(this.cityMapList[0])
    },
    cityArangeSelect ({key, cityList}) {
      this.selectKey = key
      this.cityArange = cityList
    },
    cityChildren (cityId) {
      let data = this.hasSelected(cityId)
      if (data && data.children) {
        return `(${data.children})`
      } else {
        return ''
      }
    },
    hasSelected (cityId) {
      let citySelected = this.citySelected
      if (citySelected) {
        if (cityId == citySelected.id) {
          if (citySelected.children) {
            return false
          } else {
            return {
              children: citySelected.children ? citySelected.children.length : 0,
            }
          }
        } else if (citySelected.children) {
          citySelected = citySelected.children
          for (let i = 0; i < citySelected.length; i++) {
            if (cityId == citySelected[i].id) {
              return {
                children: citySelected[i].children ? citySelected[i].children.length : 0,
                index: i
              }
            }
          }
          return false
        }
      }
      return false
    },
    handleSelect (city) {
      if (this.hasSelected(city.id)) {
        let children = this.citySelected.children
        for (let i = 0; i < children.length; i++) {
          if (city.id == children[i].id) {
            children.splice(i, 1)
            if (children.length == 0) {
              this.citySelected = null
            }
            break
          }
        }
      } else {
        if (this.hasSelected(this.allCityTree.id)) {
          this.citySelected = {
            id: this.allCityTree.id,
            regionName: this.allCityTree.regionName,
            children: [{
              id: city.id,
              regionName: city.regionName
            }]
          }
        } else {
          if (this.citySelected && !this.single) {
            this.citySelected.children.push({
              id: city.id,
              regionName: city.regionName
            })
          } else {
            this.citySelected = {
              id: this.allCityTree.id,
              regionName: this.allCityTree.regionName,
              children: [{
                id: city.id,
                regionName: city.regionName
              }]
            }
          }
        }
      }
    },
    selectCity (city) {
      if (!this.viewOnly) {
        if (city.id == this.allCityTree.id) {
          if (this.hasSelected(city.id)) {
            this.citySelected = null
          } else {
            this.citySelected = {
              id: city.id,
              regionName: city.regionName
            }
          }
        } else {
          let children = this.allCityTree.children
          if (children && children.length > 0) {
            for (let i = 0; i < children.length; i++) {
              if (children[i].id == city.id) {
                if (children[i].children && children[i].children.length > 0) {
                  this.toNext(city)
                } else {
                  this.handleSelect(city)
                }
              }
            }
          }
        }
      } else if (city.id != this.allCityTree.id) {
        let children = this.allCityTree.children
        if (children && children.length > 0) {
          for (let i = 0; i < children.length; i++) {
            if (children[i].id == city.id && children[i].children && children[i].children.length > 0 && this.hasSelected(city.id)) {
              this.toNext(city)
              break
            }
          }
        }
      }
    },
    save () {
      this.$emit('save', this.citySelected)
    },
    saveSelect (city) {
      if (this.citySelected && !this.single) {
        let children = this.citySelected.children
        if (children && children.length > 0) {
          let hasSelected = false
          for (let i = 0; i < children.length; i++) {
            if (children[i].id == this.handleCityId) {
              if (city) {
                children.splice(i, 1, city)
              } else {
                children.splice(i, 1)
              }
              hasSelected = true
              break
            }
          }
          if (!hasSelected && city) {
            children.push(city)
          }
        } else if (city) {
          this.citySelected = {
            id: this.allCityTree.id,
            regionName: this.allCityTree.regionName,
            children: [city]
          }
        }
      } else if (city) {
        this.citySelected = {
          id: this.allCityTree.id,
          regionName: this.allCityTree.regionName,
          children: [city]
        }
      }
      this.handleNext = false
      if (this.single) {
        this.save()
      }
    },
    toNext (city) {
      this.handleCityId = city.id
      let initCityTree = null
      let allCityTree = null

      let allCity = this.allCityTree
      if (allCity && allCity.children.length > 0) {
        let children = allCity.children
        for (let i = 0; i < children.length; i++) {
          if (children[i].id == city.id) {
            allCityTree = children[i]
            break
          }
        }

      }
      let citySelected = this.citySelected
      if (citySelected && citySelected.children) {
        let children = citySelected.children
        for (let i = 0; i < children.length; i++) {
          if (children[i].id == city.id) {
            initCityTree = children[i]
            break
          }
        }
      }
      this.handleNext = true
      this.$nextTick(() => {
        this.$refs.box.open (allCityTree, initCityTree, this.viewOnly)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hc-city-box {
  .city-result {
    display: flex;
    padding: 0 0 20px;
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
        cursor: pointer;
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
      grid-template-columns: repeat(auto-fill, 100px);
      grid-template-rows: repeat(auto-fill, 36px);
      grid-gap: 24px;
      // .city-select-list-item {
      //   height: 36px;
      //   line-height: 36px;
      //   display: flex;
      //   overflow: hidden;
      //   text-overflow: ellipsis;
      //   color: #666666;
      //   &.checked {
      //     color: #1676FF;
      //   }
      //   .item-name {
      //     flex: 1 1 10px;
      //     overflow: hidden;
      //     white-space: nowrap;
      //     text-overflow: ellipsis;
      //   }
      //   // .item-number {
      //   // }
      // }
    }
  }
}
</style>
