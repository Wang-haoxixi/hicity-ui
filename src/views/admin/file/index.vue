<template>
  <div class="execution">
    <basic-container>
      <el-form class="search-box" inline :model="tempSearch" @submit.native.prevent="toSearch">
        <div class="serach-box-left">
          <el-form-item label="文件名：">
            <el-input v-model="tempSearch.fileName" maxlength="50" placeholder="请输入文件名" clearable></el-input>
          </el-form-item>
          <el-form-item>
          <el-button
            class="search-item"
            type="primary"
            icon="el-icon-search"
            @click="toSearch"
            >搜 索</el-button
          >
          <el-button
            class="search-item"
            icon="el-icon-refresh"
            @click="resetSearch"
            >重 置</el-button
          >
        </el-form-item>
        </div>
      </el-form>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        @on-load="getList"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @row-del="rowDel">
        <template
          slot="menu"
          slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-download"
            @click="download(scope.row,scope.index)">下载
          </el-button>
        </template>

      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { delObj, fetchList } from '@/api/admin/sys-file'
import { tableOption } from '@/const/crud/admin/sys-file'
import { mapGetters } from 'vuex'
import { handleDown } from '@/util/util'


export default {
  name: 'sys_file',
  data() {
    return {
      tempSearch: {},
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption
    }
  },
  created() {
  },
  mounted: function() {
  },
  computed: {
    ...mapGetters(['permissions']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.sys_file_add, false),
        delBtn: this.vaildData(this.permissions.sys_file_del, true),
        editBtn: this.vaildData(this.permissions.sys_file_edit, false)
      }
    }
  },
  methods: {
    getList(page, params) {
      this.tableLoading = true
      fetchList(Object.assign({
        descs: 'create_time',
        current: page.currentPage,
        size: page.pageSize
      }, params, this.searchForm)).then(response => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    rowDel: function(row, index) {
      var _this = this
      this.$confirm('是否确认删除ID为' + row.id, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delObj(row.id)
      }).then(data => {
        _this.tableData.splice(index, 1)
        _this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
        this.getList(this.page)
      })
    },
    /**
       * 搜索回调
       */
    searchChange(form) {
      this.getList(this.page, form)
    },
    toSearch () {
      this.searchForm = this.tempSearch
      this.getList(this.page)
    },
    resetSearch () {
      this.searchForm = {
        fileName: undefined,
      }
      this.tempSearch = {
        fileName: undefined,
      }
    },
    /**
       * 刷新回调
       */
    refreshChange() {
      this.getList(this.page)
    },
    download: function(row, index) {
      handleDown(row.fileName, row.bucketName)
    }
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
}
</style>

