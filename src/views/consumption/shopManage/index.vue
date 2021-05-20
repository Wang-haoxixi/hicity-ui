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
            <el-input v-model.trim="formData.storeName" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="店铺地址：" prop="address">
            <el-input v-model.trim="formData.address" maxlength="100"></el-input>
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
            <el-input v-model.trim="formData.storeUserName" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="storeUserPhone">
            <el-input v-model.trim="formData.storeUserPhone" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="城市/地区：" prop="cityId">
            <hc-city-select v-model="formData.cityId" :city-id="userInfo.manageCityId" single></hc-city-select>
          </el-form-item>
          <el-form-item label="店铺Logo：" prop="storeLogo">
            <hc-image-upload single :limit="1" v-model="formData.storeLogo" :disabled="publishType == 'view'" @change="logoChange"></hc-image-upload>
          </el-form-item>
          <el-form-item label="营业时间：" prop="openingHours">
            <el-input v-model.trim="formData.openingHours" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="店铺介绍：" prop="storeSynopsis">
            <el-input type="textarea" v-model="formData.storeSynopsis" :autosize="{minRows: 5, maxRows: 10}" maxlength="1000" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="店铺图片：" prop="storeSynopsisPicturesUrl">
            <hc-image-upload :limit="6" v-model="formData.storeSynopsisPicturesUrl" :disabled="publishType == 'view'" @change="logoChange"></hc-image-upload>
          </el-form-item>
          <el-form-item label="导航定位：" prop="locationAddr">
            <hc-map-select v-model="locationAddr" @city-change="cityChange" @change="locationAddrChange"></hc-map-select>
          </el-form-item>

          <el-form-item label="统一社会信用代码：" prop="businessLicense">
            <el-input v-model.trim="formData.businessLicense" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="公司名称：" prop="companyName">
            <el-input v-model.trim="formData.companyName" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="经营地址：" prop="businessAddress">
            <el-input v-model.trim="formData.businessAddress" maxlength="50"></el-input>
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
            <el-input v-model.trim="formData.businessType" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="营业期限：" prop="businessTerm">
            <el-input v-model.trim="formData.businessTerm" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="登记机关：" prop="registrationAuthority">
            <el-input v-model.trim="formData.registrationAuthority" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="经营范围：" prop="scopeOfManagement">
            <el-input v-model.trim="formData.scopeOfManagement" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="营业执照：" prop="businessLicenseUrl">
            <hc-image-upload single :limit="1" v-model="formData.businessLicenseUrl" :disabled="publishType == 'view'" @change="logoChange"></hc-image-upload>
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
                  <hc-input v-model="scope.row.sharePercentage" :decimal="0" maxlength="10" :max="100" :min="1">
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
          <el-form-item>
            <el-button v-if="publishType != 'view'" type="primary" :loading="formLoading" @click="handleCreate">保 存</el-button>
          </el-form-item>
        </el-form>
        <store-detail v-else :detail="storeDetail"></store-detail>
        
      </template>
    </hc-table-form>

    <share-account ref="shareAccount" @select="shareAdd"></share-account>

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
export default {
  components: { HcImageUpload, HcTableForm, HcEmptyData, HcMapSelect, HcRemoteSelect, HcCitySelect, HcInput, StoreDetail, ShareAccount },
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
      locationAddr: {},
      publish: false,
      publishType: "",
      cityChooseDialogVisible: false,
      newsTagList: [],
      titleImage: [],
      brandLoading: false,
      formRuleInit: {
        storeName: [{required: true, message: '请输入店铺名称', trigger: 'blur'}],
        companyName: [{required: true, message: '请输入公司名称', trigger: 'blur'}],
        businessAddress: [{required: true, message: '请输入经营地址', trigger: 'blur'}],
        dateOfSetUp: [{required: true, message: '请输入成立日期', trigger: 'blur'}],
        scopeOfManagement: [{required: true, message: '请输入经营范围', trigger: 'blur'}],
        businessType: [{required: true, message: '请输入企业类型', trigger: 'blur'}],
        businessTerm: [{required: true, message: '请输入营业期限', trigger: 'blur'}],
        registrationAuthority: [{required: true, message: '请输入登记机关', trigger: 'blur'}],
        address: [{required: true, message: '请输入详细地址', trigger: 'blur'}],
        storeManagerId: [{required: true, message: '请输入所属商户', trigger: 'blur'}],
        storeType: [{required: true, message: '请选择店铺类型', trigger: 'blur'}],
        storeUserName: [{required: true, message: '请输入联系人', trigger: 'blur'}],
        storeUserPhone: [{required: true, message: '请输入联系电话', trigger: 'blur'}],
        storeLogo: [{required: true, message: '请添加店铺Logo', trigger: 'blur'}],
        storeSynopsis: [{required: true, validator: this.storeSynopsisValidator, message: '请输入店铺介绍', trigger: 'blur'}],
        storeSynopsisPicturesUrl: [{required: true, message: '请添加店铺图片', trigger: 'blur'}],
        openingHours: [{required: true, message: '请输入营业时间', trigger: 'blur'}],
        businessLicense: [{required: true, message: '请输入统一社会信用代码', trigger: 'blur'}],
        businessLicenseUrl: [{required: true, message: '请输入营业执照', trigger: 'blur'}],
        locationAddr: [{validator: this.locationAddrValidator, required: true, message: '请选择导航定位', trigger: 'change'}],
        cityId: [{required: true, message: '请选择城市/地区', trigger: 'change'}],
        storeStatus: [{required: true, message: '请选择店铺状态', trigger: 'blur'}],
        discount: [{required: true, message: '请输入会员折扣', trigger: 'blur'}],
        percentageType: [{required: true, message: '请选择抽成类型', trigger: 'blur'}],
        storeShare: [{validator: this.storeShareValidator, required: true, trigger: 'blur'}]
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
    },
    storeSynopsisValidator (rules, value, callback) {
      if (!value.trim()) {
        callback(new Error())
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
        callback(new Error('请填写分成比例配置123'))
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
      this.formData = {
        storeName: '',
        storeLogo: '',
        storeSynopsis: '',
        cityId: '',
        percentageMoney: '',
        storeShare: []
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
      getStoreDetail({ storeId }).then(({ data }) => {storeShare
        this.storeDetail = data.data.data;
        this.publish = true;
        this.publishType = "view";
      });
    },
    toUpdate({ storeId }) {
      getStoreDetail({ storeId }).then(({ data }) => {
        this.formData = {
          storeShare: [],
          ...data.data.data
        };
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
          storeManagerId,
          storeId: this.handleId
        }).then(() => {
          this.$message.success('解绑成功')
          this.$refs.cashierOption.refresh()
        })
      }).then(() => {
      }).catch(function() {
      })
    },
    toAddShare () {
      this.$refs.shareAccount.open(this.formData.storeShare)
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
    toDeleteShare (row) {
      this.$confirm("是否确认删除该分成账户?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        this.formData.storeShare.splice(row.$index, 1)
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

