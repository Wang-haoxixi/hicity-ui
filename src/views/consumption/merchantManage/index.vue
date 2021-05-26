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
        <template v-slot:searchItems="scope">
          <div class="search-item">
            <div style="white-space: nowrap;">商户姓名：</div>
            <el-input v-model="scope.searchForm.merchantName" placeholder="请输入商户账户" maxlength="50" clearable></el-input>
          </div>
          <div class="search-item">
            <div style="white-space: nowrap;">商户状态：</div>
            <el-select v-model="scope.searchForm.merchantStatus">
              <el-option label="全部" :value="undefined">全部</el-option>
              <el-option label="正常" value='0'>正常</el-option>
              <el-option label="停用" value='1'>停用</el-option>
              <el-option label="注销" value='2'>注销</el-option>
            </el-select>
          </div>
          <div class="search-item">
            <div style="white-space: nowrap;">城市/地区：</div>
            <hc-city-select v-model="scope.searchForm.cityId" :city-id="userInfo.manageCityId" single></hc-city-select>
          </div>
        </template>
        <template slot="menu" slot-scope="scope">
          <template>
            <el-button type="text" size="mini" @click="toView(scope.row)"
              >详情</el-button>
            <template v-if="scope.row.merchantStatus != 2">
              <el-button type="text" size="mini" @click="toUpdate(scope.row)"
                >编辑</el-button>
              <el-button type="text" size="mini" @click="toDelete(scope.row)"
                >注销</el-button>
              <el-button type="text" size="mini" @click="toShopManage(scope.row)"
              >店铺管理</el-button>
              <el-button type="text" size="mini" @click="toViewOrder(scope.row)"
                >收款明细</el-button>
              <el-button type="text" size="mini" @click="toViewAccount(scope.row)"
                >账户明细</el-button>
            </template>
          </template>
        </template>
      </hc-crud>

      <template slot="form">
        <hc-crud v-if="publishType == 'shop'" ref="shopCrud" :option="shopTableOption" :fetchListFun="shopFetchListFun" :auto-load="false">
          <template slot="menu" slot-scope="scope">
            <el-button type="text" size="mini" @click="toViewShop(scope.row)" >店铺详情</el-button>
            <el-button type="text" size="mini" @click="toUnbundling(scope.row)" >解绑</el-button>
          </template>
        </hc-crud>

        <hc-crud v-else-if="publishType == 'order'" ref="orderCrud" :option="orderTableOption" :fetchListFun="orderFetchListFun" :auto-load="false">
          <template v-slot:searchItems="scope">
            <div class="search-item">
              <div style="white-space: nowrap;">订单号：</div>
              <el-input v-model="scope.searchForm.orderNum" placeholder="请输入订单号" maxlength="50" clearable></el-input>
            </div>
            <div class="search-item">
              <div style="white-space: nowrap;">收款店铺：</div>
              <el-select v-model="scope.searchForm.storeId" clearable @change="storeChange">
                <el-option label="全部" :value="undefined">全部</el-option>
                <el-option v-for="(item, index) in storeList" :key="index" :label="item.storeName" :value="item.storeId">{{item.storeName}}</el-option>
              </el-select>
            </div>
            <div class="search-item">
              <div style="white-space: nowrap;">收银员：</div>
              <el-select v-model="scope.searchForm.storeManagerId" clearable>
                <el-option label="全部" v-if="cashierList && cashierList.length > 0" :value="undefined">全部</el-option>
                <el-option v-for="(item, index) in cashierList" :key="index" :label="item.name" :value="item.storeManagerId">{{item.name}}</el-option>
              </el-select>
            </div>
            <div class="search-item">
            <div style="white-space: nowrap;">收款状态：</div>
              <el-select v-model="scope.searchForm.orderStatus" clearable>
                <el-option label="全部" :value="undefined">全部</el-option>
                <el-option v-for="(item, index) in dicList['STORE_ORDER_STATUS']" :key="index" :value="item.value" :label="item.label">{{item.label}}</el-option>
              </el-select>
            </div>
          </template>
          <template slot="menu" slot-scope="scope">
            <el-button type="text" size="mini" @click="toViewOrderDetail(scope.row)" >查看</el-button>
          </template>
        </hc-crud>

        <hc-crud v-else-if="publishType == 'account'" ref="accountCrud" :option="accountTableOption" :fetchListFun="accountFetchListFun" :auto-load="false">
        </hc-crud>        

        <el-form
          v-else
          :disabled="publishType == 'view'"
          ref="form"
          class="dialog-main-tree"
          :model="formData"
          label-width="180px"
          :rules="formRule"
        >
          <el-form-item label="商户账户：" prop="phone">
            <el-input v-model.trim="formData.phone" maxlength="50" :disabled="publishType == 'edit'"></el-input>
          </el-form-item>
          <el-form-item label="姓名：" prop="name">
            <el-input v-model.trim="formData.name" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop="gender">
            <el-select style="width: 250px;" v-model="formData.gender" placeholder="请选择性别">
              <el-option v-for="item in dicList['PERSON_GENDER']" :key="item.value" :value="item.value" :label="item.label">{{item.label}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="民族：" prop="nation">
            <el-select style="width: 250px;" v-model="formData.nation" placeholder="请选择民族">
              <el-option v-for="item in dicList['PERSON_NATION']" :key="item.value" :value="item.value" :label="item.label">{{item.label}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出生日期：" prop="birth">
            <el-date-picker
              v-model="formData.birth"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="地址：" prop="address">
            <el-input v-model.trim="formData.address" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="身份证号：" prop="idCard">
            <el-input v-model.trim="formData.idCard" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="身份证有效期：" prop="idCardTime">
            <el-date-picker
              v-model="idCardTime"
              @change="idCardChange"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="身份证正面：" prop="idCardPositive">
            <hc-image-upload single :limit="1" v-model="formData.idCardPositive" :disabled="publishType == 'view'"></hc-image-upload>
          </el-form-item>
          <el-form-item label="身份证反面：" prop="idCardReverse">
            <hc-image-upload single :limit="1" v-model="formData.idCardReverse" :disabled="publishType == 'view'"></hc-image-upload>
          </el-form-item>
          <el-form-item label="地区城市：" prop="cityId">
            <hc-city-select v-model="formData.cityId" :city-id="userInfo.manageCityId" single @change="$refs.form.validateField('cityId')"></hc-city-select>
          </el-form-item>
          <el-form-item label="联系人姓名：" prop="contactsName">
            <el-input v-model.trim="formData.contactsName" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="联系人电话：" prop="contactsPhone">
            <el-input v-model.trim="formData.contactsPhone" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="联系人地址：" prop="contactsAddress">
            <el-input v-model.trim="formData.contactsAddress" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="商户状态：" prop="merchantStatus">
            <el-radio-group v-model="formData.merchantStatus">
              <el-radio label="0">正常</el-radio>
              <el-radio label="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button v-if="publishType != 'view'" type="primary" :loading="formLoading" @click="handleCreate">保 存</el-button>
          </el-form-item>
        </el-form>

        <el-dialog
          title="订单详情"
          :visible.sync="storeVisible"
          width="70%">
          <store-detail :detail="storeDetail"></store-detail>
          <div slot="footer">
            <el-button @click="storeVisible = false">返 回</el-button>
          </div>
        </el-dialog>

        <el-dialog
          title="店铺详情"
          :visible.sync="orderVisible"
          width="70%">
          <order-detail :detail="orderDetail"></order-detail>
          <div slot="footer">
            <el-button @click="orderVisible = false">返 回</el-button>
          </div>
        </el-dialog>

      </template>
    </hc-table-form>
  </basic-container>
</template>

<script>
import { tableOption, shopTableOption, orderTableOption, accountTableOption } from "./const";
import { mapGetters } from "vuex";
import {
  getManageList,
  addManage,
  getManageDetail,
  updateManage,
  getManagerStorePage,
  getStoreDetail,
  unbundlingStore,
  cancelManager,
  getMerchantOrderPage,
  getMerchantOrderDetail,
  getMerchantStoreList,
  getMerchantAccountPage
} from "@/api/mms/store";
import HcImageUpload from "@/views/components/HcImageUpload/index";
import HcTableForm from "@/views/components/HcTableForm/index"
import HcEmptyData from "@/views/components/HcEmptyData/index"
import HcMapSelect from "@/views/components/HcMap/HcMapSelect/index"
import HcRemoteSelect from "@/views/components/HcForm/HcRemoteSelect/index"
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index"
import HcInput from "@/views/components/HcForm/HcInput/index"
import MerchantQrCode from "@/views/components/BusinessComponents/MerchantQrCode/index"
import StoreDetail from '@/views/consumption/shopManage/detail'
import OrderDetail from './orderDetail'

export default {
  components: { HcImageUpload, HcTableForm, HcEmptyData, HcMapSelect, HcRemoteSelect, HcCitySelect, HcInput, MerchantQrCode, StoreDetail, OrderDetail },
  data() {
    return {
      formData: {
        cityId: '',
      },
      publish: false,
      publishType: "",
      formRule: {
        phone: [{required: true, message: '请输入商户账户', trigger: 'blur'}],
        name: [{required: true, message: '请输入商户名称', trigger: 'blur'}],
        cityId: [{required: true, message: '请选择所在城市', trigger: 'change'}],
        contactsName: [{required: true, message: '请输入联系人姓名', trigger: 'blur'}],
        contactsPhone: [{required: true, message: '请输入联系人电话', trigger: 'blur'}],
        contactsAddress: [{required: true, message: '请输入联系人地址', trigger: 'blur'}],
        merchantStatus: [{required: true, message: '请选择店铺状态', trigger: 'blur'}],
      },
      idCardTime: [],
      formLoading: false,
      storeVisible: false,
      orderVisible: false,
      storeDetail: {},
      handleId: null,
      orderDetail: {},
      storeList: [],
      cashierList: [],
      shopTableOption,
      orderTableOption,
      accountTableOption,
    };
  },
  computed: {
    ...mapGetters(["permissions", "userInfo", "dicList", "userType", "allCityTree"]),
    tableOption() {
      return tableOption(this.userType == 1 || this.userType == 2);
    },
    title () {
      if (!this.publish) {
        return '商户管理'
      } else {
        if (this.publishType == 'add') {
          return '商户信息-新增'
        } else if (this.publishType == 'eidit') {
          return '商户信息-编辑'
        } else if (this.publishType == 'shop') {
          return '店铺管理'
        } else if (this.publishType == 'order') {
          return '收款明细'
        } else if (this.publishType == 'account') {
          return '账户明细'
        } else {
          return '商户信息'
        }
      }
    }
  },
  methods: {
    idCardChange (idCardTime) {
      if (idCardTime && idCardTime.length == 2) {
        this.formData.idCardStartTime = idCardTime[0]
        this.formData.idCardEndTime = idCardTime[1]
      } else {
        this.formData.idCardStartTime = ''
        this.formData.idCardEndTime = ''
      }
      this.$refs.form.validateField('idCardTime')
    },
    goBack () {
      this.publish = false
    },
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        getManageList(params)
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
    shopFetchListFun (params) {
      return new Promise((resolve, reject) => {
        getManagerStorePage({
          ...params,
          storeManagerId: this.handleId
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
    orderFetchListFun (params) {
      return new Promise((resolve, reject) => {
        getMerchantOrderPage({
          storeManagerId: this.handleId,
          ...params,
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
    accountFetchListFun (params) {
      return new Promise((resolve, reject) => {
        getMerchantAccountPage({
          userId: this.handleId,
          ...params,
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
    toCreate() {
      this.publish = true;
      this.publishType = "add";
      this.formData = {
        cityId: '',
      }
      this.idCardTime = []
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
        addManage(formData).then(({ data }) => {
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
        updateManage({ ...formData, merchantId: this.formData.merchantId }).then(({ data }) => {
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
    toView ({ storeManagerId }) {
      getManageDetail(storeManagerId).then(({ data }) => {
        this.formData = data.data.data;
        if (this.formData.idCardStartTime && this.formData.idCardEndTime) {
          this.idCardTime = [this.formData.idCardStartTime, this.formData.idCardEndTime]
        } else {
          this.idCardTime = []
          this.formData.idCardStartTime = ''
          this.formData.idCardEndTime = ''
        }
        this.locationAddr = {
          longitude: data.data.data.lng,
          latitude: data.data.data.lat,
          name: data.data.data.locationAddr
        }
        this.publish = true;
        this.publishType = "view";
      });
    },
    toUpdate({ storeManagerId }) {
      getManageDetail(storeManagerId).then(({ data }) => {
        this.formData = data.data.data;
        if (this.formData.idCardStartTime && this.formData.idCardEndTime) {
          this.idCardTime = [this.formData.idCardStartTime, this.formData.idCardEndTime]
        } else {
          this.idCardTime = []
          this.formData.idCardStartTime = ''
          this.formData.idCardEndTime = ''
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
    toDelete({ storeManagerId }) {
      this.$confirm("确认注销当前商户？注销后商户信息无法恢复。注销前请确保商户账户余额清零，且未绑定店铺。", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          cancelManager({
            storeManagerId,
          }).then(({ data }) => {
            this.publish = false;
            this.$notify({
              title: "成功",
              message: "注销成功",
              type: "success",
              duration: 2000,
            });
            this.$refs.hcCrud.refresh()
          });
        })
        .catch(function () {});
    },
    toShopManage ({storeManagerId}) {
      this.handleId = storeManagerId
      this.publish = true
      this.publishType = "shop"
      this.$nextTick(() => {
        this.$refs.shopCrud.resetSearch()
        this.$refs.shopCrud.toSearch()
      })
    },
    toViewShop ({storeId}) {
      getStoreDetail({ storeId }).then(({ data }) => {
        this.storeDetail = data.data.data;
        this.storeVisible = true
      });
    },
    toUnbundling ({storeId}) {
      this.$confirm(`确认解绑当前店铺？解绑后店铺将被注销删除，并自动解散所有收银员。`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        unbundlingStore({
          storeId,
          storeManagerId: this.handleId
        }).then(() => {
          this.$message.success('解绑成功')
          this.$refs.shopCrud.refresh()
        })
      }).then(() => {
      }).catch(function() {
      })
    },
    toViewOrder ({storeManagerId}) {
      this.handleId = storeManagerId
      this.publish = true
      this.publishType = "order"
      this.$nextTick(() => {
        this.$refs.orderCrud.resetSearch()
        this.$refs.orderCrud.toSearch()
      })
      getMerchantStoreList({storeManagerId}).then(({ data }) => {
        this.storeList = data.data.data
        this.cashierList = []
        this.$refs.orderCrud.resetSearchItems(['storeId', 'storeManagerId'])
      })
    },
    toViewOrderDetail ({storeOrderId}) {
      getMerchantOrderDetail({ storeOrderId }).then(({ data }) => {
        this.orderDetail = data.data.data;
        this.orderVisible = true
      });
    },
    storeChange (storeId) {
      if (storeId) {
        for (let i = 0; i < this.storeList.length; i++) {
          if (storeId == this.storeList[i].storeId) {
            this.cashierList = this.storeList[i].vos
            this.$refs.orderCrud.resetSearchItems(['storeManagerId'])
            return
          }
        }
      } else {
        this.cashierList = []
        this.$refs.orderCrud.resetSearchItems(['storeManagerId'])
      }
    },
    toViewAccount ({storeManagerId}) {
      this.handleId = storeManagerId
      this.publish = true
      this.publishType = "account"
      this.$nextTick(() => {
        this.$refs.accountCrud.resetSearch()
        this.$refs.accountCrud.toSearch()
      })
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
.search-item {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin: 10px 20px 0 0;
}
</style>

