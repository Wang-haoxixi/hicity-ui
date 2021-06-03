<template>
  <el-dialog
    title="选择合伙人"
    :visible.sync="dialogVisible"
    width="70%">
    <hc-crud ref="hcCrud" :option="tableOption" :fetchListFun="fetchListFun" :auto-load="false">
      <template slot="menu" slot-scope="scope">
        <el-button type="text" size="mini" @click="toSelect(scope.row)" :disabled="selectList.includes(scope.row.userId)">选择</el-button>
      </template>
    </hc-crud>
  </el-dialog>
</template>

<script>
import { getCityAdmin } from '@/api/admin/city'
export default {
  data () {
    return {
      dialogVisible: false,
      selectList: [],
      tableOption: {
        columns: [
          {
            label: '合伙人账户',
            prop: 'userName',
            search: true,
          },
          {
            label: '账户类型',
            prop: 'wxHierarchy',
          },
          {
            label: '城市/地区',
            prop: 'cityName',
          },
        ],
        menu: true,
        menuWidth: '60px',
      },
    }
  },
  methods: {
    open (selectList) {
      this.selectList = []
      if (selectList && selectList.length > 0) {
        for (let i = 0; i < selectList.length; i++) {
          this.selectList.push(selectList[i].wxUserId)
        }
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.hcCrud.resetSearch()
        this.$refs.hcCrud.toSearch()
      })
    },
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        getCityAdmin(params).then(({data})=>{
          let list = data.data.data.records
          for (let i = 0; i < list.length; i++) {
            if (list[i].userType == 3 || list[i].userType == 4) {
              list[i].wxHierarchy = '平台'
              list[i].cityId = 1
              list[i].cityName = '全国'
            } else if (list[i].userType == 1 || list[i].userType == 2 || list[i].userType == 5 || list[i].userType == 6) {
              list[i].wxHierarchy = '合伙人'
            } else {
              list[i].wxHierarchy = ''
            }
          }
          resolve({
            records: data.data.data.records,
            page: {
              total: data.data.data.total
            }
          })
        })
      })
    },
    toSelect (row) {
      this.$emit('select', row)
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="" scoped>
</style>
