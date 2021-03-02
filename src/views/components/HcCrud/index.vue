<template>
  <div class="hc-crud-container">
    <slot name="search">
      <el-form v-if="searchList && searchList.length > 0" class="search-box" label-width="auto" style="width: 100%">
        <el-form-item v-for="(item, index) in searchList" :key="index"
          class="search-item"
          :label="item.label">
          <hc-form-item v-model="searchFormShow[item.prop]" :option="item"></hc-form-item>
        </el-form-item>
        <el-form-item>
          <el-button  class="search-item" type="primary" icon="el-icon-search" @click="toSearch">搜 索</el-button>
          <el-button  class="search-item" icon="el-icon-refresh" @click="resetSearch">重 置</el-button>
        </el-form-item>
      </el-form>
    </slot>
    <div v-if="option.header" class="hc-crud-header">
      <slot name="menuLeft"></slot>
      <slot name="menuRight"></slot>
    </div>
    <slot name="table">
      <hc-crud-table
        :option="option"
        :tableData="tableData"
        :table-loading="tableLoading"
        @handle-event="handleEvent">
        <template v-for="(item, index) in slotList" :slot="item.prop" slot-scope="scope">
          <div :key="index">
            <slot :name="item.prop" :row="scope.row"></slot>
          </div>
        </template>
        <template v-slot:menu="scope">
          <slot name="menu" :row="scope.row"></slot>
        </template>
        <template v-slot:expand="scope">
          <slot name="expand" :row="scope.row"></slot>
        </template>
      </hc-crud-table>
    </slot>
    <slot name="pagination">
      <div class="pagination-box">
        <el-pagination
          style="display: inline-block"
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page="page.currentPage"
          :page-sizes="[10, 20, 30,, 40, 50, 100]"
          background
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total">
        </el-pagination>
      </div>
    </slot>
  </div>
</template>

<script>
import HcFormItem from './HcFormItem'
import HcCrudTable from './HcCrudTable'
export default {
  name: 'HcCrud',
  components: { HcFormItem, HcCrudTable },
  props: {
    option: {
      type: Object,
      required: true
    },
    fetchListFun: {
      type: Function,
      required: true
    },
    searchQuery: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      tableData: [],
      tableLoading: false,
      searchForm: {},
      searchFormShow: {},
      page: {
        currentPage: 1,
        pageSize: 10,
      },
    }
  },
  computed: {
    searchList () {
      if (this.searchQuery && this.searchQuery.length > 0) {
        return this.searchQuery
      } else {
        let list = []
        let columns = this.option.columns || []
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].search) {
            list.push({
              prop: columns[i].prop,
              type: columns[i].type || 'text',
              label: columns[i].label,
              dicName: columns[i].dicName
            })
            this.$set(this.searchFormShow, columns[i].prop, '')
          }
        }
        return list
      }
    },
    slotList () {
      let columns = this.option.columns || []
      let slotList = []
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].slot) {
          slotList.push(columns[i])
        }
      }
      return slotList
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    refresh (initPage = false) {
      if (initPage) {
        this.page = {
          currentPage: 1,
          pageSize: 10,
        }
      }
      this.getList()
    },
    getList () {
      // 统一参数
      let params = {
        current: this.page.currentPage,
        size: this.page.pageSize,
        ...this.searchForm
      }
      this.tableLoading = true
      this.fetchListFun(params).then(({records, page}) => {
        this.tableData = records
        this.page = {
          ...page,
          ...this.page
        }
      }).finally(() => {
        this.tableLoading = false
      })
    },
    // 每页数量改变
    sizeChange (size) {
      this.page.pageSize = size
      this.page.currentPage = 1
      this.getList()
    },
    // 页数改变
    currentChange (current) {
      this.page.currentPage = current
      this.getList()
    },
    handleEvent ({fun, row}) {
      this.$emit(fun, row)
    },
    toSearch () {
      this.searchForm = this.searchFormShow
      this.page = {
        currentPage: 1,
        pageSize: 10,
      }
      this.getList()
    },
    resetSearch () {
      this.searchFormShow = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.hc-crud-container {
  .hc-crud-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
  }
}

.search-box {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  margin: -10px 0 0 -20px;
  .search-item {
    margin: 10px 0 0 20px;
  }
}

.pagination-box {
  padding: 10px 20px;
  margin: 15px 0 10px;
  text-align: right;
}
</style>
