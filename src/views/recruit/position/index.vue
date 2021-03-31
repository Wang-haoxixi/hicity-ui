<template>
  <basic-container>
    <hc-table-form
      :formVisible="viewDetail"
      :title="title"
      @go-back="viewDetail = false">
      <hc-crud ref="hcCrud" :fetchListFun="fetchListFun" :option="tableOption">
        <template v-slot:menu="scope">
          <el-button type="text" size="mini" @click="toView(scope.row)">详情</el-button>
          <template v-if="scope.row.status == '1' && scope.row.auditStatus == '1'">
            <el-button type="text" size="mini">上架</el-button>
            <el-button type="text" size="mini">拒绝</el-button>
          </template>
          <el-button v-if="scope.row.status == '1' && (scope.row.auditStatus == '0' || scope.row.auditStatus == '2')" type="text" size="mini">下架</el-button>
        </template>
      </hc-crud>
      <position-detail slot="form" :position-detail="positionDetail"></position-detail>
    </hc-table-form>
  </basic-container>
</template>

<script>
import { getPositionList, getPositionDetail } from "@/api/recruit/position"
import PositionDetail from "./PositionDetail"
export default {
  components: { PositionDetail },
  data () {
    return {
      viewDetail: false,
      tableOption: {
        labelWidth: '100px',
        columns: [
          {
            label: '职位ID',
            prop: 'recruitPositionId',
            width: 100,
          },
          {
            label: '职位名称',
            prop: 'name'
          },
          {
            label: '发布人',
            prop: 'createByName',
            width: 120,
          },
          {
            label: '发布时间',
            prop: 'createTime',
            width: 160,
          },
          {
            label: '职位状态',
            prop: 'status',
            width: 100,
            formatter: function (row) {
              if (row.status == '1') {
                if (row.auditStatus == '1') {
                  return '待审核'
                } else if (row.auditStatus == '2' || row.auditStatus == '0') {
                  return '招聘中'
                } else if (row.auditStatus == '3') {
                  return '审核未通过'
                }
              } else if (row.status == '2') {
                return '已关闭'
              } else if (row.status == '3') {
                return '已下架'
              }
              return ''
            },
          },
          {
            label: '工作城市',
            prop: 'city',
            width: 120,
          }
        ],
        menu: true,
        menuWidth: 100
      },
      positionDetail: {}
    }
  },
  computed: {
    title () {
      if (this.viewDetail) {
        return '职位详情'
      } else {
        return '职位管理'
      }
    }
  },
  methods: {
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        getPositionList(params).then(({data}) => {
          let records = data.data.data.records
          for (let i = 0; i < records.length; i++) {
            if (!records[i].positionLableType) {
              records[i].positionLableType = ''
            }
          }
          resolve({
            records,
            page: {
              total: data.data.data.total
            }
          })
        })
      })
    },
    toView ({recruitPositionId}) {
      getPositionDetail({recruitPositionId}).then(({data}) => {
        this.positionDetail = data.data.data
        this.viewDetail = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
