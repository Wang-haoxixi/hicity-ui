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

        <template v-slot:cityIdSearchItem="scope">
          <hc-city-select v-model="scope.searchForm.cityId" :city-id="userInfo.manageCityId" single></hc-city-select>
        </template>
        <template slot="menu" slot-scope="scope">
          <template>
            <el-button type="text" size="mini" @click="toView(scope.row)"
              >详情</el-button
            >
            <el-button type="text" size="mini" @click="toUpdate(scope.row)"
              >编辑</el-button
            >
            <el-button type="text" size="mini" @click="toViewCashier(scope.row)"
              >收银员管理</el-button
            >
          </template>
        </template>
      </hc-crud>

      <template slot="form">
        <el-form
          v-if="publishType != 'view'"
          ref="form"
          class="dialog-main-tree"
          :model="formData"
          label-width="180px"
          :rules="formRule"
        >
          <el-form-item label="店铺名称：" prop="storeName">
            <el-input v-model.trim="formData.storeName" maxlength="25"></el-input>
          </el-form-item>
          <el-form-item label="店铺地址：" prop="address">
            <el-input v-model.trim="formData.address" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="所属商户：" prop="storeManagerId">
            <hc-remote-select v-model="formData.storeManagerId" :remote-fun="getAllManager" :show-word="formData.storeManagerName" style="width: 300px" @option-change="managerChange">
              <template v-slot:option="scope">
                <strong>{{scope.option.data.name}} </strong>
                <span> ({{scope.option.data.phone}})</span>
              </template>
            </hc-remote-select>
          </el-form-item>
          <el-form-item label="店铺类型：" prop="storeType">
            <el-select style="width: 250px;" v-model="formData.storeType" placeholder="请选择店铺类型">
              <el-option v-for="item in dicList['STORE_TYPE']" :key="item.value" :value="item.value" :label="item.label">{{item.label}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系人：" prop="storeUserName">
            <el-input v-model.trim="formData.storeUserName" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="storeUserPhone">
            <el-input v-model.trim="formData.storeUserPhone" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="城市/地区：" prop="cityId">
            <hc-city-select v-model="formData.cityId" :city-id="userInfo.manageCityId" single></hc-city-select>
          </el-form-item>
          <el-form-item label="店铺Logo：" prop="storeLogo">
            <!-- <hc-image-upload single :limit="1" v-model="formData.storeLogo" :disabled="publishType == 'view'" @change="logoChange"></hc-image-upload> -->
            <hc-image-cropper v-model="formData.storeLogo" :disabled="publishType == 'view'" single :limit="1" @change="logoChange" bottom-tip="请上传尺寸为144*144，大小不超过2M的图片"></hc-image-cropper>
          </el-form-item>
          <el-form-item label="营业时间：" prop="openingHours">
            <el-input v-model.trim="formData.openingHours" placeholder="示例：周一至周五 10:00~17:00" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="店铺简介：" prop="storeSynopsis">
            <el-input type="textarea" placeholder="请输入店铺文字简介" v-model="formData.storeSynopsis" :autosize="{minRows: 5, maxRows: 10}" maxlength="500" show-word-limit></el-input>
            <hc-image-upload top-tip="店铺图片：" style="margin-top: 12px;" :limit="6" v-model="formData.storeSynopsisPicturesUrl" :disabled="publishType == 'view'" @change="logoChange"></hc-image-upload>
          </el-form-item>
          <el-form-item label="导航定位：" prop="locationAddr">
            <hc-map-select v-model="locationAddr" @city-change="cityChange" @change="locationAddrChange"></hc-map-select>
          </el-form-item>

          <el-form-item label="统一社会信用代码：" prop="businessLicense">
            <el-input v-model.trim="formData.businessLicense" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="公司名称：" prop="companyName">
            <el-input v-model.trim="formData.companyName" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="经营地址：" prop="businessAddress">
            <el-input v-model.trim="formData.businessAddress" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="成立日期：" prop="dateOfSetUp">
            <el-date-picker
              v-model="formData.dateOfSetUp"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="企业类型：" prop="businessType">
            <el-input v-model.trim="formData.businessType" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="营业期限：" prop="businessTerm">
            <el-radio-group v-model="businessTerm" @change="businessTermDate = ''">
              <el-radio label="长期">长期</el-radio>
              <el-radio label="期限">期限</el-radio>
            </el-radio-group>
            <br>
            <el-date-picker
              v-if="businessTerm == '期限'"
              v-model="businessTermDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="登记机关：" prop="registrationAuthority">
            <el-input v-model.trim="formData.registrationAuthority" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="经营范围：" prop="scopeOfManagement">
            <el-input type="textarea" placeholder="请输入店铺文字简介" v-model.trim="formData.scopeOfManagement" maxlength="300" :autosize="{minRows: 5, maxRows: 10}" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="营业执照：" prop="businessLicenseUrl">
            <hc-image-upload single :limit="1" v-model.trim="formData.businessLicenseUrl" :disabled="publishType == 'view'" @change="logoChange"></hc-image-upload>
          </el-form-item>

          <el-form-item label="店铺状态：" prop="storeStatus">
            <el-radio-group v-model="formData.storeStatus">
              <el-radio v-for="item in dicList['STORE_STATE']" :key="item.value" :label="parseInt(item.value)">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="会员折扣：" prop="discount">
            <hc-input style="width: 250px;" v-model="formData.discount" :decimal="1" maxlength="10" :max="9.99" :min="0.01">
              <div slot="append">折</div>
            </hc-input>
          </el-form-item>
          <el-form-item label="平台抽成规则：" prop="percentageType">
            <el-select style="width: 250px;" v-model="formData.percentageType" placeholder="请选择抽成类型" @change="percentageTypeChange">
              <el-option v-for="item in dicList['PERCENTAGE_TYPE']" :key="item.value" :value="item.value" :label="item.label">{{item.label}}</el-option>
            </el-select>
          </el-form-item>
          <template v-if="formData.percentageType == 2 || formData.percentageType == 3 || formData.percentageType == 4">
            <el-form-item :label="percentageLabel + '：'" prop="percentageMoney">
              <hc-input v-if="formData.percentageType == 2 || formData.percentageType ==3" style="width: 250px;" v-model="formData.percentageMoney" :decimal="2" maxlength="10" :max="99.99" :min="0.01">
                <div slot="append">%</div>
              </hc-input>
              <hc-input v-else style="width: 250px;" v-model="formData.percentageMoney" :decimal="2" maxlength="10" :max="99999999" :min="0">
                <div slot="append">元</div>
              </hc-input>
            </el-form-item>

            <el-form-item label="分成比例配置：" prop="storeShare">
              <avue-crud
                :option="shareTableOption"
                :data="formData.storeShare">
                <template slot="menuLeft">
                  <el-button
                    class="filter-item"
                    type="primary"
                    size="mini"
                    icon="el-icon-plus"
                    @click="toAddShare">添加
                  </el-button>
                </template>
                <template v-slot:sharePercentage="scope">
                  <hc-input v-model="scope.row.sharePercentage" :decimal="0" maxlength="10" :max="100" :min="0">
                    <div slot="append">%</div>
                  </hc-input>
                </template>
                <template slot="menu" slot-scope="scope">
                  <template>
                    <el-button type="text" size="mini" @click="toDeleteShare(scope.row)" >删除</el-button>
                  </template>
                </template>
              </avue-crud>
            </el-form-item>

          </template>

          <el-form-item label="微信手续费分配规则：" prop="storeWxConfigs">
            <avue-crud
              :option="wxConfigOption"
              :data="formData.storeWxConfigs">
              <template slot="menuLeft">
                <el-button
                  class="filter-item"
                  type="primary"
                  size="mini"
                  icon="el-icon-plus"
                  @click="toAddWxConfig">添加
                </el-button>
              </template>
              <template v-slot:wxPercentage="scope">
                <hc-input v-model="scope.row.wxPercentage" :decimal="0" maxlength="10" :max="100" :min="0">
                  <div slot="append">%</div>
                </hc-input>
              </template>
              <template slot="menu" slot-scope="scope">
                <template>
                  <el-button type="text" size="mini" v-if="scope.row.wxHierarchy != '商户'" @click="toDeleteWxConfig(scope.row)" >删除</el-button>
                </template>
              </template>
            </avue-crud>
          </el-form-item>

          <el-form-item>
            <el-button v-if="publishType != 'view'" type="primary" :loading="formLoading" @click="handleCreate">保 存</el-button>
          </el-form-item>
        </el-form>
        <store-detail v-else :detail="storeDetail"></store-detail>

      </template>
    </hc-table-form>

    <share-account ref="shareAccount" @select="shareAdd"></share-account>
    <wx-config-account ref="wxConfigAccount" @select="wxConfigAdd"></wx-config-account>

    <el-dialog
      title="收银员管理"
      :visible.sync="cashierVisible"
      width="70%">
      <hc-crud ref="cashierCrud" :option="cashierOption" :fetchListFun="cashierFetchListFun" :auto-load="false">
        <template slot="menu" slot-scope="scope">
          <el-button type="text" size="mini" @click="toUnbundling(scope.row)">解绑</el-button>
        </template>
      </hc-crud>
      <div slot="footer">
        <el-button @click="cashierVisible = false">返 回</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import { tableOption, cashierOption } from "./const";
import { mapGetters } from "vuex";
import {
  getStoreList,
  addStore,
  getStoreDetail,
  updateStore,
  getCashierPage,
  unbundlingCashier,
  getAllManager
} from "@/api/mms/store";
import HcImageUpload from "@/views/components/HcImageUpload/index";
import HcTableForm from "@/views/components/HcTableForm/index"
import HcEmptyData from "@/views/components/HcEmptyData/index"
import HcMapSelect from "@/views/components/HcMap/HcMapSelect/index"
import HcRemoteSelect from "@/views/components/HcForm/HcRemoteSelect/index"
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index"
import HcInput from "@/views/components/HcForm/HcInput/index"
import StoreDetail from './detail'
import ShareAccount from './shareAccount'
import WxConfigAccount from './wxConfigAccount'
import HcImageCropper from "@/views/components/HcImageUpload/cropper"
import { isMobile, isPhone } from '@/util/validate'
export default {
  components: { HcImageUpload, HcImageCropper, HcTableForm, HcEmptyData, HcMapSelect, HcRemoteSelect, HcCitySelect, HcInput, StoreDetail, ShareAccount, WxConfigAccount },
  data() {
    return {
      storeDetail: {},
      formData: {
        storeName: '',
        storeLogo: '',
        storeSynopsis: '',
        cityId: '',
        percentageMoney: ''
      },
      businessTerm: '',
      businessTermDate: '',
      locationAddr: {},
      publish: false,
      publishType: "",
      cityChooseDialogVisible: false,
      newsTagList: [],
      titleImage: [],
      brandLoading: false,
      formRuleInit: {
        storeName: [{required: true, message: '请输入店铺名称', trigger: 'blur'}],
        // companyName: [{required: true, message: '请输入公司名称', trigger: 'blur'}],
        // businessAddress: [{required: true, message: '请输入经营地址', trigger: 'blur'}],
        // dateOfSetUp: [{required: true, message: '请输入成立日期', trigger: 'blur'}],
        // scopeOfManagement: [{required: true, message: '请输入经营范围', trigger: 'blur'}],
        // businessType: [{required: true, message: '请输入企业类型', trigger: 'blur'}],
        // businessTerm: [{required: true, message: '请输入营业期限', trigger: 'blur'}],
        // registrationAuthority: [{required: true, message: '请输入登记机关', trigger: 'blur'}],
        address: [{required: true, message: '请输入详细地址', trigger: 'blur'}],
        storeManagerId: [{required: true, message: '请输入所属商户', trigger: 'blur'}],
        storeType: [{required: true, message: '请选择店铺类型', trigger: 'blur'}],
        storeUserName: [{required: true, message: '请输入联系人', trigger: 'blur'}],
        storeUserPhone: [{required: true, validator: this.storeUserPhoneValidator, trigger: 'blur'}],
        storeLogo: [{required: true, message: '请添加店铺Logo', trigger: 'blur'}],
        storeSynopsis: [{required: true, validator: this.storeSynopsisValidator, trigger: 'blur'}],
        openingHours: [{required: true, message: '请输入营业时间', trigger: 'blur'}],
        businessLicense: [{required: true, validator: this.businessLicenseValidator, trigger: 'blur'}],
        businessLicenseUrl: [{required: true, message: '请输入营业执照', trigger: 'blur'}],
        locationAddr: [{validator: this.locationAddrValidator, required: true, message: '请选择导航定位', trigger: 'change'}],
        cityId: [{required: true, message: '请选择城市/地区', trigger: 'change'}],
        storeStatus: [{required: true, message: '请选择店铺状态', trigger: 'blur'}],
        discount: [{required: true, message: '请输入会员折扣', trigger: 'blur'}],
        percentageType: [{required: true, message: '请选择抽成类型', trigger: 'blur'}],
        storeShare: [{validator: this.storeShareValidator, required: true, trigger: 'blur'}],
        storeWxConfigs: [{validator: this.storeWxConfigsValidator, required: true, trigger: 'blur'}]
      },
      formLoading: false,
      handleId: null,
      cashierVisible: false,
      cashierOption,
      shareTableOption: {
        border: true,
        stripe: true,
        menuAlign: 'center',
        editBtn: false,
        delBtn: false,
        align: 'center',
        addBtn: false,
        refreshBtn: false,
        columnBtn: false,
        labelWidth: 160,
        menuWidth: 80,
        column: [
          {
            label: '合伙人账户',
            prop: 'shareAccount',
          },
          {
            label: '账户等级',
            prop: 'shareHierarchy',
            width: 100
          },
          {
            label: '城市/地区',
            prop: 'cityName',
            width: 100
          },
          {
            label: '分成比例',
            prop: 'sharePercentage',
            slot: true,
            width: 150
          },
        ]
      },
      wxConfigOption: {
        border: true,
        stripe: true,
        menuAlign: 'center',
        editBtn: false,
        delBtn: false,
        align: 'center',
        addBtn: false,
        refreshBtn: false,
        columnBtn: false,
        labelWidth: 160,
        menuWidth: 80,
        column: [
          {
            label: '承担对象',
            prop: 'wxAccount',
          },
          {
            label: '账户类型',
            prop: 'wxHierarchy',
            width: 100
          },
          {
            label: '城市/地区',
            prop: 'cityName',
            width: 100
          },
          {
            label: '承当比例',
            prop: 'wxPercentage',
            slot: true,
            width: 150
          },
        ]
      }
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
      if (this.formData.percentageType == 2 || this.formData.percentageType == 3) {
        return '抽成百分比'
      } else if (this.formData.percentageType == 4) {
        return '抽成金额'
      } else {
        return ''
      }
    },
    title () {
      if (!this.publish) {
        return '店铺管理'
      } else {
        if (this.publishType == 'add') {
          return '店铺信息-新增'
        } else if (this.publishType == 'eidit') {
          return '店铺信息-编辑'
        } else {
          return '店铺信息'
        }
      }
    }
  },
  methods: {
    managerChange (option) {
      this.formData.storeManagerName = option.data.name
      if (this.formData.storeWxConfigs.length > 0 && this.formData.storeWxConfigs[0].wxHierarchy == '商户') {
        this.formData.storeWxConfigs.splice(0, 1, {
          wxUserId: option.data.storeManagerId,
          wxAccount: option.data.wxAccount,
          wxHierarchy: option.data.wxHierarchy,
          cityId: option.data.cityId,
          cityName: option.data.cityName,
          wxPercentage: 100,
        })
      } else {
        this.formData.storeWxConfigs.unshift({
          wxUserId: option.data.storeManagerId,
          wxAccount: option.data.wxAccount,
          wxHierarchy: option.data.wxHierarchy,
          cityId: option.data.cityId,
          cityName: option.data.cityName,
          wxPercentage: 100,
        })
      }
    },
    storeUserPhoneValidator (rules, value, callback) {
      if (!value) {
        callback(new Error('请输入联系人电话'))
      } else if (isMobile(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的电话号码格式'))
      }
    },
    storeSynopsisValidator (rules, value, callback) {
      if (this.formData.storeSynopsis.trim() || (this.formData.storeSynopsisPicturesUrl && this.formData.storeSynopsisPicturesUrl.length > 0)) {
        callback()
      } else {
        callback(new Error('请输入文字简介或上传图片介绍'))
      }
    },
    businessLicenseValidator (rules, value, callback) {
      if (!value) {
        callback(new Error('请输入统一社会信用代码'))
      } else if (value.length > 18 || value.length < 15) {
        callback(new Error('统一社会信用代码为15~18位'))
      } else {
        callback()
      }
    },
    percentageTypeChange (value) {
      this.formData.percentageMoney = ''
      this.formData.storeShare = []
      this.$nextTick(() => {
        this.$refs.form.clearValidate('percentageMoney')
      })
    },
    logoChange () {
      this.$refs.form.validateField('storeLogo')
    },
    locationAddrChange (value) {
      this.$refs.form.validateField('locationAddr')
    },
    locationAddrValidator (rule, value, callback) {
      if (this.locationAddr.name && this.locationAddr.longitude && this.locationAddr.latitude) {
        callback()
      } else {
        callback(new Error('请选择定位地址'))
      }
    },
    storeShareValidator (rule, value, callback) {
      let storeShare = this.formData.storeShare
      if (!storeShare || storeShare.length == 0) {
        callback(new Error('请填写分成比例配置'))
      } else {
        let total = 0
        for (let i = 0; i < storeShare.length; i++) {
          total += storeShare[i].sharePercentage
        }
        if (total != 100) {
          callback(new Error('分成比例数值之和须等于100'))
        } else {
          callback()
        }
      }
    },
    storeWxConfigsValidator (rule, value, callback) {
      let wxConfigs = this.formData.storeWxConfigs
      if (!wxConfigs || wxConfigs.length == 0) {
        callback(new Error('请填写微信手续费分配规则'))
      } else {
        let total = 0
        for (let i = 0; i < wxConfigs.length; i++) {
          total += wxConfigs[i].wxPercentage
        }
        if (total != 100) {
          callback(new Error('承担比例数值之和须等于100'))
        } else {
          callback()
        }
      }
    },
    goBack () {
      this.publish = false
    },
    brandSelect (data) {
      this.formData.brandId = data
    },
    getAllManager (name) {
      return new Promise((resolve, reject) => {
        getAllManager({name}).then(({data}) => {
          let managerListTemp = data.data.data
          let managerList = []
          for (let i = 0; i < managerListTemp.length; i++) {
            managerList.push({
              label: managerListTemp[i].name,
              value: managerListTemp[i].storeManagerId,
              data: managerListTemp[i]
            })
          }
          resolve(managerList)
        }, () => {
          reject(new Error("数据获取失败！"))
        })
      })
    },
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        getStoreList(params)
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
    cashierFetchListFun (params) {
      return new Promise((resolve, reject) => {
        getCashierPage({
          ...params,
          storeId: this.handleId
        })
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
      this.businessTerm = ""
      this.businessTermDate = ""
      this.formData = {
        storeName: '',
        storeLogo: '',
        storeSynopsis: '',
        cityId: '',
        percentageMoney: '',
        storeShare: [],
        storeWxConfigs: [],
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
      if (this.businessTerm == '长期') {
        formData.businessTerm = '长期'
      } else if (this.businessTerm == '期限'){
        formData.businessTerm = this.businessTermDate
      } else {
        formData.businessTerm = ''
      }
      if (this.publishType == "add") {
        addStore(formData).then(({ data }) => {
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
        updateStore({ ...formData, storeId: this.formData.storeId }).then(({ data }) => {
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
    toView ({ storeId }) {
      getStoreDetail({ storeId }).then(({ data }) => {
        this.storeDetail = data.data.data;
        this.publish = true;
        this.publishType = "view";
      });
    },
    toUpdate({ storeId }) {
      getStoreDetail({ storeId }).then(({ data }) => {
        this.formData = {
          storeShare: [],
          storeWxConfigs: [],
          ...data.data.data
        };
        if (this.formData.businessTerm == '长期') {
          this.businessTerm = '长期'
          this.businessTermDate = ''
        } else if (this.formData.businessTerm && /\d{4}-\d{2}-\d{2}/.test(this.formData.businessTerm)) {
          this.businessTerm = '期限'
          this.businessTermDate = this.formData.businessTerm
        } else {
          this.businessTerm = ''
          this.businessTermDate = ''
        }
        this.locationAddr = {
          longitude: data.data.data.lng,
          latitude: data.data.data.lat,
          name: data.data.data.locationAddr
        }
        this.publish = true;
        this.publishType = "edit";
      });
    },
    toViewCashier({ storeId }) {
      this.handleId = storeId
      this.cashierVisible = true
      this.$nextTick(() => {
        this.$refs.cashierCrud.resetSearch()
        this.$refs.cashierCrud.toSearch()
      })
    },
    toUnbundling ({storeManagerId}) {
      this.$confirm(`确认解绑当前收银员？解绑后收银员的收款信息不能找回，解绑后收银员可再次绑定。`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        unbundlingCashier({
          cashierId: storeManagerId,
          storeId: this.handleId
        }).then(() => {
          this.$message.success('解绑成功')
          this.$refs.cashierCrud.refresh()
        })
      }).then(() => {
      }).catch(function() {
      })
    },
    toAddShare () {
      this.$refs.shareAccount.open(this.formData.storeShare)
    },
    toAddWxConfig () {
      this.$refs.wxConfigAccount.open(this.formData.storeWxConfigs)
    },
    shareAdd (user) {
      this.formData.storeShare.push({
        shareUserId: user.userId,
        shareAccount: user.userName,
        shareHierarchy: user.shareHierarchy,
        cityId: user.cityId,
        cityName: user.cityName,
        sharePercentage: 0,
      })
    },
    wxConfigAdd (user) {
      this.formData.storeWxConfigs.push({
        wxUserId: user.userId,
        wxAccount: user.userName,
        wxHierarchy: user.wxHierarchy,
        cityId: user.cityId,
        cityName: user.cityName,
        wxPercentage: 0,
      })
    },
    toDeleteShare (row) {
      this.$confirm("是否确认删除该分成账户?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        this.formData.storeShare.splice(row.$index, 1)
      }).catch(function () {});
    },
    toDeleteWxConfig (row) {
      this.$confirm("是否确认删除该承担对象?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        this.formData.storeWxConfigs.splice(row.$index, 1)
      }).catch(function () {});
    }
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

