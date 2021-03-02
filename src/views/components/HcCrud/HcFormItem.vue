<template>
  <el-input v-if="option.type == 'text' || option.type == 'textarea' || option.type == 'password'"
    :type="option.type"
    :value="value"
    :maxlength="option.maxlength"
    :disabled="disabled"
    :placeholder="option.placeholder || `请输入${option.label}`"
    @input="change"></el-input>
  <el-select v-else-if="option.type == 'select'"
    :value="value"
    :disabled="disabled"
    @change="change">
    <el-option v-for="(item, index) in dicList[option.dicName]" :key="index" :value="item.value" :label="item.label">{{item.label}}</el-option>
  </el-select>
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
    ...mapGetters(['dicList'])
  },
  methods: {
    change (value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style lang="" scoped>
</style>
