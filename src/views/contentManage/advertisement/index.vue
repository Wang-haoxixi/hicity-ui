<template>
  <div>
    <basic-container>
      <div class="title">广告位管理</div>
      <!-- 新增按钮 -->
      <el-button
        @click="dialogFormVisible = true"
        type="primary"
        class="el-icon-plus"
      >
        新增</el-button
      >

      <!-- 广告位新增弹窗 -->
      <el-dialog
        title="广告位新增"
        :visible.sync="dialogFormVisible"
        @close="dialogFormVisibleClose"
      >
        <el-form :model="form" :rules="rules" ref="ruleForm">
          <!-- 城市 -->
          <el-form-item
            label="城市 :"
            prop="cityId"
            :label-width="formLabelWidth"
          >
            <el-select
              v-model="form.cityId"
              placeholder="请选择城市"
              filterable
              @change="valChange"
            >
              <el-option
                v-for="(item, index) in cityGroup"
                :key="index"
                :label="item.regionName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 广告位名称 -->
          <el-form-item
            label="广告位名称 :"
            prop="adslotName"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.adslotName" autocomplete="off"></el-input>
          </el-form-item>
          <!-- 广告位编码 -->
          <el-form-item
            label="广告位编码 :"
            prop="adslotNumber"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.adslotNumber" autocomplete="off"></el-input>
          </el-form-item>
          <!-- 广告位描述 -->
          <el-form-item
            label="广告位描述 :"
            prop="adslotDescription"
            :label-width="formLabelWidth"
          >
            <el-input
              type="textarea"
              v-model="form.adslotDescription"
            ></el-input>
          </el-form-item>
          <!-- 类型 -->
          <el-form-item
            label="类型 :"
            prop="type"
            :label-width="formLabelWidth"
          >
            <el-radio-group v-model="form.type">
              <el-radio :label="1">文字</el-radio>
              <el-radio :label="2">图片</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 广告位编辑 -->
      <el-dialog title="广告位编辑" :visible.sync="dialogEditFormVisible">
        <el-form :model="editForm" :rules="rules" ref="ruleEditForm">
          <el-form-item
            label="城市 :"
            prop="cityId"
            :label-width="formLabelWidth"
          >
            <el-select
              v-model="editForm.cityId"
              placeholder="请选择城市"
              @change="valChange"
              filterable
            >
              <el-option
                v-for="(item, index) in cityGroup"
                :key="index"
                :label="item.regionName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="广告位名称 :"
            prop="adslotName"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="editForm.adslotName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="广告位编码 :"
            prop="adslotNumber"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="editForm.adslotNumber"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="广告位描述 :"
            prop="adslotDescription"
            :label-width="formLabelWidth"
          >
            <el-input
              type="textarea"
              v-model="editForm.adslotDescription"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="类型 :"
            prop="type"
            :label-width="formLabelWidth"
          >
            <el-radio-group v-model="editForm.type">
              <el-radio :label="1">文字</el-radio>
              <el-radio :label="2">图片</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editSubmit">确 定</el-button>
        </div>
      </el-dialog>

      <el-table
        :data="tableData"
        border
        stripe
        :header-cell-style="{ background: '#FAFAFA' }"
        style="width: 100%;margin-top:10px"
        ref="multipleTable"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          prop="adslotId"
          label="广告位id"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="adslotName"
          label="广告位名称"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="adslotDescription"
          label="广告位描述"
        ></el-table-column>
        <el-table-column
          prop="adslotNumber"
          label="广告位编码"
        ></el-table-column>
        <el-table-column prop="cityName" label="城市"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.authority" size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="pageSize"
        :total="total"
        class="paging"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </basic-container>
  </div>
</template>

<script>
import {
  citys,
  addAdPosition,
  adPosition,
  editPlace,
  delAdP,
} from "@/api/content/ad-position";
export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false, //广告位新增弹窗
      dialogEditFormVisible: false, //广告位编辑弹窗
      //新增表单数据
      form: {
        cityId: "",
        adslotName: "",
        adslotNumber: "",
        adslotDescription: "",
        type: "",
      },
      // 编辑广告位表单
      editForm: {
        cityId: "",
        adslotName: "",
        adslotNumber: "",
        adslotDescription: "",
        type: "",
      },
      formLabelWidth: "120px",
      rules: {
        cityId: [{ required: true, message: "请选择", trigger: "change" }],
        adslotName: [
          { required: true, message: "请输入广告位名称", trigger: "blur" },
          { min: 1, message: "请输入", trigger: "blur" },
        ],
        adslotNumber: [
          { required: true, message: "请输入广告位编码", trigger: "blur" },
          { min: 1, message: "请输入", trigger: "blur" },
        ],
        adslotDescription: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择", trigger: "change" }],
      },

      currentPage: 1,
      pageSize: 10,
      total: 0,
      cityGroup: [], //城市数组
    };
  },
  methods: {
    // 广告位弹窗关闭时触发
    dialogFormVisibleClose() {
      // 重置表单
      this.$refs.ruleForm.resetFields();
    },

    // 选中值发生变化时触发
    valChange(e) {
      this.form.cityId = e;
    },

    // 分页查询广告位
    getList() {
      adPosition({
        current: this.currentPage, //当前页
        size: this.pageSize, //条数
      }).then((res) => {
        console.log("广告位分页", res);
        this.total = res.data.data.data.total;
        let records = res.data.data.data.records;
        this.tableData = records;
      });
    },

    // 获取城市
    getCitys() {
      citys(this.form.cityId).then((res) => {
        this.cityGroup = res.data.data.data;
      });
    },

    handleEdit(row) {
      this.dialogEditFormVisible = true;
      this.editForm = { ...row };
      console.log(this.editForm);
    },

    handleDelete(row) {
      this.$confirm("确定删除广告位?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delAdP(row.adslotId).then((res) => {
            if (res.data.code !== 0) {
              return this.$message.error("广告位删除失败！");
            }
            this.$message({
              message: "广告位删除成功！",
              type: "success",
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message("您已取消删除该广告位！");
        });
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },

    // 广告位新增 提交
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.form);
          // 添加广告位
          addAdPosition(this.form).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                message: "新增广告位成功！",
                type: "success",
              });
              this.dialogFormVisible = false;
              this.getList();
            } else {
              this.$message.error("新增广告位失败!");
            }
          });
        } else {
          this.$message.error("请填写必填信息！");
        }
      });
    },
    // 广告位编辑 提交编辑
    editSubmit() {
      this.$refs.ruleEditForm.validate((valid) => {
        if (valid) {
          console.log("修改", this.editForm);
          editPlace(this.editForm).then((res) => {
            if (res.data.code === 0) {
              this.dialogEditFormVisible = false;
              this.$message({
                message: "编辑广告位成功！",
                type: "success",
              });
              this.getList();
            } else {
              this.$message.error("编辑广告位失败！");
            }
          });
        }
      });
    },
  },
  created() {
    this.getCitys();
    this.getList();
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
