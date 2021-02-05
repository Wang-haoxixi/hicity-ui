<template>
  <basic-container>
    <hc-table-form
      title="广告管理">
      <template>
        <el-button
          @click="dialogFormVisible = true"
          type="primary"
          size="mini"
          icon="el-icon-plus"
        >新建</el-button>
        <el-table
          :data="tableData"
          border
          stripe
          :header-cell-style="{ background: '#FAFAFA' }"
          style="width: 100%; margin-top: 10px"
          ref="multipleTable"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            prop="seq"
            label="广告排序"
            width="100"
          ></el-table-column>
          <el-table-column prop="imageUrl" label="广告缩略图" width="180">
            <template slot-scope="scope">
              <div class="picbox">
                <img :src="scope.row.imageUrl" class="pic" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="adName" label="广告名称"></el-table-column>
          <el-table-column prop="adslotName" label="广告位"></el-table-column>
          <el-table-column prop="beginDate" label="开始时间"></el-table-column>
          <el-table-column prop="endDate" label="结束时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope" v-if="scope.row.authority">
              <el-button size="mini" type="text" @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          :page-size="pageSize"
          :total="total"
          class="paging"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </template>

    </hc-table-form>
    <!-- 广告新增 -->
    <el-dialog
      title="广告新增"
      :visible.sync="dialogFormVisible"
      @close="dialogFormVisibleClose"
    >
      <el-form :model="form" ref="ruleForm">
        <!-- 城市 -->
        <el-form-item label="城市 :" :label-width="formLabelWidth">
          <el-input
            v-model="form.cityName"
            disabled
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- 广告位 -->
        <el-form-item
          label="广告位 :"
          prop="adslot"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="form.adslotId"
            placeholder="请选择广告位"
            @change="valChange"
          >
            <el-option
              v-for="(item, index) in adslotGroup"
              :key="index"
              :label="item.adslotName"
              :value="item.adslotId"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 广告名称 -->
        <el-form-item
          label="广告名称 :"
          prop="adName"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.adName" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 开始时间 -->
        <el-form-item
          label="开始时间 :"
          prop="beginDate"
          :label-width="formLabelWidth"
        >
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="form.beginDate"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>

        <!-- 结束时间 -->
        <el-form-item
          label="结束时间 :"
          prop="endDate"
          :label-width="formLabelWidth"
        >
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="form.endDate"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>

        <!-- 广告类型 -->
        <el-form-item
          label="广告类型 :"
          prop="type"
          :label-width="formLabelWidth"
        >
          <el-select
            @change="typeChange"
            v-model="form.type"
            placeholder="请选择广告类型"
          >
            <el-option
              v-for="(item, index) in adType"
              :key="index"
              :label="item.description"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 跳转类型 -->
        <!-- <el-form-item
          label="跳转类型 :"
          prop="jumpType"
          :label-width="formLabelWidth"
        >
          <el-select v-model="form.jumpType" placeholder="请选择跳转类型">
          </el-select>
        </el-form-item> -->

        <!-- 跳转对象 -->
        <el-form-item
          v-if="form.type"
          label="跳转对象 :"
          prop="jumpObj"
          :label-width="formLabelWidth"
        >
          <el-select v-model="form.jumpObj" placeholder="请选择跳转对象">
            <el-option
              v-for="(item, index) in jumpObjArr"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 广告文字 -->
        <el-form-item
          label="广告文字 :"
          prop="text"
          :label-width="formLabelWidth"
        >
          <el-input type="textarea" v-model="form.text"></el-input>
        </el-form-item>

        <!-- 广告图片 -->
        <el-form-item
          label="广告图片 :"
          prop="imageUrl"
          :label-width="formLabelWidth"
        >
          <el-upload
            class="avatar-uploader"
            :action="baseUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :headers="headersOpt"
          >
            <img v-if="imageUrl" :src="form.imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <!-- 排序 -->
        <el-form-item label="排序 :" prop="seq" :label-width="formLabelWidth">
          <el-input-number
            v-model="form.seq"
            controls-position="right"
            :min="1"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 广告编辑 -->
    <el-dialog title="广告编辑" :visible.sync="dialogEditFormVisible">
      <el-form :model="editForm" ref="ruleForm">
        <!-- 城市 -->
        <el-form-item label="城市 :" :label-width="formLabelWidth">
          <el-input
            v-model="editForm.cityName"
            disabled
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- 广告位 -->
        <el-form-item
          label="广告位 :"
          prop="adslot"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="editForm.adslotId"
            placeholder="请选择广告位"
            @change="valChange"
          >
            <el-option
              v-for="(item, index) in adslotGroup"
              :key="index"
              :label="item.adslotName"
              :value="item.adslotId"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 广告名称 -->
        <el-form-item
          label="广告名称 :"
          prop="adName"
          :label-width="formLabelWidth"
        >
          <el-input v-model="editForm.adName" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 开始时间 -->
        <el-form-item
          label="开始时间 :"
          prop="beginDate"
          :label-width="formLabelWidth"
        >
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="editForm.beginDate"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>

        <!-- 结束时间 -->
        <el-form-item
          label="结束时间 :"
          prop="endDate"
          :label-width="formLabelWidth"
        >
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="editForm.endDate"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>

        <!-- 广告类型 -->
        <el-form-item
          label="广告类型 :"
          prop="type"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="editForm.type"
            placeholder="请选择广告类型"
            @change="editTypeValChange()"
          >
            <el-option
              v-for="(item, index) in adType"
              :key="index"
              :label="item.description"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 跳转类型 -->
        <!-- <el-form-item
          label="跳转类型 :"
          prop="jumpType"
          :label-width="formLabelWidth"
        >
          <el-select v-model="editForm.jumpType" placeholder="请选择跳转类型">
          </el-select>
        </el-form-item> -->

        <!-- 跳转对象 -->
        <el-form-item
          label="跳转对象 :"
          prop="jumpObj"
          :label-width="formLabelWidth"
        >
          <el-select v-model="editForm.jumpObj" placeholder="请选择跳转对象">
            <el-option
              v-for="(item, index) in jumpObjArr"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 广告文字 -->
        <el-form-item
          label="广告文字 :"
          prop="text"
          :label-width="formLabelWidth"
        >
          <el-input type="textarea" v-model="editForm.text"></el-input>
        </el-form-item>

        <!-- 广告图片 -->
        <el-form-item
          label="广告图片 :"
          prop="imageUrl"
          :label-width="formLabelWidth"
        >
          <el-upload
            class="avatar-uploader"
            :action="baseUrl"
            :show-file-list="false"
            :on-success="handleEditPicSuccess"
            :headers="headersOpt"
          >
            <img v-if="imageUrl" :src="editForm.imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <!-- 排序 -->
        <el-form-item label="排序 :" prop="seq" :label-width="formLabelWidth">
          <el-input-number
            v-model="editForm.seq"
            controls-position="right"
            :min="1"
          ></el-input-number>
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
  ads,
  delAd,
  adDetails,
  getDictByType,
  activitiePage,
  addAd,
  updateAd,
} from "@/api/content/ad";
import { adPosition } from "@/api/content/ad-position";
import store from "@/store";
export default {
  data() {
    return {
      tableData: [],
      imageUrl: "",
      baseUrl: "/api/admin/sys_file/oss/upload", //oss上传文件
      headersOpt: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      dialogFormVisible: false, //新增广告弹窗
      dialogEditFormVisible: false, //编辑广告弹窗
      // 新增广告表单
      form: {
        cityName: "", //城市名称

        cityId: "", //城市id
        adslotId: "", //广告位id
        adName: "", //广告名称
        beginDate: "", //开始时间
        endDate: "", //结束时间
        type: "", //广告类型
        // jumpType: "", //跳转类型
        jumpObj: "", //跳转对象
        text: "", //广告文字
        imageUrl: "", //广告图片
        seq: "", //广告排序
      },
      editForm: {}, // 编辑广告表单
      adslotGroup: [], //广告位数据
      adType: [], //广告类型数据
      jumpObjArr: [], //跳转对象数据

      formLabelWidth: "120px",

      ruleForm: {
        cityId: [{ required: true, message: "请选择", trigger: "change" }],
        adslotId: [
          { required: true, message: "请输入广告位", trigger: "blur" },
          { min: 1, message: "请输入", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入广告位名称", trigger: "blur" },
          { min: 1, message: "请输入", trigger: "blur" },
        ],
        imageUrl: [
          { required: true, message: "广告图片不能位空", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择", trigger: "change" }],
      },

      currentPage: 1,
      pageSize: 10,
      total: 30,
    };
  },
  methods: {
    dialogFormVisibleClose() {
      // 重置表单
      this.$refs.ruleForm.resetFields();
      this.form.cityName = "";
      this.form.cityId = "";
      this.form.adslotId = "";
      this.imageUrl = "";
    },
    // 新增 选中值发生变化时触发
    valChange(data) {
      console.log(data);
      if (this.adslotGroup) {
        this.adslotGroup.forEach((item) => {
          if (item.adslotId === data) {
            this.form.cityName = item.cityName;
            this.form.cityId = item.cityId;
          }
        });
      }
    },
    // 编辑 选中值发生变化时触发
    editTypeValChange(data) {
      console.log("选中值发生变化时触发", data);
    },

    // 获取广告位分页
    getAdPosition() {
      adPosition().then((res) => {
        this.adslotGroup = res.data.data.data.records.filter((item) => {
          return item.authority == true;
        });
        console.log("adslotGroup", this.adslotGroup);
      });
    },

    // 获取广告分页
    getList() {
      ads({
        current: this.currentPage, //当前页
        size: this.pageSize, //条数
      }).then((res) => {
        console.log("广告分页", res);
        let arr = res.data.data.data.records;
        this.tableData = arr;
        this.total = res.data.data.data.total;
      });
    },

    // 获取广告类型数据
    getDictByTypeFn() {
      getDictByType("ad_type").then((res) => {
        this.adType = res.data.data.data.dictItemList;
        console.log("获取广告类型数据", this.adType);
      });
    },

    // 获取活动数据
    getActivitiePageFn(cityId) {
      activitiePage({ cityId: cityId }).then((res) => {
        console.log("获取活动数据", res);
        this.jumpObjArr = res.data.data.data.records;
      });
    },

    // 新增广告
    addAdFn() {
      addAd(this.form).then((res) => {
        // console.log("新增", res);
        if (res.data.code !== 0) {
          return this.$message.error("新增广告失败！");
        }
        this.$message({
          message: "新增广告成功！",
          type: "success",
        });
        this.dialogFormVisible = false;
        this.getList();
      });
    },

    // 编辑按钮
    handleEdit(row) {
      // console.log("row", row);
      this.editForm = { ...row };
      console.log('aaaa',this.editForm)

      this.adslotGroup.forEach((item) => {
        if (item.cityId === row.cityId) {
          this.editForm.cityName = item.cityName;
          this.editForm.cityId = item.cityId;
        }
      });
      if (row.type === "activity") {
        this.getActivitiePageFn(row.cityId);
      }
      // console.log("editForm", this.editForm);

      this.dialogEditFormVisible = true;

      this.imageUrl = this.editForm.imageUrl;
    },

    // 监听广告类型变化
    typeChange(val) {
      console.log(val);
      if (!this.form.cityId) {
        this.$message.error("请先选择广告位");
        this.form.type = "";
        return;
      }
      // 活动
      if (val === "activity") {
        this.getActivitiePageFn(this.form.cityId);
      }
    },

    // 广告编辑 提交
    editSubmit() {
      updateAd(this.editForm).then((res) => {
        console.log("submit edit", res);
        if (res.data.code !== 0) {
          return this.$message.error("广告编辑失败！");
        }
        this.$message({
          message: "广告编辑成功！",
          type: "success",
        });
        this.dialogEditFormVisible = false;
        this.getList();
      });
    },

    // 删除
    handleDelete(row) {
      this.$confirm("确定删除该广告?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log("成功");
          delAd(row.adId).then((res) => {
            if (res.data.code !== 0) {
              return this.$message.error("广告删除失败！");
            }
            this.$message({
              message: "广告删除成功！",
              type: "success",
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message("您已取消删除该广告！");
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

    // 广告新增 提交
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          return this.$message.error("请填写必填信息！");
        }
        console.log(this.form);
        this.addAdFn();
      });
    },

    // 图片上传成功时的钩子
    handleAvatarSuccess(res) {
      console.log("上传成功", res);
      this.imageUrl = res.data.data.url;
      this.form.imageUrl = res.data.data.url;
    },

    //编辑图片上传成功时的钩子
    handleEditPicSuccess(res) {
      console.log("编辑上传成功", res);
      this.imageUrl = res.data.data.url;
      this.editForm.imageUrl = res.data.data.url;
    },
  },

  created() {
    this.getList();
    this.getAdPosition();
    this.getDictByTypeFn();
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

::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.picbox {
  width: 180px;
  height: 40px;
  .pic {
    max-width: 100%;
    width: auto;
    height: 40px;
  }
}
</style>
