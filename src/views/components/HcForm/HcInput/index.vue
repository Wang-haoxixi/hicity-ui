<template>
  <el-input ref="hcInput" v-bind="$attrs" :value="inputValueTemp" @input="valueChange" @blur="blur">
    <template v-slot:prefix>
      <slot name="prefix"></slot>
    </template>
    <template v-slot:suffix>
      <slot name="suffix"></slot>
    </template>
    <template v-slot:prepend>
      <slot name="prepend"></slot>
    </template>
    <template v-slot:append>
      <slot name="append"></slot>
    </template>
  </el-input>
</template>

<script>
export default {
  props: {
    value: {
      type: [Number, String],
      default: ''
    },
    decimal: {
      type: Number,
      default: 0,
      validator: function (value) {
        if (value !== '' && value !== null && value !== undefined) {
          return value >= 0
        }
        return false
      }
    },
    min: {
      type: Number,
      default: null
    },
    max: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      inputValue: '',
      inputValueTemp: '',
    }
  },
  created () {
    this.inputValueTemp = this.inputValue = this.getValue(this.value)
    this.$emit('input', (this.inputValue !== '' && this.inputValue !== null && this.inputValue !== undefined) ? parseFloat(this.inputValue) : '')
    // if (this.decimal) {
    // } else {
    //   this.inputValue = this.value
    // }
  },
  watch: {
    value (val) {
      this.inputValueTemp = this.inputValue = this.getValue(val)
      this.$emit('input', (this.inputValue !== '' && this.inputValue !== null && this.inputValue !== undefined) ? parseFloat(this.inputValue) : '')
      // if (this.decimal) {
      // } else {
      //   this.inputValue = val
      // }
    }
  },
  methods: {
    valueChange (val) {
      // if (!this.decimal) {
      //   this.$emit('input', val)
      // } else {
      // }
      this.inputValueTemp = val
      this.inputValue = this.getValue(val)
    },
    blur () {
      this.inputValueTemp = this.inputValue = this.getValue(this.inputValueTemp)
      this.$emit('input', (this.inputValue !== '' && this.inputValue !== null && this.inputValue !== undefined) ? parseFloat(this.inputValue) : '')
      // if (this.decimal) {
      // }
    },
    getValue (value) {
      if (value !== '' && value !== null && value !== undefined) {
        let valueC = 0
        try {
          valueC = parseFloat(value)
          if (isNaN(valueC)) {
            valueC = this.inputValue
          } else if (this.min && valueC < this.min) {
            valueC = this.min.toFixed(this.decimal)
          } else if (this.max && valueC > this.max) {
            valueC = this.max.toFixed(this.decimal)
          } else {
            valueC = valueC.toFixed(this.decimal)
          }
          return valueC
        } catch (e) {
          valueC = this.inputValue
        }
        return valueC
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="" scoped>
</style>
