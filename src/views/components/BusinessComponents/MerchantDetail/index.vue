<template>
  <el-form
    ref="form"
    class="dialog-main-tree"
    disabled
    label-width="180px">
    <el-form-item label="店铺名称：" prop="merchantName">
      <el-input v-model="formData.merchantName" maxlength="50"></el-input>
    </el-form-item>
    <el-form-item label="店铺Logo：" prop="merchantLogo">
      <hc-image-upload single :limit="1" v-model="formData.merchantLogo" disabled></hc-image-upload>
    </el-form-item>
    <el-form-item label="店铺介绍：" prop="merchantSynopsis">
      <el-input type="textarea" v-model="formData.merchantSynopsis" :autosize="{minRows: 5, maxRows: 10}" maxlength="1000" show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="联系人：" prop="merchantUserName">
      <el-input v-model="formData.merchantUserName" maxlength="50"></el-input>
    </el-form-item>
    <el-form-item label="联系电话：" prop="merchantUserPhone">
      <el-input v-model="formData.merchantUserPhone" maxlength="20"></el-input>
    </el-form-item>
    <el-form-item label="定位地址：" prop="locationAddr">
      <hc-map-select v-model="locationAddr"></hc-map-select>
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="城市/地区：" prop="cityId">
          <hc-city-select v-model="formData.cityId" :city-id="1" single></hc-city-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="详细地址：" prop="address">
          <el-input v-model="formData.address" maxlength="100"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="关联品牌：" prop="brandId">
      <el-input style="width: 250px;" :value="formData.brandName"></el-input>
      <!-- <hc-remote-select style="width: 250px;" v-model="formData.brandId" :remote-fun="getAllBrand" :show-word="formData.brandName"></hc-remote-select> -->
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
      <el-select style="width: 250px;" v-model="formData.percentageType" placeholder="请选择抽成类型">
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
  </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import HcImageUpload from "@/views/components/HcImageUpload/index";
import HcMapSelect from "@/views/components/HcMap/HcMapSelect/index"
import HcRemoteSelect from "@/views/components/HcForm/HcRemoteSelect/index"
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index"
import HcInput from "@/views/components/HcForm/HcInput/index"
import { getAllBrand } from "@/api/mms/brand"
export default {
  components: { HcImageUpload, HcMapSelect, HcRemoteSelect, HcCitySelect, HcInput },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(["userInfo", "dicList", "allCityTree"]),
    formData () {
      return this.detail
    },
    locationAddr () {
      return {
        longitude: this.detail.lng,
        latitude: this.detail.lat,
        name: this.detail.locationAddr
      }
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
  },
};
</script>
<style lang="scss" scoped>
</style>

