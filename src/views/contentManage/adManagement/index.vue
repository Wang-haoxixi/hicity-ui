<template>
  <basic-container>
    <hc-table-form title="广告管理">
      <hc-crud ref="hcCrud" :option="tableOption" :fetchListFun="fetchListFun">
        <template v-slot:menuLeft>
          <el-button
            @click="dialogFormVisible = true"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            >新增</el-button>
        </template>
        <template v-slot:imageUrl="scope">
          <div class="picbox">
            <img :src="scope.row.imageUrl" class="pic" />
          </div>
        </template>

        <template v-slot:menu="scope">
          <template v-if="scope.row.authority">
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </template>
      </hc-crud>
    </hc-table-form>
    <!-- 广告新增 -->
    <el-dialog
      title="广告新增"
      :visible.sync="dialogFormVisible"
      @close="dialogFormVisibleClose"
    >
      <el-form :model="form" ref="ruleAddForm" :rules="ruleForm">
        <!-- 城市 -->
        <el-form-item
          label="城市 :"
          prop="cityName"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.cityName"
            disabled
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- 广告位 -->
        <el-form-item
          label="广告位 :"
          prop="adslotId"
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
            :picker-options="pickerOptionsBeginDate"
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
            :picker-options="pickerOptionsEndDate"
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
          prop="relationId"
          :label-width="formLabelWidth"
        >
          <el-select v-model="form.relationId" placeholder="请选择跳转对象">
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
        <el-form-item label="广告图片 :" :label-width="formLabelWidth">
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
        <el-button type="primary" :loading="formLoading" @click="submit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 广告编辑 -->
    <el-dialog
      title="广告编辑"
      :visible.sync="dialogEditFormVisible"
      @close="dialogEditFormVisibleClose"
    >
      <el-form :model="editForm" ref="ruleEditForm" :rules="ruleForm">
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
          prop="adslotId"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="editForm.adslotId"
            placeholder="请选择广告位"
            @change="editTypeValChange"
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
            :picker-options="pickerOptionsEditBeginDate"
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
            :picker-options="pickerOptionsEditEndDate"
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
            @change="editTypeChange"
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
          v-if="editForm.type"
          label="跳转对象 :"
          prop="adslotName"
          :label-width="formLabelWidth"
        >
          <el-select v-model="editForm.relationId" placeholder="请选择跳转对象">
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
        <el-button type="primary" :loading="formLoading" @click="editSubmit">确 定</el-button>
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
import { tableOption } from './const.js'
import { adPosition } from "@/api/content/ad-position";
import store from "@/store";
import HcEmptyData from "@/views/components/HcEmptyData/index";
export default {
  components: { HcEmptyData },
  data() {
    return {
      tableOption: tableOption,
      imageUrl: "",
      baseUrl: "/api/admin/sys_file/oss/upload", //oss上传文件
      headersOpt: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      dialogFormVisible: false, //新增广告弹窗
      dialogEditFormVisible: false, //编辑广告弹窗
      pickerOptionsBeginDate: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      pickerOptionsEndDate: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.form.beginDate).getTime();
        },
      },

      pickerOptionsEditBeginDate: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      pickerOptionsEditEndDate: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.editForm.beginDate).getTime();
        },
      },

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
        relationId: "", //跳转对象
        text: "", //广告文字
        imageUrl: "", //广告图片
        seq: "1", //广告排序
      },
      editForm: {}, // 编辑广告表单
      adslotGroup: [], //广告位数据
      adType: [], //广告类型数据
      jumpObjArr: [], //跳转对象数据

      formLabelWidth: "120px",

      ruleForm: {
        cityName: [{ required: true, message: "请选择广告位" }],
        adslotId: [{ required: true, message: "请选择", trigger: "change" }],
        adName: [
          { required: true, message: "请输入广告名称", trigger: "blur" },
          { min: 2, message: "长度大于 1 个字符", trigger: "blur" },
        ],
        beginDate: [
          { required: true, message: "请选择开始时间", trigger: "change" },
        ],
        endDate: [
          { required: true, message: "请选择结束时间", trigger: "change" },
        ],
        type: [
          { required: true, message: "请选择广告类型", trigger: "change" },
        ],
        text: [{ required: true, message: "请输入广告文字", trigger: "blur" }],
      },

      formLoading: false
    };
  },
  methods: {
    // 重置新增表单
    dialogFormVisibleClose() {
      this.$refs.ruleAddForm.resetFields();
      this.imageUrl = "";
      this.form.imageUrl = "";
      this.form.seq = "1";
      this.form.cityId = "";
    },
    // 重置编辑表单
    dialogEditFormVisibleClose() {
      this.$refs.ruleEditForm.resetFields();
      this.imageUrl = "";
      this.editForm.imageUrl = "";
      this.editForm.seq = "1";
    },
    // 新增 选中值发生变化时触发
    valChange(data) {
      if (this.adslotGroup) {
        this.adslotGroup.forEach((item) => {
          if (item.adslotId === data) {
            this.form.cityName = item.cityName;
            this.form.cityId = item.cityId;
            this.form.type = "";
            this.form.relationId = "";
          }
        });
      }
    },
    // 编辑 - 广告位选中值发生变化时触发
    editTypeValChange(data) {
      if (this.adslotGroup) {
        this.adslotGroup.forEach((item) => {
          if (item.adslotId === data) {
            this.editForm.cityName = item.cityName;
            this.editForm.cityId = item.cityId;
            this.editForm.type = "";
            this.editForm.relationId = "";
          }
        });
      }
    },

    // 获取广告位分页
    getAdPosition() {
      adPosition().then((res) => {
        this.adslotGroup = res.data.data.data.records.filter((item) => {
          return item.authority == true;
        });
      });
    },
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        ads(params).then((res) => {
          resolve({
            records: res.data.data.data.records,
            page: {
              total: res.data.data.data.total
            }
          })
        })
      })
    },

    // 获取广告类型数据
    getDictByTypeFn() {
      getDictByType("ad_type").then((res) => {
        this.adType = res.data.data.data.dictItemList;
      });
    },

    // 获取活动数据
    getActivitiePageFn(cityId) {
      activitiePage({ cityId: cityId }).then((res) => {
        this.jumpObjArr = res.data.data.data.records;
      });
    },

    // 新增广告
    addAdFn() {
      addAd(this.form).then((res) => {
        if (res.data.code !== 0) {
          return this.$message.error("新增广告失败！");
        }
        this.$message({
          message: "新增广告成功！",
          type: "success",
        });
        this.dialogFormVisible = false;
        this.$refs.hcCrud.refresh()
      }).finally(() => {
        this.formLoading = false
      });
    },

    // 编辑按钮
    handleEdit(row) {
      this.editForm = { ...row };
      this.adslotGroup.forEach((item) => {
        if (item.cityId === row.cityId) {
          this.editForm.cityName = item.cityName;
          this.editForm.cityId = item.cityId;
        }
      });
      if (row.type === "activity") {
        this.getActivitiePageFn(row.cityId);
      }
      this.dialogEditFormVisible = true;
      this.imageUrl = this.editForm.imageUrl;
    },

    // 监听广告类型变化
    typeChange(val) {
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
    editTypeChange(val) {
      if (!this.editForm.cityId) {
        this.$message.error("请先选择广告位");
        this.editForm.type = "";
        return;
      }
      // 活动
      if (val === "activity") {
        this.getActivitiePageFn(this.editForm.cityId);
      }
    },

    // 广告编辑 提交
    editSubmit() {
      this.formLoading = true
      this.$refs.ruleEditForm.validate((valid) => {
        if (valid) {
          updateAd(this.editForm).then((res) => {
            if (res.data.code !== 0) {
              return this.$message.error("广告编辑失败！");
            }
            this.$message({
              message: "广告编辑成功！",
              type: "success",
            });
            this.dialogEditFormVisible = false;
            this.$refs.hcCrud.refresh()
          }).finally(() => {
            this.formLoading = false
          });
        } else {
          this.formLoading = false
          return this.$message.error("请填写必填信息！");
        }
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
          delAd(row.adId).then((res) => {
            if (res.data.code !== 0) {
              return this.$message.error("广告删除失败！");
            }
            this.$message({
              message: "广告删除成功！",
              type: "success",
            });
            this.$refs.hcCrud.refresh()
          });
        })
        .catch(() => {
          this.$message("您已取消删除该广告！");
        });
    },

    // 广告新增 提交
    submit() {
      this.formLoading = true
      this.$refs.ruleAddForm.validate((valid) => {
        // 校验未通过
        if (!valid) {
          this.formLoading = false
          return this.$message.error("请填写必填信息！");
        }
        // 调用接口
        this.addAdFn();
      });
    },

    // 图片上传成功时的钩子
    handleAvatarSuccess(res) {
      this.imageUrl = res.data.data.url;
      this.form.imageUrl = res.data.data.url;
    },

    //编辑图片上传成功时的钩子
    handleEditPicSuccess(res) {
      this.imageUrl = res.data.data.url;
      this.editForm.imageUrl = res.data.data.url;
    },
  },

  created() {
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
