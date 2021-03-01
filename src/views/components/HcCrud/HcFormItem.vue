<template>
  <el-input v-if="option.type == 'text' || option.type == 'textarea'" :value="value" @input="change"></el-input>
  <el-select v-else-if="option.type == 'select'" :value="value" @change="change">
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
