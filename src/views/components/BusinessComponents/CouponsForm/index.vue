<template>
  <el-form
    ref="form"
    :model="formData"
    label-width="150px"
    :rules="formRule">
    <el-form-item label="券名称：" prop="name">
      <el-input v-model.trim="formData.name" maxlength="15" :disabled="isEdit" placeholder="品牌+商品类型+金额+代金券+商铺名称，如食品 西朵曼生日蛋糕100元代金券 雁峰区希朵曼"></el-input>
    </el-form-item>
    <el-form-item label="券门类：" prop="category">
      <el-select v-model="formData.category" :disabled="isEdit">
        <el-option v-for="item in dicList['COUPONS_CATEGORY']" :key="item.value" :label="item.label" :value="item.value - 0">{{item.label}}</el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="优惠券类型：">
      <el-select value="1" disabled>
        <el-option label="平台券" value="1">平台券</el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="使用说明：" prop="instructions">
      <el-input type="textarea" v-model.trim="formData.instructions" :autosize="{minRows: 6, maxRows: 10}" maxlength="200" style="width: 400px;"
      placeholder="例如：
美食满300元-100元（酒水、饮料、槟榔、香烟除外）；
本券不兑现，不找零，不可与本店其他优惠活动同时享受；
发票事宜请以商家为准；
本券需要预约，请提前与商家进行预约；"
      ></el-input>
    </el-form-item>
    <el-form-item label="领取门槛：" prop="receiveType">
      <el-radio-group v-model="formData.receiveType" @change="upTimeTypeChange" :disabled="isEdit">
        <div class="radio-line">
          <el-radio label="3">普通券（不限制领取和使用）</el-radio>
        </div>
        <div class="radio-line">
          <el-radio label="1">新人券（限新用户可领）</el-radio>
        </div>
        <div class="radio-line">
          <el-radio label="2">首单券（所有用户可领，限平台（区域）首单消费可用）</el-radio>
        </div>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="isPlatform" label="适用范围：" prop="cityIds">
      <hc-city-select v-model="cityIds" :city-id="userInfo.manageCityId" :disabled="isEdit"></hc-city-select>
    </el-form-item>

    <el-form-item label="券种类：" prop="deductionType">
      <el-radio-group v-model="formData.deductionType" :disabled="isEdit">
        <el-radio label="3">满减现金券</el-radio>
        <el-radio label="2">立减现金券</el-radio>
        <!-- <el-radio label="4">满减折扣券</el-radio>
        <el-radio label="5">立减折扣券</el-radio> -->
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="formData.deductionType == 3 || formData.deductionType == 4" label="满减条件金额：" prop="conditionPrice">
      <hc-input v-model="formData.conditionPrice" :decimal="1" :min="0.1" :max="9999.9" maxlength="6" style="width: 200px;" :disabled="isEdit">
        <div slot="append">元</div>
      </hc-input>
    </el-form-item>
    <el-form-item v-if="formData.deductionType == 2 || formData.deductionType == 3" label="优惠金额：" prop="deductionPrice">
      <hc-input v-model="formData.deductionPrice" :decimal="1" :min="0.1" :max="9999.9" maxlength="6" style="width: 200px;" :disabled="isEdit">
        <div slot="append">元</div>
      </hc-input>
    </el-form-item>
    <el-form-item v-if="formData.deductionType == 4 || formData.deductionType == 5" label="优惠折扣：" prop="discountRatio">
      <hc-input style="width: 200px;" v-model="formData.discountRatio" :decimal="1" maxlength="10" :max="9.99" :min="0.1" :disabled="isEdit">
      <div slot="append">折</div>
    </hc-input>
    </el-form-item>

    <el-form-item label="是否全品类可用：" prop="isAllCategory">
      <el-radio-group v-model="formData.isAllCategory" :disabled="isEdit">
        <div class="radio-line">
          <el-radio :label="true">全部商品可用</el-radio>
        </div>
        <div class="radio-line">
          <el-radio :label="false">限部分商品可用</el-radio>
        </div>
        <div v-if="formData.isAllCategory === false" style="margin-top: 10px">
          <el-form-item label="使用特殊说明：" prop="specialRemarks" label-width="120px">
            <el-input v-model="formData.specialRemarks" maxlength="100" :disabled="isEdit"></el-input>
          </el-form-item>
        </div>
      </el-radio-group>
    </el-form-item>


    <el-form-item label="有效期：" prop="isReceiveInvalid">
      <el-radio-group v-model="formData.isReceiveInvalid" @change="upTimeTypeChange" :disabled="isEdit">
        <div class="radio-line">
          <el-radio :label="false">普通券（一段时间内有效）</el-radio>
        </div>
        <div class="radio-line">
          <el-radio :label="true">限时券（领取后固定时长失效）</el-radio>
        </div>
        <template>
          <el-form-item prop="availableTime" style="padding-bottom: 20px;">
            <div style="margin-top: 10px">
              <el-form-item prop="availableStartTime" label-width="120px" label="有效开始时间：" style="margin-bottom: 20px;">
                <el-date-picker
                  v-model="formData.availableStartTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @change="availableTimeChange"
                  placeholder="选择有效开始时间"
                  :disabled="isEdit">
                </el-date-picker>
              </el-form-item>
              <el-form-item prop="availableEndTime" label-width="120px" label="有效结束时间：" style="margin-bottom: 20px;">
                <el-date-picker
                  v-model="formData.availableEndTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @change="availableTimeChange"
                  placeholder="选择有效结束时间"
                  :disabled="isEdit">
                </el-date-picker>
              </el-form-item>
              <el-form-item v-if="formData.isReceiveInvalid" label-width="110px" label="领取后有效期：">
                <hc-input v-model="formData.receiveInvalidDay" :decimal="0" :min="1" :max="9999" maxlength="7" style="width: 200px;" :disabled="isEdit">
                  <div slot="append">天</div>
                </hc-input>
              </el-form-item>
            </div>
          </el-form-item>
        </template>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="发券数量：" prop="supply">
      <el-input-number v-model="formData.supply" :min="1" :max="99999999"></el-input-number>
    </el-form-item>

    <el-form-item v-if="isEdit" label="已领数量：">
      {{formData.receivedNum || 0}}
    </el-form-item>



    <!-- <el-form-item label="上架时间：" prop="upTime">
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
      </el-radio-group>
    </el-form-item>
    <el-form-item label="下架时间：" prop="downTime">
      <el-date-picker
        v-model="formData.downTime"
        type="datetime"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择下架时间">
      </el-date-picker>
    </el-form-item> -->
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
    isEdit: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(date){
          let zero = new Date().setHours(0, 0, 0, 0);
          if(date.getTime() >= zero){
              return false;
          }
          return true;
        }
      },
      formData: {
      },
      upTimeType: '',
      downTimeType: '',
      cityIds: [],
      formRule: {
        name: [{required: true, message: '请输入券名称', trigger: 'blur'}],
        deductionPrice: [{validator: this.deductionPriceValidator, required: true, trigger: 'blur'}],
        conditionPrice: [{validator: this.conditionPriceValidator, required: true, trigger: 'blur'}],
        category: [{required: true, message: '请选择券门类', trigger: 'change'}],
        supply: [
          {required: true, message: '请输入发券数量', trigger: 'blur'},
          {validator: this.supplyValidator, trigger: 'blur'}
        ],
        receiveType: [{required: true, message: '请选择领取门槛', trigger: 'change'}],
        deductionType: [{required: true, message: '请选择券种类', trigger: 'change'}],
        isAllCategory: [{required: true, message: '请选择是否全品类可用', trigger: 'change'}],
        specialRemarks: [{required: true, message: '请输入特殊说明', trigger: 'blur'}],
        isReceiveInvalid: [{required: true, message: '请选择有效期类型', trigger: 'change'}],
        availableTime: [
          {validator: this.availableTimeDiffValidator, trigger: 'blur'},
        ],
        availableStartTime: [
          {required: true, message: '请输入可用开始时间', trigger: 'blur'},
        ],
        availableEndTime: [
          {required: true, message: '请输入可用结束时间', trigger: 'blur'},
        ],
        instructions: [{required: true, message: '请输入使用说明', trigger: 'blur'}],
        limitNum: {required: true, message: '请输入用户可领个数', trigger: 'blur'},
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
        scopeOfUseCity: '',
        isPermanent: '0',
        isCopyLogo: false,
        upTime: '',
        downTime: '',
        availableStartTime: '',
        availableEndTime: '',
        ...initForm
      }
      this.upTimeType = '2'
      if (this.formData.isDepository == '1') {
        this.formData.upTime = ''
        this.formData.downTime = ''
        this.formData.availableStartTime = ''
        this.formData.availableEndTime = ''
      }
      let cityIds = this.formData.scopeOfUseCity ? this.formData.scopeOfUseCity.split(',') : []
      for (let i = 0; i < cityIds.length; i++) {
        cityIds.splice(i, 1, parseInt(cityIds[i]))
      }
      this.cityIds = cityIds
      formRule && (this.formRule = formRule)
    },
    upTimeTypeChange () {
      this.formData.upTime = ''
      this.$refs.form.clearValidate('upTime')
    },
    availableTimeChange () {
      this.$refs.form.validateField('availableTime')
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
    supplyValidator (rules, value, callback) {
      if (this.formData.receivedNum && this.formData.supply < this.formData.receivedNum) {
        callback(new Error('供应量不能小于已领数量'))
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
    cityValidator (rules, value, callback) {
      if (this.cityIds && this.cityIds.length > 0) {
        callback()
      } else {
        callback(new Error('请选择适用范围'))
      }
    },
    handleSave() {
      this.$refs.form.validate(valid => {
        this.formData.upTime = this.formData.availableStartTime
        this.formData.downTime = this.formData.availableEndTime
        if (valid) {
          let formData = {
            ...this.formData,
          }
          formData.upTime = formData.availableStartTime
          formData.downTime = formData.availableEndTime
          if (this.isPlatform) {
            formData.scopeOfUseCity = this.cityIds.join(',')
          }
          if (this.upTimeType == 1) {
            formData.isImmediatelyPut = true
            formData.status = '1'
          } else {
            formData.isImmediatelyPut = false
            formData.status = '0'
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
.radio-line {
  display: flex;
  align-items: center;
  height: 36px;
}
</style>

