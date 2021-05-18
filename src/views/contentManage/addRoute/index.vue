<template>
  <basic-container>
    <div class="title">广告路径管理</div>
    <!-- <div class="search-box">
      <label>名称:</label>
      <el-input placeholder="请输入内容"></el-input>
      <el-button type="primary" icon="el-icon-search">搜索</el-button>
      <el-button icon="el-icon-refresh">重置</el-button>
    </div> -->
    <el-button icon="el-icon-plus" size="mini" type="primary" @click="handleAdd"
      >新增</el-button
    >
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="跳转对象ID" width="100">
      </el-table-column>
      <el-table-column prop="type" label="跳转对象名称" width="250">
      </el-table-column>
      <el-table-column prop="url" label="跳转路径"> </el-table-column>
      <el-table-column prop="code" label="标识" width="180"> </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button size="mini" type="text" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right; padding-top: 20px">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.current"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="query.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <el-dialog
      title="新增广告路径"
      :visible.sync="dialogVisibleAddPath"
      width="50%"
    >
      <div>
        <el-form
          ref="addFormRef"
          :rules="addFormRules"
          :model="addForm"
          label-width="100px"
        >
          <el-form-item label="类型名称：" prop="type">
            <el-input v-model="addForm.type"></el-input>
          </el-form-item>
          <el-form-item label="编码：" prop="code">
            <el-input v-model="addForm.code"></el-input>
          </el-form-item>
          <el-form-item label="跳转路径：" prop="url">
            <el-input v-model="addForm.url"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAddPath = false">取 消</el-button>
        <el-button type="primary" @click="save_add">新 增</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑广告路径"
      :visible.sync="dialogVisibleEditPath"
      width="50%"
      @close="handleCloseDialogVisibleEditPath"
    >
      <div>
        <el-form
          ref="editFormRef"
          :rules="editFormRules"
          :model="editForm"
          label-width="100px"
        >
          <el-form-item label="类型名称：" prop="type">
            <el-input v-model="editForm.type"></el-input>
          </el-form-item>
          <el-form-item label="编码：" prop="code">
            <el-input v-model="editForm.code"></el-input>
          </el-form-item>
          <el-form-item label="跳转路径：" prop="url">
            <el-input v-model="editForm.url"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEditPath = false">取 消</el-button>
        <el-button type="primary" @click="save_edit">保 存</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  adPathPage,
  adPathDetail,
  adPathDelete,
  adPathAdd,
  adPathUpdate,
} from "@/api/content/adRouteManage.js";
export default {
  data() {
    return {
      addForm: {
        url: "",
        type: "",
        code: "",
      },
      tableData: [],
      dialogVisibleAddPath: false,
      dialogVisibleEditPath: false,
      addFormRules: {
        url: [
          { required: true, message: "请输入跳转路径", trigger: "blur" },
          { max: 100, message: "长度在 100 个字符内", trigger: "blur" },
        ],
        type: [
          { required: true, message: "请输入类型名称", trigger: "blur" },
          { max: 20, message: "长度在 20 个字符内", trigger: "blur" },
        ],
        code: [
          { required: true, message: "请输入编码", trigger: "blur" },
          { max: 20, message: "长度在 20 个字符内", trigger: "blur" },
        ],
      },
      editForm: {
        url: "",
        type: "",
        code: "",
      },
      editFormRules: {
        url: [
          { required: true, message: "请输入跳转路径", trigger: "blur" },
          { max: 100, message: "长度在 100 个字符内", trigger: "blur" },
        ],
        type: [
          { required: true, message: "请输入类型名称", trigger: "blur" },
          { max: 20, message: "长度在 20 个字符内", trigger: "blur" },
        ],
        code: [
          { required: true, message: "请输入编码", trigger: "blur" },
          { max: 20, message: "长度在 20 个字符内", trigger: "blur" },
        ],
      },
      query: {
        current: 1,
        size: 10,
      },
      total: 0,
    };
  },
  methods: {
    adPathPageFn() {
      adPathPage(this.query).then((res) => {
        this.tableData = res.data.data.data.records;
        this.total = res.data.data.data.total;
      });
    },
    getAdPathDetail(id) {
      adPathDetail(id).then((res) => {
        this.editForm = res.data.data.data;
      });
    },
    handleAdd() {
      this.dialogVisibleAddPath = true;
    },
    handleEdit(row) {
      this.dialogVisibleEditPath = true;
      this.getAdPathDetail(row.id);
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该广告路径, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          adPathDelete(row.id).then((res) => {
            if (res.data.data.businessCode == 1000) {
              this.$message.success("删除成功");
              this.adPathPageFn();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    save_add() {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          adPathAdd(this.addForm).then((res) => {
            if (res.data.data.businessCode == 1000) {
              this.$message.success("新增成功");
              this.dialogVisibleAddPath = false;
              this.adPathPageFn();
              this.addForm = {
                url: "",
                type: "",
                code: "",
              };
            }
          });
        }
      });
    },
    handleCloseDialogVisibleEditPath() {
      this.editForm = {
        url: "",
        type: "",
        code: "",
      };
    },
    save_edit() {
      this.$refs.editFormRef.validate((valid) => {
        if (valid) {
          adPathUpdate(this.editForm).then((res) => {
            if (res.data.data.businessCode == 1000) {
              this.$message.success("编辑成功");
              this.dialogVisibleEditPath = false;
              this.adPathPageFn();
            }
          });
        }
      });
    },
    handleSizeChange(val) {
      this.query.size = val;
      this.adPathPageFn();
    },
    handleCurrentChange(val) {
      this.query.current = val;
      this.adPathPageFn();
    },
  },
  created() {
    this.adPathPageFn();
  },
};
</script>

<style lang="scss" scoped>
.title {
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  color: #000000;
  padding-bottom: 20px;
}
.search-box {
  padding-bottom: 20px;
  display: flex;
  align-items: center;
  .el-input {
    width: 200px;
    margin: 0 20px 0 10px;
  }
}
</style>