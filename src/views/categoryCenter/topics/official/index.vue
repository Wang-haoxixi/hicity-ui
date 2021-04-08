<template>
  <hc-crud ref="hcCrud" :option="tableOption" :fetchListFun="fetchListFun" :addFun="addFun" :updateFun="updateFun" :deleteFun="deleteFun">
    <template v-slot:classifyIdForm="scope">
      <el-select v-model="scope.formData.classifyId" clearable>
        <el-option v-for="item in classifyList" :key="item.id" :label="item.classifyName" :value="item.id"></el-option>
      </el-select>
    </template>
    <template slot="menu" slot-scope="scope">
      <template v-if="scope.row.confAuthority == 1">
        <el-button type="text" size="mini" @click="enableChange(scope.row)">{{scope.row.openOrClose ? '停用' : '启用'}}</el-button>
      </template>
    </template>
  </hc-crud>
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
      tagList: [],
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
  methods: {
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        getTopicList({
          ...params,
          queryType: 0,
          isQuote: 1,
        }).then(({ data }) => {
          resolve({
            records: data.data.data.records,
            page: {
              total: data.data.data.total
            }
          })
        }, error => reject(error))
      })
    },
    addFun(row, done, loading) {
      let form = {
        topicsName: row.topicsName,
      }
      if (row.classifyId) {
        form.classifyId = row.classifyId
      }
      addTopic(form).then(({data}) => {
        done()
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      }).finally(() => {
        loading()
      })
    },
    updateFun(row, done, loading) {
      let form = {
        id: row.id,
        topicsName: row.topicsName,
      }
      if (row.classifyId) {
        form.classifyId = row.classifyId
      }
      updateTopic(form).then(({data}) => {
        done()
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      }).finally(() => {
        loading()
      })
    },
    deleteFun({ id }) {
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
            this.$refs.hcCrud.refresh()
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
        this.$refs.hcCrud.refresh()
      })
    },
  },
};
</script>
<style lang="scss" scoped>
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
</style>

