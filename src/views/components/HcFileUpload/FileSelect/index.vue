<template>
  <div class="hc-upload-container" @click="trigger">
    <slot>
      <el-button type="primary">选择文件</el-button>
    </slot>
  </div>
</template>

<script>
export default {
  data () {
    return {
      input: null,
      inputSingle: null
    }
  },
  mounted () {
    let input = document.createElement('input')
    input.type = 'file'
    input.multiple = 'multiple'
    input.onchange = () => {
      this.$emit('file-change', input.files)
      input.value = ''
    }
    this.input = input
  },
  methods: {
    trigger () {
      this.input.click()
    },
    selectFile () {
      return new Promise((resolve, reject) => {
        let inputSingle = document.createElement('input')
        inputSingle.type = 'file'
        inputSingle.onchange = () => {
          resolve(inputSingle.files)
          inputSingle = null
        }
        inputSingle.click()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hc-upload-container {
  display: inline-block;
}
</style>