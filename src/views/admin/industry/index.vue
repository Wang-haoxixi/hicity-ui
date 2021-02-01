<template>
  <div>
    <basic-container>
      <avue-crud
        ref="crud"
        :option="tableOption"
        :page="page"
        :table-loading="tableLoading"
        :data="tableData"
        @on-load="getList"
        @refresh-change="handleRefreshChange" >
        <template slot="menuLeft">
          <el-button
            class="filter-item"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="toCreate">添加
          </el-button>
        </template>
        <template
          slot="menu"
          slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="toUpdate(scope.row,scope.index)">编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="toAddChild(scope.row,scope.index)">添加子级
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="toDelete(scope.row,scope.index)">删除
          </el-button>
        </template>
        </avue-crud>
    </basic-container>
    <dialog-form ref="DialogForm" @load-page="getList"></dialog-form>
  </div>
</template>
<script>
import { tableOption, initForm } from './const'
import DialogForm from "./DialogForm.vue";
import {
  getIndustryTree,
  delIndustryById,
} from "@/api/admin/industry";
import { customTree } from "@/util/util";
export default {
  components: {
    DialogForm,
  },
  data() {
    return {
      tableOption: tableOption(),
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false// 是否倒序
      },
      tableData: [],
      tableLoading: false,
    };
  },
  methods: {
    getList(page = this.page, params) {
      this.tableLoading = true
      getIndustryTree(Object.assign({
        current: page.currentPage,
        size: page.pageSize
      }, params, this.searchForm)).then(response => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      }).finally(() => {
        this.tableLoading = false
      })
    },
    handleFilter(param) {
      this.searchForm = param
      this.getList(this.page, param)
    },
    handleRefreshChange() {
      this.getList(this.page)
    },
    toCreate () {
      this.$refs.DialogForm.open(customTree(this.tableData, { label: "name", value: "id" }))
    },
    toUpdate (row) {
      this.$refs.DialogForm.open(customTree(this.tableData, { label: "name", value: "id" }), row, true)
    },
    toAddChild (row) {
      this.$refs.DialogForm.open(customTree(this.tableData, { label: "name", value: "id" }), {parentId: row.id}, false, true)
    },
    toDelete (row) {
      this.$confirm('是否确认删除该条数据?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delIndustryById(row.id)
      }).then(() => {
        this.getList()
        this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
      }).catch(function() {
      })
    }
  },
};
</script>
