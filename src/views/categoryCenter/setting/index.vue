<template>
  <basic-container>
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :table-loading="tableLoading"
      :option="tableOption"
      :permission="permissionList"
      @on-load="getList"
      @search-change="searchChange"
      @refresh-change="refreshChange"
      @row-del="handleDel"/>
  </basic-container>
</template>

<script>
import devPage from '@/views/devPage/index'
export default {
  components: {
    devPage
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="" scoped>
</style>
