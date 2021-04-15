<template>
  <basic-container>
    <hc-table-form
      :formVisible="viewDetail"
      :title="title"
      @go-back="viewDetail = false">
      <hc-crud ref="hcCrud" :fetchListFun="fetchListFun" :option="tableOption">
        <template v-slot:menu="scope">
          <el-button type="text" size="mini" @click="toView(scope.row)">详情</el-button>
          <template v-if="scope.row.status == '3' && scope.row.auditStatus == '1'">
            <el-button type="text" size="mini" @click="audit(scope.row, 'pass')">上架</el-button>
            <el-button type="text" size="mini" @click="audit(scope.row, 'reject')">拒绝</el-button>
          </template>
          <el-button v-if="scope.row.status == '1'" type="text" size="mini" @click="offShelf(scope.row)">下架</el-button>
        </template>
      </hc-crud>
      <position-detail slot="form" :position-detail="positionDetail"></position-detail>
    </hc-table-form>
  </basic-container>
</template>

<script>
import { getPositionList, getPositionDetail, offShelf, audit } from "@/api/recruit/position"
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
            prop: 'name',
            search: true,
            maxlength: 50,
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
                return '招聘中'
              } else if (row.status == '2') {
                return '已关闭'
              } else if (row.status == '3') {
                if (row.auditStatus == '1') {
                  return '待审核'
                } else if (row.auditStatus == '3') {
                  return '审核未通过'
                } else if (row.auditStatus === '0') {
                  return '已下架'
                }
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
        menuWidth: 120
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
    },
    audit ({recruitPositionId}, sign) {
      let text = sign == 'pass' ? '上架' : '拒绝'
      this.$prompt(`${text}理由：`, text, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: `请输入${text}理由`,
        inputValidator: function (value) {
          if (value && value.length < 51) {
            return true
          } else if (!value) {
            return `${text}理由不能为空`
          } else {
            return `${text}理由不能超过50字`
          }
        },
      }).then(({ value }) => {
        audit({
          recruitPositionId,
          remarks: value,
          sign
        }).then(({ data }) => {
          this.$message.success(`${text}成功`)
          this.$refs.hcCrud.refresh()
        })
      }).catch(() => {
      });
    },
    offShelf ({recruitPositionId}) {
      this.$prompt('下架理由：', '下架', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '请输入下架理由',
        inputValidator: function (value) {
          if (value && value.length < 51) {
            return true
          } else if (!value) {
            return '下架理由不能为空'
          } else {
            return '下架理由不能超过50字'
          }
        },
      }).then(({ value }) => {
        offShelf({
          recruitPositionId,
          remarks: value
        }).then(({ data }) => {
          this.$message.success('下架成功')
          this.$refs.hcCrud.refresh()
        })
      }).catch(() => {
      });
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
