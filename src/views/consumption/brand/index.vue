<template>
  <basic-container>
    <hc-table-form
      :title="title"
      :formVisible="publish"
      @go-back="goBack">
      <hc-crud ref="hcCrud" :option="tableOption" :fetchListFun="fetchListFun">
        <template slot="menuLeft">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="toCreate"
            >新建</el-button>
        </template>
         <template slot="menuRight">
          <el-checkbox v-model="isOwn" @change="refresh" style="margin-right: 20px;">仅看我的</el-checkbox>
        </template>
        <template slot="menu" slot-scope="scope">
          <template>
            <el-button type="text" size="mini" @click="toView(scope.row)"
              >详情</el-button
            >
            <el-button type="text" size="mini" @click="toUpdate(scope.row)"
              >编辑</el-button
            >
            <el-button type="text" size="mini" @click="toDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </template>
      </hc-crud>
      <template slot="form">
        <el-form
          ref="form"
          class="dialog-main-tree"
          :model="formData"
          label-width="180px"
          :rules="formRule"
          :disabled="publishType == 'view'"
        >
          <el-form-item label="品牌名称：" prop="brandName">
            <el-input v-model="formData.brandName" maxlength="200"></el-input>
          </el-form-item>
          <el-form-item label="品牌Logo：" prop="brandLogo">
            <hc-image-upload :limit="1" v-model="formData.brandLogo"></hc-image-upload>
          </el-form-item>
          <el-form-item label="品牌介绍：" prop="brandSynopsis">
            <el-input type="textarea" v-model="formData.brandSynopsis" :autosize="{minRows: 5, maxRows: 10}" maxlength="250"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="publishType != 'view'" @click="handleCreate">保存</el-button>
          </el-form-item>
        </el-form>
      </template>
    </hc-table-form>
  </basic-container>
</template>

<script>
import { tableOption } from "./const";
import { mapGetters } from "vuex";
import {
  getBrandList,
  addBrand,
  getBrandDetail,
  updateBrand,
  deleteBrand,
} from "@/api/mms/brand";
import HcImageUpload from "@/views/components/HcImageUpload/index";
import HcTableForm from "@/views/components/HcTableForm/index"
import HcEmptyData from "@/views/components/HcEmptyData/index"

export default {
  components: { HcImageUpload, HcTableForm, HcEmptyData },
  data() {
    return {
      isOwn: false,
      tableData: [],
      formData: {
        brandName: '',
        brandLogo: '',
        brandSynopsis: ''
      },
      publish: false,
      publishType: "",
      cityChooseDialogVisible: false,
      newsTagList: [],
      titleImage: [],
      formRule: {
        brandName: [{required: true, message: '请输入品牌名称', trigger: 'blur'}],
        brandSynopsis: [{required: true, message: '请输入品牌介绍', trigger: 'blur'}],
        brandLogo: [{required: true, message: '请添加品牌Logo', trigger: 'blur'}],
      },
    };
  },
  computed: {
    ...mapGetters(["permissions", "userInfo", "dicList", "userType"]),
    tableOption() {
      return tableOption(this.userType == 1 || this.userType == 2);
    },
    title () {
      if (!this.publish) {
        return '品牌管理'
      } else {
        if (this.publishType == 'add') {
          return '品牌信息-新增'
        } else if (this.publishType == 'eidit') {
          return '品牌信息-编辑'
        } else if (this.publishType == 'view') {
          return '品牌信息-详情'
        } else {
          return '品牌信息'
        }
      }
    }
  },
  methods: {
    goBack () {
      this.publish = false
    },
    refresh () {
      this.$refs.hcCrud.refresh({currentPage: 1})
    },
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        getBrandList(params).then(({ data }) => {
          resolve({
            records: data.data.data.records,
            page: {
              total: data.data.data.total
            }
          })
        }, error => {
          reject(error)
        })
      })
    },
    toCreate() {
      this.publish = true;
      this.publishType = "add";
      this.formData = {
        brandName: '',
        brandLogo: '',
        brandSynopsis: ''
      }
    },
    handleCreate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.save(1)
        }
      })
    },
    save () {
      let formData = {
        brandName: this.formData.brandName,
        brandLogo: this.formData.brandLogo,
        brandSynopsis: this.formData.brandSynopsis,
        createByCityId: this.userInfo.manageCityId,
      }
      if (this.publishType == "add") {
        addBrand(formData).then(({ data }) => {
          this.publish = false;
          this.$notify({
            title: "成功",
            message: "添加成功",
            type: "success",
            duration: 2000,
          });
          this.$refs.hcCrud.refresh({currentPage: 1})
        });
      } else {
        updateBrand({ ...formData, brandId: this.formData.brandId }).then(({ data }) => {
          this.publish = false;
          this.$notify({
            title: "成功",
            message: "保存成功！",
            type: "success",
            duration: 2000,
          });
          this.$refs.hcCrud.refresh()
        });
      }
    },
    toUpdate({ brandId }) {
      getBrandDetail({ brandId }).then(({ data }) => {
        this.formData = data.data.data;
        this.publish = true;
        this.publishType = "edit";
      });
    },
    toView({ brandId }) {
      getBrandDetail({ brandId }).then(({ data }) => {
        this.formData = data.data.data;
        this.publish = true;
        this.publishType = "view";
      });
    },
    toDelete({ brandId }) {
      this.$confirm("是否确认删除该品牌?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteBrand({
            brandIds: [brandId],
          }).then(({ data }) => {
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
</style>

