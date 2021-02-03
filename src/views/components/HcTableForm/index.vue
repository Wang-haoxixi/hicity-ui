<template>
  <div class="table-form-container">
    <div class="container-header">
      <div class="header-title">{{title}}</div>
      <div class="header-back" v-show="formVisible" @click="goBack">返回</div>
    </div>
    <div v-show="!formVisible">
      <slot></slot>
    </div>
    <div v-if="formVisible">
      <slot name="form"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    formVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },
  methods: {
    goBack () {
      this.$emit('go-back')
    }
  }
}
</script>

<style lang="scss" scoped>
.table-form-container {
  .container-header {
    height: 50px;
    padding-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-title {
      height: 28px;
      line-height: 28px;
      font-size: 20px;
      color: #000000;
    }
    .header-back {
      height: 20px;
      line-height: 20px;
      padding: 10px;
      cursor: pointer;
    }
  }
}
</style>
