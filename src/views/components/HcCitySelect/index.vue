<template>
  <div>
    <el-input @focus="toSelect" :value="cityName" readonly></el-input>
    <el-dialog
      title="选择城市"
      :visible.sync="cityChooseDialogVisible"
      append-to-body
      width="70%">
      <hc-city-box ref="HcCityBox" v-if="cityChooseDialogVisible" :all-city-list="allCityList" :init-city-list="initCityList"></hc-city-box>
      <div slot="footer">
        <el-button @click="cityChooseDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSelect()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import HcCityBox from '@/views/components/HcCityBox/index'
import { adminCityList } from '@/api/admin/city'
export default {
  components: { HcCityBox },
  props: {
    value: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      initCityList: [],
      allCityList: [],
      citySelected: [],
      cityChooseDialogVisible: false,
    }
  },
  computed: {
    cityName () {
      let cityName = ''
      for (let i = 0; i < this.citySelected.length; i++) {
        cityName += cityName ? ` / ${this.citySelected[i].cityName}` : this.citySelected[i].cityName
      }
      return cityName
    }
  },
  created () {
    this.initCityList = this.value
    adminCityList().then(({data}) => {
      let cityList = data.data.data
      this.allCityList = []
      for (let i = 0; i < cityList.length; i++) {
        this.allCityList.push({
          cityId: cityList[i].id,
          cityName: cityList[i].regionName
        })
      }
      this.initSelect()
    })
  },
  watch: {
    value (val) {
      this.initCityList = val
      this.initSelect()
    }
  },
  methods: {
    initSelect () {
      this.citySelected = []
      let allCityList = [...this.allCityList, { cityId: 1, cityName: '全国' }]
      for (let i = 0; i < allCityList.length; i++) {
        if (this.value.includes(allCityList[i].cityId)) {
          this.citySelected.push(allCityList[i])
        }
      }
    },
    toSelect () {
      this.cityChooseDialogVisible = true
    },
    handleSelect () {
      this.citySelected = this.$refs.HcCityBox.citySelected
      let cityIdList = []
      for (let i = 0; i < this.citySelected.length; i++) {
        cityIdList.push(this.citySelected[i].cityId)
      }
      this.$emit('input', cityIdList)
      this.cityChooseDialogVisible = false
    }
  }
}
</script>

<style lang="" scoped>
</style>
