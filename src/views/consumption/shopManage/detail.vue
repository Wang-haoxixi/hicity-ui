<template>
  <el-form
    label-width="140px"
  >
    <div class="store-base">
      <el-image class="store-logo" :src="detail.storeLogo"></el-image>
      <div class="name-address">
        <p class="name">{{detail.storeName}}</p>
        <p class="address">地址：{{detail.address}}</p>
      </div>
    </div>
    <el-form-item label="统一社会信用代码：">
      {{detail.businessLicense}}
    </el-form-item>

    <el-form-item label="所属商户：">
      {{detail.storeManagerName}}
    </el-form-item>


    <el-form-item label="店铺类型：">
      {{getDicValue('STORE_TYPE', detail.storeType)}}
    </el-form-item>

    <el-form-item label="城市/地区：">
      <hc-city-select v-model="detail.cityId" :city-id="userInfo.manageCityId" single view-only></hc-city-select>
    </el-form-item>
    <el-form-item label="店铺状态：">
      {{getDicValue('STORE_STATE', detail.storeStatus)}}
    </el-form-item>
    <el-form-item label="营业时间：">
      {{detail.openingHours}}
    </el-form-item>
    
    <el-form-item label="店铺口碑：">
      平均{{detail.storeGrade}}分，共{{detail.commentCount}}人评分
    </el-form-item>
    
    <el-form-item label="会员折扣：">
      {{detail.discount}}折
    </el-form-item>
    <el-form-item label="抽成比例">
      {{detail.percentageMoney ? detail.percentageMoney + '%' : '不抽成'}}
    </el-form-item>

    
    
    <el-form-item label="联系人：">
      {{detail.storeUserName}}
    </el-form-item>
    <el-form-item label="联系电话：">
      {{detail.storeUserPhone}}
    </el-form-item>
    <el-form-item label="店铺介绍：">
      {{detail.storeSynopsis}}
    </el-form-item>
    <el-form-item label="店铺图片：">
      <hc-image-upload :limit="6" v-model="detail.storeSynopsisPicturesUrl" disabled></hc-image-upload>
    </el-form-item>
    
    <el-form-item label="导航定位：">
      <hc-map-view style="width: 600px;height: 300px;" :address="{latitude: detail.lat, longitude: detail.lng}"></hc-map-view>
    </el-form-item>

    <h2>营业执照信息</h2>
    <el-form-item label="公司名称：">
      {{detail.companyName}}
    </el-form-item>
    <el-form-item label="经营地址：">
      {{detail.businessAddress}}
    </el-form-item>
    <el-form-item label="成立日期：">
      {{detail.dateOfSetUp}}
    </el-form-item>
    <el-form-item label="企业类型：">
      {{detail.businessType}}
    </el-form-item>
    <el-form-item label="营业期限：">
      {{detail.businessTerm}}
    </el-form-item>
    <el-form-item label="登记机关：">
      {{detail.registrationAuthority}}
    </el-form-item>
    <el-form-item label="经营范围：">
      {{detail.scopeOfManagement}}
    </el-form-item>
    <el-form-item label="营业执照：">
      <hc-image-upload :limit="1" single :value="detail.businessLicenseUrl" disabled></hc-image-upload>
    </el-form-item>

  </el-form>
</template>

<script>
import { getDicValue } from '@/util/dic'
import { mapGetters } from 'vuex'
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index"
import HcImageUpload from "@/views/components/HcImageUpload/index"
import HcMapView from "@/views/components/HcMap/HcMapView/index"
export default {
  components: {
    HcCitySelect,
    HcImageUpload,
    HcMapView
  },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    getDicValue
  },
  computed: {
    ...mapGetters(["userInfo"]),
  }
}
</script>

<style lang="scss" scoped>
.store-base {
  display: flex;
  height: 100px;
  .store-logo {
    height: 80px;
    width: 80px;
    flex: 80px 0 0;
  }
  .name-address {
    margin-left: 20px;
    height: 80px;
    flex: 80px 1 1;
    .name {
      height: 50px;
      line-height: 50px;
      font-size: 20px;
      font-weight: bold;
    }
    .address {
      height: 30px;
      line-height: 30px;
      font-size: 16px;
    }
  }
}
</style>
