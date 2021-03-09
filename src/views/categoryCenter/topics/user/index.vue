<template>
  <hc-crud ref="hcCrud" :option="tableOption" :fetchListFun="fetchListFun">
    <template slot="menu" slot-scope="scope">
      <el-button type="text" size="mini" @click="handleQuote(scope.row)">引用至官方</el-button>
      <el-button type="text" size="mini" @click="toDelete(scope.row)">删除</el-button>
    </template>
  </hc-crud>
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
    };
  },
  computed: {
    tableOption() {
      return tableOption();
    },
  },
  methods: {
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        getTopicList({
          ...params,
          queryType: 0,
          isQuote: 0,
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
    handleQuote({ id }) {
      this.$confirm("是否确认将该话题引用至官方?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        quoteTopic(id).then(({ data }) => {
          this.publish = false;
          this.$notify({
            title: "成功",
            message: "引用成功",
            type: "success",
            duration: 2000,
          });
          this.$refs.hcCrud.refresh()
        });
      }).catch(function () {});
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
          this.$refs.hcCrud.refresh()
        });
      }).catch(function () {});
    },
  },
};
</script>
<style lang="scss" scope>
</style>

