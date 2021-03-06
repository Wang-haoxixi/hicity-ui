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
        <template v-slot:qrcode="scope">
          <merchant-qr-code :id="scope.row.merchantId"></merchant-qr-code>
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
          :disabled="publishType == 'view'"
          ref="form"
          class="dialog-main-tree"
          :model="formData"
          label-width="180px"
          :rules="formRule"
        >
          <el-form-item label="店铺名称：" prop="merchantName">
            <el-input v-model.trim="formData.merchantName" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="店铺Logo：" prop="merchantLogo">
            <hc-image-upload single :limit="1" v-model="formData.merchantLogo" :disabled="publishType == 'view'" @change="logoChange"></hc-image-upload>
          </el-form-item>
          <el-form-item label="店铺介绍：" prop="merchantSynopsis">
            <el-input type="textarea" v-model="formData.merchantSynopsis" :autosize="{minRows: 5, maxRows: 10}" maxlength="1000" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="联系人：" prop="merchantUserName">
            <el-input v-model.trim="formData.merchantUserName" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="merchantUserPhone">
            <el-input v-model.trim="formData.merchantUserPhone" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="定位地址：" prop="locationAddr">
            <hc-map-select v-model="locationAddr" @city-change="cityChange" @change="locationAddrChange"></hc-map-select>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="城市/地区：" prop="cityId">
                <hc-city-select v-model="formData.cityId" :city-id="userInfo.manageCityId" single></hc-city-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址：" prop="address">
                <el-input v-model.trim="formData.address" maxlength="100"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="关联品牌：" prop="brandId">
            <hc-remote-select style="width: 250px;" v-model="formData.brandId" :remote-fun="getAllBrand" :show-word="formData.brandName"></hc-remote-select>
          </el-form-item>
          <el-form-item label="店铺状态：" prop="merchantStatus">
            <el-radio-group v-model="formData.merchantStatus">
              <el-radio v-for="item in dicList['MERCHANT_STATE']" :key="item.value" :label="parseInt(item.value)">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="会员折扣：" prop="discount">
            <hc-input style="width: 250px;" v-model="formData.discount" :decimal="2" maxlength="10" :max="9.99" :min="0.01">
              <div slot="append">折</div>
            </hc-input>
          </el-form-item>
          <el-form-item label="抽成类型：" prop="percentageType">
            <el-select style="width: 250px;" v-model="formData.percentageType" placeholder="请选择抽成类型" @change="percentageTypeChange">
              <el-option v-for="item in dicList['PERCENTAGE_TYPE']" :key="item.value" :value="item.value" :label="item.label">{{item.label}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="formData.percentageType == 2 || formData.percentageType == 3" :label="percentageLabel + '：'" prop="percentageMoney">
            <hc-input v-if="formData.percentageType == 3" style="width: 250px;" v-model="formData.percentageMoney" :decimal="2" maxlength="20" :min="0">
              <div slot="append">元</div>
            </hc-input>
            <hc-input v-else style="width: 250px;" v-model="formData.percentageMoney" :decimal="2" maxlength="10" :max="99.99" :min="0.01">
              <div slot="append">%</div>
            </hc-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="publishType != 'view'" type="primary" :loading="formLoading" @click="handleCreate">保 存</el-button>
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
import HcInput from "@/views/components/HcForm/HcInput/index"
import MerchantQrCode from "@/views/components/BusinessComponents/MerchantQrCode/index"
export default {
  components: { HcImageUpload, HcTableForm, HcEmptyData, HcMapSelect, HcRemoteSelect, HcCitySelect, HcInput, MerchantQrCode },
  data() {
    return {
      formData: {
        merchantName: '',
        merchantLogo: '',
        merchantSynopsis: '',
        cityId: '',
        percentageMoney: ''
      },
      locationAddr: {},
      publish: false,
      publishType: "",
      cityChooseDialogVisible: false,
      newsTagList: [],
      titleImage: [],
      brandList: [],
      brandLoading: false,
      formRuleInit: {
        merchantName: [{required: true, message: '请输入商户名称', trigger: 'blur'}],
        merchantSynopsis: [{required: true, validator: this.merchantSynopsisValidator, message: '请输入商户介绍', trigger: 'blur'}],
        merchantLogo: [{required: true, message: '请添加商户Logo', trigger: 'blur'}],
        merchantUserName: [{required: true, message: '请输入联系人', trigger: 'blur'}],
        merchantUserPhone: [{required: true, message: '请输入联系电话', trigger: 'blur'}],
        cityId: [{required: true, message: '请选择所在城市', trigger: 'blur'}],
        address: [{required: true, message: '请输入详细地址', trigger: 'blur'}],
        brandId: [{required: true, message: '请选择关联品牌', trigger: 'blur'}],
        merchantStatus: [{required: true, message: '请选择店铺状态', trigger: 'blur'}],
        discount: [{required: true, message: '请输入会员折扣', trigger: 'blur'}],
        locationAddr: [{validator: this.locationAddrValidator, required: true, message: '请选择定位地址', trigger: 'change'}],
        percentageType: [{required: true, message: '请选择抽成类型', trigger: 'blur'}],
      },
      formLoading: false
    };
  },
  computed: {
    ...mapGetters(["permissions", "userInfo", "dicList", "userType", "allCityTree"]),
    tableOption() {
      return tableOption(this.userType == 1 || this.userType == 2);
    },
    formRule () {
      let formRule = this.formRuleInit
      formRule.percentageMoney = [{required: true, message: `请输入${this.percentageLabel}`, trigger: 'blur'}]
      return formRule
    },
    percentageLabel () {
      if (this.formData.percentageType == 2) {
        return '抽成百分比'
      } else if (this.formData.percentageType == 3) {
        return '抽成金额'
      } else {
        return ''
      }
    },
    title () {
      if (!this.publish) {
        return '商户管理'
      } else {
        if (this.publishType == 'add') {
          return '商户信息-新增'
        } else if (this.publishType == 'eidit') {
          return '商户信息-编辑'
        } else {
          return '商户信息'
        }
      }
    }
  },
  methods: {
    merchantSynopsisValidator (rules, value, callback) {
      if (!value.trim()) {
        callback(new Error())
      } else {
        callback()
      }
    },
    percentageTypeChange (value) {
      this.formData.percentageMoney = ''
      this.$nextTick(() => {
        this.$refs.form.clearValidate('percentageMoney')
      })
    },
    logoChange () {
      this.$refs.form.validateField('merchantLogo')
    },
    locationAddrChange () {
      this.$refs.form.validateField('locationAddr')
    },
    locationAddrValidator (rule, value, callback) {
      if (this.locationAddr.name && this.locationAddr.longitude && this.locationAddr.latitude) {
        callback()
      } else {
        callback(new Error('请选择定位地址'))
      }
    },
    goBack () {
      this.brandList = []
      this.publish = false
    },
    brandSelect (data) {
      this.formData.brandId = data
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
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        getMerchantList(params)
        .then(({ data }) => {
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
    cityChange ({city, district}) {
      let allCity = this.allCityTree[0].children
      if (city) {
        for (let i = 0; i < allCity.length; i++) {
          if (allCity[i].regionName == city) {
            if (district) {
              let allDistrict = allCity[i].children
              for (let j = 0; j < allDistrict.length; j++) {
                if (allDistrict[j].regionName == district) {
                  this.formData.cityId = allDistrict[j].id
                  return
                }
              }
            } else {
              this.formData.cityId = allCity[i].id
            }
            return
          }
        }
      }
    },
    toCreate() {
      this.publish = true;
      this.publishType = "add";
      this.formData = {
        merchantName: '',
        merchantLogo: '',
        merchantSynopsis: '',
        cityId: '',
        percentageMoney: ''
      }
      this.locationAddr = {}
      this.barndList = []
    },
    handleCreate() {
      this.formLoading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          this.save(1)
        } else {
          this.formLoading = false
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
      if (this.publishType == "add") {
        addMerchant(formData).then(({ data }) => {
          this.publish = false;
          this.$notify({
            title: "成功",
            message: "添加成功",
            type: "success",
            duration: 2000,
          });
          this.$refs.hcCrud.refresh()
        }).finally(() => {
          this.formLoading = false
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
          this.$refs.hcCrud.refresh()
        }).finally(() => {
          this.formLoading = false
        });
      }
    },
    showQRCode () {

    },
    toView ({ merchantId }) {
      getMerchantDetail({ merchantId }).then(({ data }) => {
        this.formData = data.data.data;
        this.locationAddr = {
          longitude: data.data.data.lng,
          latitude: data.data.data.lat,
          name: data.data.data.locationAddr
        }
        this.publish = true;
        this.publishType = "view";
      });
    },
    toUpdate({ merchantId }) {
      getMerchantDetail({ merchantId }).then(({ data }) => {
        this.formData = data.data.data;
        this.locationAddr = {
          longitude: data.data.data.lng,
          latitude: data.data.data.lat,
          name: data.data.data.locationAddr
        }
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
            this.$refs.hcCrud.refresh()
          });
        })
        .catch(function () {});
    },
  },
};
</script>
<style lang="scss" scoped>
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

