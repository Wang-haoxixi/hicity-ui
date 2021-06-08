<template>
  <div>
    <hc-crud ref="hcCrud" :fetchListFun="fetchListFun" :option="tableOption" :auto-load="false" @toCancelRecommend="toCancelRecommend">
      <template v-slot:range="scope">
        <el-button type="text" size="mini" @click="cityView(scope.row.id)">查看</el-button>
      </template>
    </hc-crud>

    <hc-city-box ref="hcCityBox"></hc-city-box>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRecommendPage, getRecommendRange, cancelRecommend } from "@/api/cms/news"
import HcCityBox from '@/views/components/HcCity/HcCityBox/index'
export default {
  components: { HcCityBox },
  data () {
    return {
      tableOption: {
        columns: [
          {
            label: '资讯名称',
            prop: 'dataName',
          },
          {
            label: '推荐范围',
            prop: 'range',
            slot: true,
            width: 120,
          }
        ],
        header: false,
        menuWidth: '80',
        menu: [
          {
            label: '取消推荐',
            fun: 'toCancelRecommend'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods: {
    open () {
      this.$refs.hcCrud.resetSearch()
      this.$refs.hcCrud.toSearch()
    },
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        getRecommendPage(params).then(({data})=>{
          resolve({
            records: data.data.data.records,
            page: {
              total: data.data.data.total
            }
          })
        })
      })
    },
    cityView (id) {
      getRecommendRange({recId: id}).then(({data})=>{
        this.$refs.hcCityBox.open(this.userInfo.manageCityId, data.data.data || [], true)
      })
    },
    toCancelRecommend ({id}) {
      this.$confirm("是否确认取消推荐该资讯?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        cancelRecommend(id).then(({data}) => {
          if (data.code === 0) {
            this.$message.success('操作成功')
            this.$emit('refresh')
            this.$refs.hcCrud.refresh()
          }
        })
      })
    }
  }
}
</script>

<style lang="" scoped>
</style>
