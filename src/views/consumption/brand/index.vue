<template>
  <basic-container>
    <hc-table-form
      :title="title"
      :formVisible="publish"
      @go-back="goBack">
      <avue-crud
        ref="crud"
        :option="tableOption"
        :page="page"
        :table-loading="tableLoading"
        :data="tableData"
        @on-load="getList"
        @refresh-change="handleRefreshChange"
        style="margin-left: 0;"
      >
        <template slot="menuLeft">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="toCreate"
            >新建</el-button>
        </template>
         <template slot="menuRight">
          <el-checkbox v-model="isOwn" @change="refresh" style="margin-right: 20px;">尽看我的</el-checkbox>
        </template>
        <template slot="menu" slot-scope="scope">
          <template>
            <el-button type="text" size="mini" @click="toUpdate(scope.row)"
              >编辑</el-button
            >
            <el-button type="text" size="mini" @click="toDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </template>
      </avue-crud>
      <template slot="form">
        <el-form
          ref="form"
          class="dialog-main-tree"
          :model="formData"
          label-width="180px"
          :rules="formRule"
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
            <el-button @click="handleCreate">保存</el-button>
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
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false, // 是否倒序
      },
      isOwn: false,
      tableLoading: false,
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
        } else {
          return '品牌信息-编辑'
        }
      }
    }
  },
  methods: {
    goBack () {
      this.publish = false
    },
    refresh () {
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false, // 是否倒序
      }
      this.getList()
    },
    getList(page = this.page, params) {
      this.tableLoading = true;
      let form = {
        current: page.currentPage,
        size: page.pageSize,
        isOwn: this.isOwn
      };
      getBrandList(form)
        .then(({ data }) => {
          this.tableData = data.data.data.records;
          this.page.total = data.data.data.total;
        })
        .finally(() => {
          this.tableLoading = false;
        });
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
          this.getList();
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
          this.getList();
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
            this.getList();
          });
        })
        .catch(function () {});
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
</style>

