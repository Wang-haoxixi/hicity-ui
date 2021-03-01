<template>
  <el-select
    v-model="selectData"
    filterable
    remote
    :placeholder="placeholder"
    :remote-method="remote"
    @change="selectChange"
    :loading="loading">
    <el-option
      v-for="option in options"
      :key="option.value"
      :label="option.label"
      :value="option.value">
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    showWord: {
      type: String,
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
      this.selectData = val
    }
  },
  methods: {
    remote (query) {
      if (query !== '') {
        this.loading = true;
        this.remoteFun(query).then(data => {
          console.log(data)
          this.options = data
          this.loading = false
        })
      } else {
        this.options = [];
      }
    },
    selectChange (value) {
      this.selectData = value
      this.$emit('input', value)
    }
  }
}
</script>

<style lang="" scoped>
</style>
