<template>
  <basic-container>
    <hc-table-form title="积分流水">
      <hc-crud :fetchListFun="fetchListFun" :option="tableOption"></hc-crud>
    </hc-table-form>
  </basic-container>
</template>

<script>
import { cowryFlowPage } from "@/api/cityCurrency/cowryFlow"
export default {
  data () {
    return {
      tableOption: {
        columns: [
          {
            label: '流水号',
            prop: 'flowId'
          },
          {
            label: '主题',
            prop: 'remarks'
          },
          {
            label: '类型',
            prop: 'type',
            type: 'select',
            dicData: [
              {
                label: '收入',
                value: 0
              },
              {
                label: '支出',
                value: 1
              }
            ]
          },
          {
            label: '城贝数量',
            prop: 'amount'
          },
          {
            label: '用户名',
            prop: 'userName'
          },
          {
            label: '日期',
            prop: 'createTime'
          }
        ]
      }
    }
  },
  methods: {
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        cowryFlowPage(params)
        .then(({ data }) => {
          resolve({
            records: data.data.data.records,
            page: {
              total: data.data.data.total
            }
          })
        }, error => {
          reject(error)
        })
      })

      
    }
  }
}
</script>

<style lang="" scoped>
</style>
