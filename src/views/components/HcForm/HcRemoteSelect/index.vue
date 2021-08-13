<template>
  <el-select
    v-model="selectData"
    filterable
    remote
    :placeholder="placeholder"
    :remote-method="remote"
    :value-key="valueKey"
    :disabled="disabled"
    @change="selectChange"
    maxlength="10"
    :loading="loading">
    <slot>
      <el-option
        v-for="option in options"
        :key="option.value"
        :label="option[labelKey]"
        :value="isObject ? option : option.value"
        :disabled="disabledItems.includes(option.value)">
        <slot name="option" :option="option"></slot>
      </el-option>
    </slot>
  </el-select>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number, Object],
      default: ''
    },
    showWord: {
      type: [String, Number, Object],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    remoteFun: {
      type: Function,
      required: true
    },
    disabledItems: {
      type: Array,
      default: () => []
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    isObject: {
      type: Boolean,
      default: false
    },
    labelKey: {
      type: String,
      default: 'label'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      options: [],
      selectData: '',
      loading: false,
    }
  },
  created () {
    this.selectData = this.showWord || this.value
  },
  watch: {
    showWord (val) {
      this.selectData = val
    },
    value (val) {
      if (this.options && this.options.length > 0) {
        this.selectData = val
        this.$nextTick(() => {
          this.options = []
        })
      }
      this.$emit('change', val)
    }
  },
  methods: {
    initData (data) {
      this.selectData = data
    },
    remote (query) {
      if (query !== '') {
        this.loading = true;
        this.remoteFun(query).then(data => {
          this.options = data
          this.loading = false
        }, () => {
          this.options = []
        }).finally(() => {
          this.loading = false
        })
      } else {
        this.options = [];
      }
    },
    selectChange (value) {
      this.selectData = value
      this.$emit('input', value)
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i][this.valueKey] === value) {
          this.$emit('label-change', this.options[i][this.labelKey])
          this.$emit('option-change', this.options[i])
          break
        }
      }
    }
  }
}
</script>

<style lang="" scoped>
</style>
