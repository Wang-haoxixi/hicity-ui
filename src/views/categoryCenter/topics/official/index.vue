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
      @row-update="handleUpdate"
      @row-save="handleCreate"
    >
      <template slot="menuLeft">
        <el-button
          class="filter-item"
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="toCreate"
          >添加
        </el-button>
      </template>
      <template slot="classifyIdForm" slot-scope="scope">
        <el-select v-model="scope.row.classifyId" clearable>
          <el-option v-for="item in classifyList" :key="item.id" :label="item.classifyName" :value="item.id"></el-option>
        </el-select>
      </template>
      <template slot="menu" slot-scope="scope">
        <template v-if="scope.row.operationAuthority == 1">
          <el-button type="text" size="mini" @click="toUpdate(scope.row)">编辑</el-button>
          <el-button type="text" size="mini" @click="toDelete(scope.row)">删除</el-button>
        </template>
        <template v-if="scope.row.confAuthority == 1">
          <el-button type="text" size="mini" @click="enableChange(scope.row)">{{scope.row.openOrClose ? '停用' : '启用'}}</el-button>
        </template>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { tableOption } from "./const";
import { mapGetters } from "vuex";
import {
  getClassifyList,
  getTopicList,
  addTopic,
  updateTopic,
  deleteTopic,
  setEnableState
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
      formData: {},
      tagList: [],
      allCity: [],
      classifyList: [],
    };
  },
  computed: {
    ...mapGetters(["permissions", "userInfo", "dicList"]),
    tableOption() {
      return tableOption(this.isAdmin);
    },
  },
  created() {
    getClassifyList({
      current: 1,
      size: 1000000
    }).then(({data}) => {
      this.classifyList = data.data.data.records
    })
  },
  watch: {},
  methods: {
    getList(page = this.page, params) {
      this.tableLoading = true;
      let form = {
        current: page.currentPage,
        size: page.pageSize,
        queryType: 0,
        isQuote: 1,
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
    toCreate() {
      this.$refs.crud.rowAdd()
    },
    handleCreate(row, done, loading) {
      let form = {
        topicsName: row.topicsName,
      }
      if (row.classifyId) {
        form.classifyId = row.classifyId
      }
      addTopic(form).then(({data}) => {
        this.page.current = 1
        this.getList(this.page)
        done()
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        loading()
      })
    },
    toUpdate(row) {
      this.$refs.crud.rowEdit(row, row.index)
    },
    handleUpdate(row, done, loading) {
      let form = {
        id: row.id,
        topicsName: row.topicsName,
      }
      if (row.classifyId) {
        form.classifyId = row.classifyId
      }
      updateTopic(form).then(({data}) => {
        this.getList(this.page)
        done()
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        loading()
      })
    },
    handleDraft() {},
    preview() {
      this.$refs.quill.getData()
      // console.log()
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
    enableChange (topic) {
      setEnableState({
        topicsBankId: topic.id,
        type: 1,
        state: topic.openOrClose ? 1 : 0
      }).then(({data}) => {
        this.$notify({
          title: "成功",
          message: "操作成功",
          type: "success",
          duration: 2000,
        });
        this.getList();
      })
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

