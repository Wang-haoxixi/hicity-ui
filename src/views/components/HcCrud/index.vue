<template>
  <div class="hc-crud-container">
    <!-- 搜索 -->
    <slot name="search">
      <el-form
        v-if="optionC.search || searchList && searchList.length > 0"
        class="search-box"
        label-width="auto"
        style="width: 100%"
      >
        <slot name="searchItems" :search-form="searchFormShow">
          <el-form-item
            v-for="(item, index) in searchList"
            :key="index"
            class="search-item"
            :label="item.label + ':'"
          >
            <hc-form-item
              v-model="searchFormShow[item.prop]"
              :option="item"
            ></hc-form-item>
          </el-form-item>
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
      </el-form>
    </slot>
    <!-- 新建 -->
    <div v-if="optionC.header || autoAdd" class="hc-crud-header">
      <div class="menu-left">
        <el-button v-if="autoAdd" type="primary" size="mini" icon="el-icon-plus" @click="toCreate">新建</el-button>
        <template v-else>
          <slot  name="menuLeft"></slot>
        </template>
      </div>
      <div v-if="optionC.header" class="menu-right">
        <slot name="menuRight"></slot>
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
    <!-- 分页 -->
    <slot name="pagination">
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
export default {
  name: "HcCrud",
  components: { HcFormItem, HcCrudTable, HcCrudForm },
  props: {
    option: {
      type: Object,
      default: () => {}
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
  },
  data() {
    return {
      tableData: [],
      tableLoading: false,
      searchForm: {},
      searchFormShow: {},
      page: {
        currentPage: 1,
        pageSize: 10,
      },
    };
  },
  computed: {
    optionC () {
      return {
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
            this.$set(this.searchFormShow, columns[i].prop, '')
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
    this.getList();
  },
  methods: {
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
    getList() {
      return new Promise((resolve, reject) => {
        if (this.fetchListFun) {
          // 统一参数
          let params = {
            current: this.page.currentPage,
            size: this.page.pageSize,
            ...this.searchForm,
          };
          this.tableLoading = true;
          this.fetchListFun(params)
            .then(({ records, page }) => {
              this.tableData = records;
              this.page = {
                ...this.page,
                ...page,
              };
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
      this.addFun(row, () => {
        this.$refs.form.close();
        this.refresh();
      });
    },
    handleUpdate(row) {
      this.updateFun(row, () => {
        this.$refs.form.close();
        this.refresh();
      });
    },
    toSearch() {
      this.searchForm = this.searchFormShow;
      this.page.currentPage = 1
      this.getList();
    },
    resetSearch() {
      this.searchFormShow = {};
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
