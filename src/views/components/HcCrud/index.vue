<template>
  <div class="hc-crud-container">
    <!-- 新建 -->
    <div v-if="optionC.header" class="hc-crud-header">
      <div class="menu-left">
        <el-button v-if="optionC.addBtn" type="primary" :size="optionC.headerSize" icon="el-icon-plus" @click="toCreate">新建</el-button>
        <slot name="menuLeft"></slot>
      </div>
      <div class="menu-right">
        <slot name="menuRight"></slot>
        <el-button v-if="optionC.refresh" icon="el-icon-refresh" circle :size="optionC.headerSize" @click="handleRefresh"></el-button>

        <hc-search-form ref="hcSearchForm" :searchs="searchList" style="margin-left: 10px" :search-show="optionC.search" @search="coverSearch">
          <template v-slot:basicSearch="scope">
            <slot name="basicSearch" :searchFun="scope.searchFun"></slot>
          </template>

          <template v-slot:seniorSearch="scope">
            <slot :searchFun="scope.searchFun" :searchList="scope.searchList"></slot>
          </template>
          <template v-slot:searchItems="scope">
            <slot name="searchItems" :search-form="scope.searchForm"></slot>
          </template>
          <template v-for="search in searchList" v-slot:[`${search.prop}SearchItem`]="scope">
            <slot :name="search.prop + 'SearchItem'" :searchForm="scope.searchForm" :prop="scope.prop">
            </slot>
          </template>
        </hc-search-form>
      </div>
    </div>
    <!-- 表格 -->
    <slot name="table" :table-data="tableData">
      <hc-crud-table
        :start-index="(page.currentPage - 1) * page.pageSize"
        :option="optionC"
        :tableData="tableData"
        :table-loading="tableLoading"
        @handle-event="handleEvent"
        @handle-auto-event="handleAutoEvent"
        @selection-change="selectionChange"
      >
        <template
          v-for="(item, index) in slotList"
          :slot="item.prop"
          slot-scope="scope"
        >
          <div :key="index">
            <slot v-if="item.dicName || item.dicData" :name="item.prop" :row="scope.row" :dic="getDic(item)" :label="getLabel(item, scope.row)"></slot>
            <slot v-else :name="item.prop" :row="scope.row"></slot>
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
    <!-- 分页 -->
    <slot v-if="!allShow" name="pagination">
      <div class="pagination-box">
        <el-pagination
          style="display: inline-block"
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page="page.currentPage"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          background
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
        >
        </el-pagination>
      </div>
    </slot>
    <slot name="form">
      <hc-crud-form
        ref="form"
        :option="optionC"
        :loading="formLoading"
        @handle-edit="handleUpdate"
        @handle-add="handleAdd"
      >
        <template
          v-for="(item, index) in formSlotList"
          :slot="`${item.prop}Form`"
          slot-scope="scope"
        >
          <div :key="`form__${index}`">
            <slot :name="`${item.prop}Form`" :form-data="scope.formData"></slot>
          </div>
        </template>
      </hc-crud-form>
    </slot>
  </div>
</template>

<script>
import HcFormItem from "./HcFormItem";
import HcCrudTable from "./HcCrudTable";
import HcCrudForm from "./HcCrudForm";
import { getDic } from '@/util/dic.js'
import HcSearchForm from "./HcSearchForm";
export default {
  name: "HcCrud",
  components: { HcFormItem, HcCrudTable, HcCrudForm, HcSearchForm },
  props: {
    option: {
      type: Object,
      default: () => {}
    },
    allShow: {
      type: Boolean,
      default: false
    },
    fetchListFun: {
      type: Function,
      default: () => null,
    },
    addFun: {
      type: Function,
      default: () => null,
    },
    updateFun: {
      type: Function,
      default: () => null,
    },
    deleteFun: {
      type: Function,
      default: () => null,
    },
    searchQuery: {
      type: Array,
      default: () => [],
    },
    autoLoad: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tableData: [],
      tableLoading: false,
      searchForm: {},
      formLoading: false,
      page: {
        currentPage: 1,
        pageSize: 10,
      },
      multipleSelection: []
    };
  },
  computed: {
    optionC () {
      return {
        header: true,
        headerSize: 'mini',
        refresh: true,
        ...this.option
      }
    },
    searchList() {
      if (this.searchQuery && this.searchQuery.length > 0) {
        let list = []
        for (let i = 0; i < this.searchQuery.length; i++) {
          list.push({
            search: true,
            ...this.searchQuery[i]
          })
        }
        return list;
      } else {
        let list = [];
        let columns = this.optionC.columns || [];
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].search) {
            list.push({
              type: 'text',
              ...columns[i]
            })
          }
        }
        return list;
      }
    },
    formSlotList() {
      let columns = this.optionC.columns || [];
      let slotList = [];
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].formSlot) {
          slotList.push(columns[i]);
        }
      }
      return slotList;
    },
    slotList() {
      let columns = this.optionC.columns || [];
      let slotList = [];
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].slot) {
          slotList.push(columns[i]);
        }
      }
      return slotList;
    },
    autoAdd() {
      if (this.optionC.menu && this.optionC.menu instanceof Array) {
        return this.optionC.menu.includes("add");
      }
    },
  },
  mounted() {
    if (this.autoLoad) {
      this.getList();
    }
  },
  methods: {
    getDic ({dicData, dicName}) {
      if (dicData) {
        return dicData
      } else if (dicName) {
        return getDic(dicName) || []
      }
      return []
    },
    getLabel (column, data) {
      let dicData = this.getDic(column)
      if (dicData && dicData.length > 0) {
        for (let i = 0; i < dicData.length; i++) {
          if (data[column.prop] == dicData[i].value) {
            return dicData[i].label
          }
        }
      }
      return ''
    },
    refresh(page = {}, searchForm = {}) {
      this.searchForm = {
        ...(this.searchForm || {}),
        ...searchForm,
      };
      this.page = {
        ...(this.page || {}),
        ...page,
      };
      return this.getList();
    },
    handleRefresh () {
      this.refresh()
    },
    getList() {
      return new Promise((resolve, reject) => {
        if (this.fetchListFun) {
          // 统一参数
          let params = {
            current: this.page.currentPage,
            size: this.page.pageSize,
            ...this.searchForm,
          };
          if (this.allShow) {
            params = { ...this.searchForm }
          }
          for (let key in params) {
            if (params[key] === undefined || params[key] === null || params[key] === '') {
              delete params[key]
            }
          }
          this.tableLoading = true;
          this.fetchListFun(params)
            .then(({ records, page }) => {
              if (records.length == 0 && page.total > 0 && this.page.currentPage > 1) {
                this.page.currentPage -= 1
                this.getList()
              } else {
                this.tableData = records;
                this.page = {
                  ...this.page,
                  ...page,
                };
              }
            })
            .finally(() => {
              resolve()
              this.tableLoading = false;
            });
        }
        resolve()
      })
    },
    // 每页数量改变
    sizeChange(size) {
      this.page.pageSize = size;
      this.page.currentPage = 1;
      this.getList();
    },
    // 页数改变
    currentChange(current) {
      this.page.currentPage = current;
      this.getList();
    },
    handleEvent({ fun, row }) {
      this.$emit(fun, row);
    },
    handleAutoEvent({ type, row }) {
      if (type == "view" || type == "edit") {
        // 查看 或 编辑
        this.$refs.form.open(row, type);
      } else if (type == "delete") {
        // 删除
        this.deleteFun && this.deleteFun(row, this.refresh);
      }
    },
    selectionChange (selection) {
      this.multipleSelection = selection
    },
    toCreate() {
      this.$refs.form.open();
    },
    rowAdd () {
      this.toCreate()
    },
    rowView (row = {}) {
      this.handleAutoEvent({type: 'view', row})
    },
    rowEdit (row = {}) {
      this.handleAutoEvent({type: 'edit', row})
    },
    rowDelete (row) {
      this.handleAutoEvent({type: 'delete', row})
    },
    handleAdd (row) {
      this.formLoading = true
      this.addFun(row, () => {
        this.formLoading = false
        this.$refs.form.close();
        this.refresh();
      }, () => {
        this.formLoading = false
      });
    },
    handleUpdate(row) {
      this.formLoading = true
      this.updateFun(row, () => {
        this.formLoading = false
        this.$refs.form.close();
        this.refresh();
      }, () => {
        this.formLoading = false
      });
    },
    resetSearch () {
      this.$refs.hcSearchForm && this.$refs.hcSearchForm.resetSearch(...arguments)
    },
    resetSearchItems () {
      this.$refs.hcSearchForm && this.$refs.hcSearchForm.resetSearchItems(...arguments)
    },
    coverSearch (searchForm = {}) {
      this.tableData = []
      this.searchForm = {
        ...searchForm
      }
      this.page.currentPage = 1
      this.page.total = 0
      this.getList();
    }
  },
};
</script>

<style lang="scss" scoped>
.hc-crud-container {
  .hc-crud-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    .menu-right {
      display: flex;
      align-items: center;
    }
  }
}

.search-box {
  display: flex;
  width: 100%;
  margin: -10px -20px 0 0;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  padding-bottom: 20px;
  .search-item {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    margin: 10px 20px 0 0;
  }
}

.pagination-box {
  padding: 10px 20px;
  margin: 15px 0 10px;
  text-align: right;
}
</style>
