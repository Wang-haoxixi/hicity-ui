<template>
  <div class="user">
    <avue-crud
      ref="crud"
      :option="tableOption"
      :page="page"
      :table-loading="tableLoading"
      :data="tableData"
      @on-load="getList"
      @refresh-change="handleRefreshChange"
    >
      <template slot="menu" slot-scope="scope">
        <!-- <el-button
          v-if="!isAdmin && scope.row.closeAllowed == '0'"
          type="text" size="mini"
          @click="handleStart(scope.row)">{{scope.row.havEnable ? '启用' : '停用'}}</el-button> -->
        <template>
          <el-button type="text" size="mini" @click="handleQuote(scope.row)"
            >引用至官方</el-button
          >
          <el-button type="text" size="mini" @click="toDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { tableOption } from "./const";
import {
  getTopicList,
  quoteTopic,
  deleteTopic
} from "@/api/cms/travel"

export default {
  data() {
    return {
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false, // 是否倒序
      },
      tableLoading: false,
      tableData: [],
    };
  },
  computed: {
    tableOption() {
      return tableOption();
    },
  },
  created() {
  },
  watch: {},
  methods: {
    getList(page = this.page, params) {
      this.tableLoading = true;
      let form = {
        current: page.currentPage,
        size: page.pageSize,
        queryType: 0,
        isQuote: 0,
      };
      getTopicList(form)
        .then(({ data }) => {
          this.tableData = data.data.data.records;
          this.page.total = data.data.data.total;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
  handleQuote({ id }) {
      this.$confirm("是否确认将该话题引用至官方?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        quoteTopic(id).then(({ data }) => {
          this.publish = false;
          this.$notify({
            title: "成功",
            message: "引用成功",
            type: "success",
            duration: 2000,
          });
          this.getList();
        });
      })
      .catch(function () {});
    },
    toDelete({ id }) {
      this.$confirm("是否确认删除该条话题?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        deleteTopic(id).then(({ data }) => {
          this.publish = false;
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000,
          });
          this.getList();
        });
      })
      .catch(function () {});
    },
    handleRefreshChange() {
      this.getList(this.page);
    },
  },
};
</script>
<style lang="scss" scope>
.user {
  height: 100%;

  &__tree {
    padding-top: 3px;
    padding-right: 20px;
  }

  &__main {
    .el-card__body {
      padding-top: 0;
    }
  }
}
.tag-list {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  .tag-list-item {
    margin-bottom: 10px;
    height: 30px;
    line-height: 30px;
    padding: 0 15px;
    border: 1px solid #e9e9e9;
    border-radius: 4px;
    margin-right: 20px;
  }
}

.form-title {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  .form-title-name {
    height: 60px;
    line-height: 60px;
    font-size: 20px;
  }
}
</style>

