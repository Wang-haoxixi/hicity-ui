<template>
  <basic-container>
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :table-loading="tableLoading"
      :option="tableOption"
      @on-load="getList"
      @search-change="searchChange"
      @refresh-change="refreshChange">
      <template slot="menu" slot-scope="scope">
        <el-button
          type="text"
          size="mini"
          icon="el-icon-edit"
          @click="handleUpdate(scope.row,scope.index)">编辑
        </el-button>
        <el-button
          v-if="userInfo.userType != 3 && userInfo.userType != 4 && scope.row.editable"
          type="text"
          size="mini"
          icon="el-icon-edit"
          @click="handleUpdate(scope.row,scope.index)">{{scope.row.isopen ? '停用' : '启用'}}
        </el-button>
        <el-button
          v-if="scope.row.editable && ((userInfo.userType == 3 || userInfo.userType == 4) || !scope.row.isPlatform)"
          type="text"
          size="mini"
          icon="el-icon-delete"
          @click="handleDel(scope.row,scope.index)">删除
        </el-button>
      </template>
      <template v-slot:city="scope">
        <el-button
          type="text"
          size="mini"
          icon="el-icon-delete"
          @click="cityView(scope.row,scope.index)">产看
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getTagList } from '@/api/tms/city'
import { tableOption } from './const'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      tableLoading: false,
      tableData: [],
      page: {
        currentPage: 1,
        pageSize: 20,
      },
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    tableOption () {
      console.log(this.userInfo)
      return tableOption(this.userInfo.userType == 4 || this.userInfo.userType == 3)
    }
  },
  methods: {
    getList (page = this.page) {
      this.tableLoading = true
      getTagList({
        current: page.currentPage,
        size: page.pageSize,
        ...this.searchForm,
      }).then(({data}) => {
        if (data.code === 0) {
          console.log(data.data.data.records)
          this.tableData = data.data.data.records
        }
        console.log(data)
      }).finally(() => {
        this.tableLoading = false
      })
    },
    handleUpdate (row, index) {
      this.$refs.crud.rowEdit(row, index)
    },
    handleDel () {

    },
    cityView (row) {
      console.log(row.tagId)
    },
    searchChange (form) {
      this.page = {
        currentPage: 1,
        pageSize: 20,
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
