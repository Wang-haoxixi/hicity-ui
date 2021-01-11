<template>
  <avue-crud
    :option="option"
    :page="page"
    :table-loading="tableLoading"
    @on-load="getList"
    @search-change="searchChange"
    @refresh-change="refreshChange"
    v-bind="$attrs"
    v-on="$listeners" />
</template>

<script>
export default {
  name: 'HcCrud',
  props: {
    tableOption: {
      type: Object,
      required: true
    },
    tableData: {
      type: Array,
      required: true
    },
    formOption: {
      type: Object,
      default: () => null
    },
    page: {
      type: Object,
      default: () => {
        return {
          currentPage: 1,
          size: 10,
        }
      }
    }
  },
  data () {
    return {
      searchForm: {},
      tableLoading: false,
    }
  },
  methods: {
    getList () {
      this.$emit('get-list')
    },
    searchChange (form) {
      this.page = {
        
      }
      this.getList(form)   
    },
    refreshChange () {
      this.getList(this.page)
    },
  }
}
</script>

<style lang="" scoped>
</style>
