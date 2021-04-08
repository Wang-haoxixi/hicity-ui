<template>
  <el-form
    ref="form"
    :model="formData"
    label-width="150px"
    :rules="formRule">
    <h3 class="form-title">基本信息</h3>
    <el-form-item label="券名称：" prop="name">
      <el-input v-model="formData.name" maxlength="50" placeholder="品牌+商品类型+金额+代金券+商铺名称，如食品 西朵曼生日蛋糕100元代金券 雁峰区希朵曼"></el-input>
    </el-form-item>
    <el-form-item label="券门类：" prop="category">
      <el-select v-model="formData.category">
        <el-option label="餐饮外卖" :value="0">餐饮外卖</el-option>
        <el-option label="商超购物" :value="1">商超购物</el-option>
        <el-option label="出行玩乐" :value="2">出行玩乐</el-option>
        <el-option label="电影演出" :value="3">电影演出</el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="抵扣价：" prop="deductionPrice">
      <hc-input v-model="formData.deductionPrice" :decimal="2" :min="0.01" maxlength="10" style="width: 200px;" :disabled="formData.status == '3' || formData.status == '2'">
        <div slot="append">元</div>
      </hc-input>
      <div>抵扣价指商户核销该券时抵扣的价格，该价格用于计算展示用户到店支付金额</div>
    </el-form-item>
    <el-form-item label="满足条件：" prop="conditionPrice">
      满
      <hc-input v-model="formData.conditionPrice" :decimal="2" :min="0.01" maxlength="10" style="width: 200px;" :disabled="formData.status == '3' || formData.status == '2'">
        <div slot="append">元</div>
      </hc-input>
      可用
      <div>例如：满100元可用</div>
    </el-form-item>
    <el-form-item label="供应量：" prop="supply">
      <el-input-number v-model="formData.supply" :min="1"></el-input-number>
    </el-form-item>
    <el-form-item label="是否永久有效：" prop="isPermanent">
      <el-switch v-model="formData.isPermanent" active-text="是" active-value="1" inactive-text="否" inactive-value="0" @change="permanetChange"></el-switch>
    </el-form-item>
    <el-form-item class="form-item-available" label="可用时间：" prop="availableTime" style="padding-bottom: 20px;">
      <el-form-item class="form-item-available-start" labelWidth="0" prop="availableStartTime" style="display: inline-block">
        <el-date-picker
          v-model="formData.availableStartTime"
          @change="$refs.form.validateField('availableTime')"
          type="datetime"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择开始时间">
        </el-date-picker>
      </el-form-item>
        至
      <el-form-item v-if="formData.isPermanent == 0" prop="availableEndTime" style="display: inline-block">
        <el-date-picker
          v-model="formData.availableEndTime"
          @change="$refs.form.validateField('availableTime')"
          type="datetime"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择结束时间">
        </el-date-picker>
      </el-form-item>
      <template v-else>
        永久
      </template>
    </el-form-item>
    <el-form-item label="logo设置：" prop="logo">
      <el-checkbox v-if="!isPlatform" v-model="formData.isCopyLogo" label="复用商户logo" border @change="$refs.form.validateField('logo')"></el-checkbox>
      <template v-if="!formData.isCopyLogo">
        <div>图片建议尺寸:120像素*120像素，大小不超过1M，支持JPG、PNG格式。如不上传，默认使用超能支付logo</div>
        <hc-image-upload v-model="formData.logo" :limit="1" @change="$refs.form.validateField('logo')"></hc-image-upload>
      </template>
    </el-form-item>
    <el-form-item label="使用说明：" prop="instructions">
      <el-input type="textarea" v-model="formData.instructions" :autosize="{minRows: 6, maxRows: 10}" maxlength="200" style="width: 400px;"
      placeholder="例如：
美食满300元-100元（酒水、饮料、槟榔、香烟除外）；
本券不兑现，不找零，不可与本店其他优惠活动同时享受；
发票事宜请以商家为准；
本券需要预约，请提前与商家进行预约；"
      ></el-input>
    </el-form-item>

    <h3 class="form-title">上下架时间</h3>
    <el-form-item label="上架时间：" prop="upTime">
      <el-radio-group v-model="upTimeType" @change="upTimeTypeChange">
        <div style="display: flex;align-items: center;height: 36px;">
          <el-radio label="1">立即上架售卖</el-radio>
        </div>
        <div style="display: flex;align-items: center;height: 36px;">
          <el-radio label="2">自定义上架时间</el-radio>
        </div>
        <el-date-picker v-if="upTimeType == 2"
          v-model="formData.upTime"
          type="datetime"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择上架时间">
        </el-date-picker>
        <div style="display: flex;align-items: center;height: 36px;">
          <el-radio label="3" :disabled="formData.status == '3' || formData.status == '2'">暂不售卖，放入仓库</el-radio>
        </div>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="下架时间：" prop="downTime">
      <el-date-picker
        v-if="formData.isPermanent == '0'"
        v-model="formData.downTime"
        type="datetime"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择下架时间">
      </el-date-picker>
      <template v-else>
        长期有效
      </template>
      
      <!-- <el-radio-group disabled :value="formData.isPermanent">
        <div style="display: flex;align-items: center;height: 36px;">
          <el-radio label="1">长期有效</el-radio>
          <span>当券库存为0时，会放到『已售罄』的券列表里，可加库存或下架该券;下架后，该券放到『仓库中』的券列表里</span>
        </div>
        <div style="display: flex;align-items: center;height: 36px;">
          <el-radio label="0">自定义下架时间</el-radio>
          <span>期间券库存为0时，会放到『已售罄』的券列表里，可在下架时间前加库存继续开售或直接下架该券;下架后，该券放到『仓库中』的券列表里</span>
        </div>
        <el-date-picker
          v-if="formData.isPermanent == '0'"
          v-model="formData.downTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-radio-group> -->
    </el-form-item>

    <h3 class="form-title">领取限制</h3>
    <el-form-item v-if="isPlatform" label="适用范围：" prop="cityIds">
      <hc-city-select v-model="cityIds" :city-id="userInfo.manageCityId"></hc-city-select>
    </el-form-item>
    <el-form-item label="用户可领个数：" prop="limit">
      活动期间每个用户可参与
      <el-input-number v-model="formData.limit" :max="99999999" :min="1"></el-input-number>
      个
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import HcImageUpload from "@/views/components/HcImageUpload/index";
import HcInput from "@/views/components/HcForm/HcInput/index"
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index"
export default {
  name: "CouponsForm",
  components: { HcImageUpload, HcInput, HcCitySelect },
  props: {
    isPlatform: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(date){
          let zero = new Date().setHours(0, 0, 0, 0);
          if(date.getTime() > zero){
              return false;
          }
          return true;
        }
      },
      formData: {
        logo: '',
      },
      upTimeType: '',
      downTimeType: '',
      cityIds: [],
      formRule: {
        name: [{required: true, message: '请输入券名称', trigger: 'blur'}],
        deductionPrice: [{validator: this.deductionPriceValidator, required: true, trigger: 'blur'}],
        conditionPrice: [{validator: this.conditionPriceValidator, required: true, trigger: 'blur'}],
        supply: [{required: true, message: '请输入供应量', trigger: 'blur'}],
        availableTime: [
          {validator: this.availableTimeDiffValidator, required: true, trigger: 'blur'},
        ],
        availableStartTime: [
          {required: true, message: '请输入可用开始时间', trigger: 'blur'},
          {validator: this.startTimeValidator, trigger: 'blur', message: '可用开始时间不能早于上架时间'},
        ],
        availableEndTime: [
          {validator: this.availableEndTimeRequiredValidator, required: true, trigger: 'blur'},
          {validator: this.endTimeValidator, trigger: 'blur', message: '可用结束时间不能早于下架时间'}
        ],
        upTime: [
          {validator: this.upTimeRequiredValidator, required: true, trigger: 'blur'},
          {validator: this.updownTimeDiffValidator, trigger: 'blur', message: '上架时间须早于下架时间'},
          {validator: this.startTimeValidator, trigger: 'blur', message: '上架时间须早于可用开始时间'},
        ],
        downTime: [
          {validator: this.downTimeRequiredValidator, required: true, trigger: 'blur'},
          {validator: this.updownTimeDiffValidator, trigger: 'blur', message: '下架时间须晚于上架时间'},
          {validator: this.endTimeValidator, trigger: 'blur', message: '下架时间须早于可用结束时间'},
        ],
        limit: {required: true, message: '请输入用户可领个数', trigger: 'blur'},
        logo: {validator: this.logoValidator, required: true, trigger: 'blur'},
        cityIds: {required: true, validator: this.cityValidator, message: '请选择适用范围', trigger: 'change'},
      },
    };
  },
  computed: {
    ...mapGetters(["permissions", "userInfo", "dicList", "userType"]),
  },
  methods: {
    open (initForm = {}, formRule) {
      this.formData = {
        logo: '',
        scopeOfUseCity: '',
        isPermanent: '0',
        isCopyLogo: false, 
        upTime: '', 
        downTime: '',
        availableStartTime: '',
        availableEndTime: '',
        ...initForm
      }
      if (this.formData.status == 0 && this.formData.isDepository == '1') {
        this.upTimeType = '3'
      } else {
        this.upTimeType = '2'
      }
      let cityIds = this.formData.scopeOfUseCity ? this.formData.scopeOfUseCity.split(',') : []
      for (let i = 0; i < cityIds.length; i++) {
        cityIds.splice(i, 1, parseInt(cityIds[i]))
      }
      this.cityIds = cityIds
      formRule && (this.formRule = formRule)
    },
    permanetChange () {
      this.formData.availableEndTime = ''
      this.formData.downTime = ''
      this.$refs.form.clearValidate('downTime')
      this.$refs.form.validateField('availableTime')
    },
    upTimeTypeChange () {
      this.formData.upTime = ''
      this.$refs.form.clearValidate('upTime')
    },
    deductionPriceValidator (rules, value, callback) {
      let formData = this.formData
      if (formData.deductionPrice) {
        if (formData.conditionPrice && formData.deductionPrice >= formData.conditionPrice) {
          callback(new Error('抵扣价不能高于满足条件'))
          return
        } else if (formData.conditionPrice) {
          this.$refs.form.clearValidate('conditionPrice')
        }
        callback()
      } else {
        if (formData.conditionPrice) {
          this.$refs.form.clearValidate('conditionPrice')
        }
        callback(new Error('请输入抵扣价'))
      }
    },
    conditionPriceValidator (rules, value, callback) {
      let formData = this.formData
      if (formData.conditionPrice) {
        if (formData.deductionPrice && formData.deductionPrice >= formData.conditionPrice) {
          callback(new Error('满足条件不能低于抵扣价'))
        } else if (formData.deductionPrice) {
          this.$refs.form.clearValidate('deductionPrice')
        }
        callback()
      } else {
        if (formData.deductionPrice) {
          this.$refs.form.clearValidate('deductionPrice')
        }
        callback(new Error('请输入满足条件'))
      }
    },
    availableTimeRequiredValidator (rules, value, callback) {
      if (!this.formData.availableStartTime) {
        callback(new Error('请输入可用开始时间'))
      } else if (this.formData.isPermanent == '0' && !this.formData.availableEndTime) {
        callback(new Error('请输入可用结束时间'))
      } else {
        callback()
      }
    },
    availableEndTimeRequiredValidator (rules, value, callback) {
      if (this.formData.isPermanent == '0' && !this.formData.availableEndTime) {
        callback(new Error('请输入可用结束时间'))
      } else {
        callback()
      }
    },
    availableTimeDiffValidator (rules, value, callback) {
      if (this.formData.availableStartTime && this.formData.availableEndTime && this.formData.availableStartTime >= this.formData.availableEndTime) {
        callback(new Error('可用开始时间须早于可用结束时间'))
      } else {
        callback()
      }
    },
    startTimeValidator (rules, value, callback) {
      if (this.upTimeType == 2 && this.formData.availableStartTime && this.formData.upTime && this.formData.upTime > this.formData.availableStartTime) {
        callback(new Error(rules.message))
      } else {
        callback()
      }
    },
    endTimeValidator (rules, value, callback) {
      if (this.formData.isPermanent == '0' && this.formData.availableEndTime && this.formData.downTime && this.formData.downTime > this.formData.availableEndTime) {
        callback(new Error(rules.message))
      } else {
        callback()
      }
    },
    upTimeRequiredValidator (rules, value, callback) {
      if (this.upTimeType == 2 && !this.formData.upTime) {
        callback(new Error('请输入上架时间'))
      } else {
        callback()
      }
    },
    downTimeRequiredValidator (rules, value, callback) {
      if (this.formData.isPermanent == '0' && !this.formData.downTime) {
        callback(new Error('请输入下架时间'))
      } else {
        callback()
      }
    },
    updownTimeDiffValidator (rules, value, callback) {
      if (this.upTimeType == 2 && this.formData.isPermanent == '0' && this.formData.upTime && this.formData.downTime && this.formData.upTime >= this.formData.downTime) {
        callback(new Error(rules.message))
      } else {
        callback()
      }
    },
    logoValidator (rules, value, callback) {
      if (this.isPlatform) {
        if (this.formData.logo) {
          callback()
        } else {
          callback(new Error('请选择图片，或者选择复用商户logo'))
        }
      } else if (this.formData.isCopyLogo) {
        callback()
      } else {
        if (this.formData.logo) {
          callback()
        } else {
          callback(new Error('请选择图片，或者选择复用商户logo'))
        }
      }
    },
    cityValidator (rules, value, callback) {
      if (this.cityIds && this.cityIds.length > 0) {
        callback()
      } else {
        callback(new Error('请选择适用范围'))
      }
    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let formData = {
            ...this.formData,
          }
          if (this.isPlatform) {
            formData.scopeOfUseCity = this.cityIds.join(',')
          }
          if (this.upTimeType == 1) {
            formData.isImmediatelyPut = true
          } else {
            formData.isImmediatelyPut = false
            if (this.upTimeType == 3) {
              formData.isDepository = '1'
              formData.status = '0'
            }
          }
          this.$emit('save', formData)
        }
      })
    },
  },
};
</script>
<style lang="scss" scoped>
.form-item-available {
  &.is-error {
    .form-item-available-start.is-error {
      padding-bottom: 20px;
    }
  }
}
</style>

