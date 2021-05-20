<template>
  <el-dialog
    title="账户明细"
    :visible.sync="dialogVisible"
    width="70%"
    append-to-body
    :before-close="dialogBeforeClose">
    <hc-crud :option="tableOption" :fetchListFun="fetchListFun" ref="hcCrud" :auto-load="false">
    </hc-crud>
    <div slot="footer">
      <el-button @click="dialogVisible = false">返 回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  officialReleaseList
} from "@/api/activity/publish";
export default {
  data () {
    return {
      dialogVisible: false,
      tableOption: {
        columns: [
          {
            label: '交易日期',
            prop: 'createTime',
          },
          {
            label: '交易类型',
            prop: 'storeName',
          },
          {
            label: '交易金额',
            prop: 'storeName',
          },
          {
            label: '账户余额',
            prop: 'storeName',
          }
        ],
        menu: true,
        menuWidth: '60px',
        header: false,
      },
    }
  },
  methods: {
    open () {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.hcCrud.resetSearch()
        this.$refs.hcCrud.toSearch()
      })
    },
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        officialReleaseList(params).then(({data})=>{
          resolve({
            records: data.data.data.records,
            page: {
              total: data.data.data.total
            }
          })
        })
      })
    },
    close () {
      this.dialogVisible = false
    },
    dialogBeforeClose (next) {
      next()
    }
  }
}
</script>

<style lang="" scoped>
</style>
