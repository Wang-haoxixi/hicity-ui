<template>
  <basic-container>
    <hc-table-form title="广告位管理">
      <div class="add-inp-more">
        <el-button
          @click="dialogFormVisible = true"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          >新建</el-button
        >

        <div class="inp-more">
          <!-- <el-input
            clearable
            size="mini"
            class="inp"
            v-model="input"
            placeholder="请输入广告位名称"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input> -->
          <el-button
            icon="el-icon-more"
            class="more"
            @click="dialogOpenMoreVisible = true"
          ></el-button>
          <el-dialog
            title="多 选"
            :visible.sync="dialogOpenMoreVisible"
            width="600px"
          >
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="广告位id"></el-checkbox>
              <el-checkbox label="广告位名称"></el-checkbox>
              <el-checkbox label="广告位描述"></el-checkbox>
              <el-checkbox label="广告位编码"></el-checkbox>
              <el-checkbox label="城市"></el-checkbox>
            </el-checkbox-group>
          </el-dialog>
        </div>
      </div>

      <el-table
        :data="tableData"
        border
        stripe
        :header-cell-style="{ background: '#FAFAFA' }"
        style="width: 100%; margin-top: 10px"
        ref="multipleTable"
        v-loading="tableLoading"
      >
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column
          v-if="checkList.includes('广告位id')"
          align="center"
          prop="adslotId"
          label="广告位id"
          width="180"
        ></el-table-column>
        <el-table-column
          v-if="checkList.includes('广告位名称')"
          align="center"
          prop="adslotName"
          label="广告位名称"
          width="180"
        ></el-table-column>
        <el-table-column
          v-if="checkList.includes('广告位描述')"
          align="center"
          prop="adslotDescription"
          label="广告位描述"
        ></el-table-column>
        <el-table-column
          v-if="checkList.includes('广告位编码')"
          align="center"
          prop="adslotNumber"
          label="广告位编码"
        ></el-table-column>
        <el-table-column
          v-if="checkList.includes('城市')"
          align="center"
          prop="cityName"
          label="城市"
        ></el-table-column>
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope" v-if="scope.row.authority">
            <el-button size="mini" type="text" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button size="mini" type="text" @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <template slot="empty">
          <hc-empty-data></hc-empty-data>
        </template>
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
    </hc-table-form>

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
            :loading="loading"
            v-model="form.cityId"
            placeholder="请选择城市"
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
          <el-input type="textarea" v-model="form.adslotDescription"></el-input>
        </el-form-item>
        <!-- 类型 -->
        <el-form-item label="类型 :" prop="type" :label-width="formLabelWidth">
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
          <el-input v-model="editForm.adslotName" autocomplete="off"></el-input>
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
        <el-form-item label="类型 :" prop="type" :label-width="formLabelWidth">
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
  </basic-container>
</template>

<script>
import {
  citys,
  addAdPosition,
  adPosition,
  editPlace,
  delAdP,
} from "@/api/content/ad-position";
import HcEmptyData from "@/views/components/HcEmptyData/index"
export default {
  components: { HcEmptyData },
  data() {
    return {
      tableData: [],
      loading: false,
      dialogFormVisible: false, //广告位新增弹窗
      dialogEditFormVisible: false, //广告位编辑弹窗
      dialogOpenMoreVisible: false, //菜单操作
      checkList: ["广告位id", "广告位名称", "广告位描述", "广告位编码", "城市"],
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
      tableLoading: false
    };
  },
  methods: {
    // 广告位弹窗关闭时触发
    dialogFormVisibleClose() {
      // 重置表单
      this.$refs.ruleForm.resetFields();
    },

    // 分页查询广告位
    getList() {
      this.tableLoading = true
      adPosition({
        current: this.currentPage, //当前页
        size: this.pageSize, //条数
      }).then((res) => {
        this.total = res.data.data.data.total;
        let records = res.data.data.data.records;
        this.tableData = records;
      }).finally(() => {
        this.tableLoading = false
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
      // this.cityGroup = {id:row.id}
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
.add-inp-more {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .inp-more {
    display: flex;
    .inp {
      width: 272px;
    }
    .more {
      padding: 0 12px;
      margin-left: 8px;
      height: 28px;
    }
  }
}
</style>
