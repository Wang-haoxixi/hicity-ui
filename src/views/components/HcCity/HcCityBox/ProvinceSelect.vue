<template>
  <el-dialog
    title="省份选择"
    :visible.sync="dialogVisible"
    append-to-body
    width="60%">
    <div>
      <el-checkbox-group v-model="provinceSelect">
        <el-checkbox v-for="province in provinceData" :label="province" :key="province.id" style="padding: 5px 0">{{province.name}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">返 回</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      provinceSelect: [],
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['cityTree']),
    provinceData () {
      let cityList = this.cityTree[0].children
      let provinceData = []
      for (let i = 0; i < cityList.length; i++) {
        let city = cityList[i]
        if (city.regionLvl == '2') {
          let cityC = city.children
          let children = []
          for (let j = 0; j < cityC.length; j++) {
            children.push({
              id: cityC[j].id,
              regionName: cityC[j].regionName
            })
          }
          provinceData.push({
            id: city.id,
            name: city.regionName,
            children
          })
        } else if (city.regionLvl == '3') {
          provinceData.push({
            id: city.id,
            name: city.regionName,
            children: [{
              id: city.id,
              regionName: city.regionName
            }]
          })
        }
      }
      return provinceData
    }
  },
  methods: {
    open () {
      this.provinceSelect = []
      this.dialogVisible = true
    },
    save () {
      let cityList = []
      let provinceSelect = this.provinceSelect
      for (let i = 0; i < provinceSelect.length; i++) {
        cityList = [...cityList, ...provinceSelect[i].children]
      }
      this.$emit('save', cityList)
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="" scoped>
</style>
