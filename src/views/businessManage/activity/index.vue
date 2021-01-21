<template>
  <basic-container>
    <div class="title">活动发布</div>

    <el-button @click="addCreate" type="primary" class="el-icon-plus">
      新增</el-button
    >

    <el-table :data="tableData" style="width: 100%">
      <!-- 展开列 -->
      <el-table-column type="expand">
        人员管理 票务管理 发布时间： 2020-12-29 10:39发布者：超级管理员1•能者
      </el-table-column>
      <!-- 其他列表页 -->
      <el-table-column prop="cover" label="活动封面"> </el-table-column>
      <el-table-column prop="msg" label="活动信息"> </el-table-column>
      <el-table-column prop="activeState" label="活动状态"> </el-table-column>
      <el-table-column prop="auditStatus" label="审核状态"> </el-table-column>
      <el-table-column prop="peopleNum" label="参与人数"> </el-table-column>
      <el-table-column prop="isInvite" label="邀请成员进SO"> </el-table-column>
      <el-table-column prop="cover" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 5, 10, 15]"
      :page-size="pageSize"
      :total="total"
      class="paging"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </basic-container>
</template>

<script>

export default {
  
  data() {
    return {
      tableData: [
        {
          cover: "活动封面",
          msg: "活动信息",
          activeState: "草稿",
          auditStatus: "已通过",
          peopleNum: "2",
          isInvite: "是",
        },
        {
          cover: "活动封面",
          msg: "活动信息",
          activeState: "草稿",
          auditStatus: "已通过",
          peopleNum: "2",
          isInvite: "是",
        },
      ],
      currentPage: 1,
      pageSize: 5,
      total: 30,
    };
  },
  methods: {
    // 编辑
    handleEdit(res) {
      console.log("编辑", res);
    },
    // 删除
    handleDelete() {
      console.log("删除", res);
    },
    handleSizeChange(val) {},
    handleCurrentChange(val) {},
    // 新增
    addCreate() {
      this.$router.push("/publish");
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  padding-bottom: 5px;
  font-size: 18px;
  font-weight: 400;
}
.paging {
  margin-top: 20px;
  text-align: right;
}
</style>
