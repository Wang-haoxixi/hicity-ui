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
          <el-form-item label="店铺名称：" prop="merchantName">
            <el-input v-model="formData.merchantName" maxlength="200"></el-input>
          </el-form-item>
          <el-form-item label="店铺Logo：" prop="merchantLogo">
            <hc-image-upload :limit="1" v-model="formData.merchantLogo"></hc-image-upload>
          </el-form-item>
          <el-form-item label="店铺介绍：" prop="merchantSynopsis">
            <el-input type="textarea" v-model="formData.merchantSynopsis" :autosize="{minRows: 5, maxRows: 10}" maxlength="250"></el-input>
          </el-form-item>
          <el-form-item label="联系人：" prop="merchantUserName">
            <el-input v-model="formData.merchantUserName" maxlength="200"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="merchantUserPhone">
            <el-input v-model="formData.merchantUserPhone" maxlength="200"></el-input>
          </el-form-item>
          <el-form-item label="所在城市：" prop="cityId">
            <hc-city-select v-model="formData.cityId" :city-id="userInfo.manageCityId" single></hc-city-select>
            <!-- <el-input v-model="formData.cityId" maxlength="200"></el-input> -->
          </el-form-item>
          <el-form-item label="定位地址：" prop="locationAddr">
            <hc-map-select v-model="locationAddr"></hc-map-select>
          </el-form-item>
          <el-form-item label="详细地址：" prop="address">
            <el-input v-model="formData.address" maxlength="200"></el-input>
          </el-form-item>
          <el-form-item label="关联品牌：" prop="brandId">
            <hc-remote-select v-model="formData.brandId" :remote-fun="getAllBrand" :show-word="formData.brandName"></hc-remote-select>
          </el-form-item>
          <el-form-item label="店铺状态：" prop="merchantStatus">
            <el-radio-group v-model="formData.merchantStatus">
              <el-radio v-for="item in dicList['MERCHANT_STATE']" :key="item.value" :label="parseInt(item.value)">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="会员折扣：" prop="discount">
            <el-input v-model="formData.discount" maxlength="200"></el-input>
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
  getMerchantList,
  addMerchant,
  getMerchantDetail,
  updateMerchant,
  deleteMerchant,
} from "@/api/mms/merchant";
import { getAllBrand } from "@/api/mms/brand"
import HcImageUpload from "@/views/components/HcImageUpload/index";
import HcTableForm from "@/views/components/HcTableForm/index"
import HcEmptyData from "@/views/components/HcEmptyData/index"
import HcMapSelect from "@/views/components/HcMap/HcMapSelect/index"
import HcRemoteSelect from "@/views/components/HcForm/HcRemoteSelect/index"
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index"
export default {
  components: { HcImageUpload, HcTableForm, HcEmptyData, HcMapSelect, HcRemoteSelect, HcCitySelect },
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
        merchantName: '',
        merchantLogo: '',
        merchantSynopsis: '',
        cityId: '',
      },
      locationAddr: {},
      publish: false,
      publishType: "",
      cityChooseDialogVisible: false,
      newsTagList: [],
      titleImage: [],
      formRule: {
        merchantName: [{required: true, message: '请输入商户名称', trigger: 'blur'}],
        merchantSynopsis: [{required: true, message: '请输入商户介绍', trigger: 'blur'}],
        merchantLogo: [{required: true, message: '请添加商户Logo', trigger: 'blur'}],
      },
      brandList: [],
      brandLoading: false,
    };
  },
  computed: {
    ...mapGetters(["permissions", "userInfo", "dicList", "userType"]),
    tableOption() {
      return tableOption(this.userType == 1 || this.userType == 2);
    },
    title () {
      if (!this.publish) {
        return '商户管理'
      } else {
        if (this.publishType == 'add') {
          return '商户信息-新增'
        } else {
          return '商户信息-编辑'
        }
      }
    }
  },
  methods: {
    goBack () {
      this.brandList = []
      this.publish = false
    },
    brandSelect (data) {
      this.formData.brandId = data
      console.log(data)
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
    getAllBrand (brandName) {
      return new Promise((resolve, reject) => {
        getAllBrand({brandName}).then(({data}) => {
          let brandListTemp = data.data.data
          let brandList = []
          for (let i = 0; i < brandListTemp.length; i++) {
            brandList.push({
              label: brandListTemp[i].brandName,
              value: brandListTemp[i].brandId
            })
          }
          resolve(brandList)
        }, () => {
          reject(new Error("数据获取失败！"))
        })
      })
    },
    getList(page = this.page, params) {
      this.tableLoading = true;
      let form = {
        current: page.currentPage,
        size: page.pageSize,
        isOwn: this.isOwn
      };
      getMerchantList(form)
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
        merchantName: '',
        merchantLogo: '',
        merchantSynopsis: '',
        cityId: '',
      }
      this.locationAddr = {}
      this.barndList = []
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
        ...this.formData,
        lng: this.locationAddr.longitude,
        lat: this.locationAddr.latitude,
        locationAddr: this.locationAddr.name
      }
      console.log(formData)
      if (this.publishType == "add") {
        addMerchant(formData).then(({ data }) => {
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
        updateMerchant({ ...formData, merchantId: this.formData.merchantId }).then(({ data }) => {
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
    toUpdate({ merchantId }) {
      getMerchantDetail({ merchantId }).then(({ data }) => {
        this.formData = data.data.data;
        this.locationAddr = {
          longitude: data.data.data.lng,
          latitude: data.data.data.lat,
          name: data.data.data.locationAddr
        }
        // getAllBrand({brandName: data.data.data.brandName}).then(({data}) => {
        //   this.brandList = data.data.data
        //   if (!data.data.data || data.data.data.length == 0) {
        //     this.formData.brandId = ''
        //     this.formData.brandName = ''
        //   }
        // }).finally(() => {
        //   this.brandLoading = false;
        // })
        this.publish = true;
        this.publishType = "edit";
      });
    },
    toDelete({ merchantId }) {
      this.$confirm("是否确认删除该商户?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteMerchant({
            merchantIds: [merchantId],
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

