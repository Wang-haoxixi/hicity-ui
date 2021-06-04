<template>
  <el-select
    v-model="selectData"
    filterable
    remote
    :placeholder="placeholder"
    :remote-method="remote"
    :value-key="valueKey"
    :disabled="disabled"
    :multiple="multiple"
    maxlength="10"
    :loading="loading"
    @change="selectChange">
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
      type: [String, Number, Object, Array],
      default: ''
    },
    showWord: {
      type: [String, Number, Object, Array],
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
    },
    multiple: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: undefined
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
    if (this.isObject) {
      this.options = this.selectData
      this.$nextTick(() => {
        this.options = []
      })
    }
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
    }
  },
  methods: {
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
      if (this.multiple && this.max && value.length > this.max) {
        this.selectData = this.value
        this.$emit('exceed')
      } else {
        this.selectData = value
        this.$emit('input', value)
        this.$emit('change', value)
        if (this.isObject) {
          let options = null
          let labels = null
          if (this.multiple) {
            options = []
            labels = []
            for (let i = 0; i < this.options.length; i++) {
              let option = this.options[i]
              for (let j = 0; j < value.length; j++) {
                if (option[this.valueKey] === value[j][this.valueKey]) {
                  options.push(option)
                  labels.push(option[this.labelKey])
                  break
                }
              }
            }
            this.$emit('label-change', labels)
            this.$emit('option-change', options)
          } else {
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
    }
  }
}
</script>

<style lang="" scoped>
</style>
