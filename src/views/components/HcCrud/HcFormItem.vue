<template>
  <el-input v-if="option.type == 'text' || option.type == 'textarea' || option.type == 'password'"
    :type="option.type"
    :value="value"
    clearable
    :maxlength="option.maxlength"
    :disabled="disabled"
    :placeholder="option.placeholder || `请输入${option.label}`"
    @input="change"></el-input>
  <el-input-number v-else-if="option.type == 'number'"
    :max="option.max || 999999999"
    :min="option.min || 0"
    :value="value"
    clearable
    :maxlength="option.maxlength"
    :disabled="disabled"
    :placeholder="option.placeholder || `请输入${option.label}`"
    @input="change"></el-input-number>
  <el-select v-else-if="option.type == 'select'"
    :value="value"
    clearable
    :disabled="disabled"
    @change="change">
    <el-option v-for="(item, index) in dicData" :key="index" :value="item.value" :label="item.label">{{item.label}}</el-option>
  </el-select>
  <el-radio-group v-else-if="option.type == 'radio'"
    :value="value"
    :disabled="disabled"
    @input="change">
    <el-radio v-for="(item, index) in dicData" :key="index"
      :border="option.border"
      :label="item.value">{{item.label}}</el-radio>
  </el-radio-group>
  <el-date-picker v-else-if="option.type == 'datetime'"
    :value="value"
    clearable
    :format="option.format"
    :value-format="option.valueFormat"
    type="datetime"
    placeholder="选择日期"
    @input="change">
  </el-date-picker>
  <el-date-picker v-else-if="option.type == 'date'"
    :value="value"
    clearable
    :format="option.format"
    :value-format="option.valueFormat"
    type="date"
    placeholder="选择日期"
    @input="change">
  </el-date-picker>
  <el-switch v-else-if="option.type == 'switch'"
    :value="value"
    @change="change"
    :active-value="option.activeValue"
    :active-text="option.activeText || '是'"
    :inactive-value="option.inactiveValue"
    :inactive-text="option.inactiveText || '否'"></el-switch>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    value: {
      required: true
    },
    option: {
      type: Object,
      default: () => {
        return {
          type: 'text'
        }
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      inputType: ['text', 'text-area']
    }
  },
  computed: {
    ...mapGetters(['dicList']),
    dicData () {
      if (this.option.dicData) {
        return this.option.dicData
      } else if (this.option.dicName) {
        return this.dicList[this.option.dicName]
      } else {
        return ''
      }
    },
  },
  methods: {
    change (value) {
      if (this.option.trim) {
        this.$emit('input', value.trim())
      } else {
        this.$emit('input', value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input-number__increase {
  right: 0px !important;
  border-left: 1px solid #dcdfe6 !important;
}
</style>
