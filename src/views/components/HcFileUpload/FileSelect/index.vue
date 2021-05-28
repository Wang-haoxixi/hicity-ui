<template>
  <div class="hc-upload-container" @click="trigger">
    <slot>
      <el-button type="primary">选择文件</el-button>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    accept: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      input: null,
      inputSingle: null
    }
  },
  mounted () {
    let input = document.createElement('input')
    input.type = 'file'
    if (this.multiple) {
      input.multiple = 'multiple'
    }
    input.accept = this.accept
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
        inputSingle.accept = this.accept
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