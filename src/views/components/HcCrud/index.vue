<template>
  <div class="hc-crud-container">
    <!-- 搜索 -->
    <slot name="search">
      <div
        v-if="optionC.search || searchList && searchList.length > 0"
        class="search-box">
        <div
          v-for="(item, index) in searchList"
          :key="index"
          class="search-item">
          <div style="white-space: nowrap;">{{item.label + ':'}}</div>
          <hc-form-item
            style="margin-left: 10px;"
            v-model="searchFormShow[item.prop]"
            :option="item"
          ></hc-form-item>
        </div>
        <slot name="searchItems" :search-form="searchFormShow"></slot>
        <div class="search-item">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="toSearch"
            >搜 索</el-button
          >
          <el-button
            icon="el-icon-refresh"
            @click="resetSearch"
            >重 置</el-button
          >
        </div>
      </div>

      <!-- <el-form
        v-if="optionC.search || searchList && searchList.length > 0"
        class="search-box"
        style="width: 100%"
        label-width="auto"
        @submit.native.prevent="toSearch"
      >
        <el-form-item
          v-for="(item, index) in searchList"
          :key="index"
          class="search-item"
          :label="item.label + ':'"
          label-width="auto"
        >
          <hc-form-item
            v-model="searchFormShow[item.prop]"
            :option="item"
          ></hc-form-item>
        </el-form-item>
        <slot name="searchItems" :search-form="searchFormShow">
        </slot>
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
      </el-form> -->
    </slot>
    <!-- 新建 -->
    <div v-if="optionC.header" class="hc-crud-header">
      <div class="menu-left">
        <el-button v-if="optionC.addBtn" type="primary" :size="optionC.headerSize" icon="el-icon-plus" @click="toCreate">新建</el-button>
        <slot name="menuLeft"></slot>
      </div>
      <div class="menu-right">
        <slot name="menuRight"></slot>
        <el-button v-if="optionC.refresh" icon="el-icon-refresh" circle :size="optionC.headerSize" @click="handleRefresh"></el-button>
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
export default {
  name: "HcCrud",
  components: { HcFormItem, HcCrudTable, HcCrudForm },
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
      searchFormShow: {},
      formLoading: false,
      page: {
        currentPage: 1,
        pageSize: 10,
      },
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
        return this.searchQuery;
      } else {
        let list = [];
        let columns = this.optionC.columns || [];
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].search) {
            list.push({
              type: 'text',
              ...columns[i]
            })
            this.$set(this.searchFormShow, columns[i].prop, undefined)
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
    toSearch() {
      this.searchForm = {
        ...this.searchForm,
        ...this.searchFormShow
      }
      this.page.currentPage = 1
      this.getList();
    },
    resetSearch() {
      let searchFormShow = this.searchFormShow
      for (var key in searchFormShow) {
        searchFormShow[key] = undefined
      }
    },
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
