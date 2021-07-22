<template>
  <div class="title-button">
    <div class="title">{{title}}</div>
    <div class="button-list">
      <div v-for="(item, index) in buttons" :key="index" class="button-item" :class="{checked: checkedIndex == index}" @click="buttonClick(item, index)">{{item.label}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    buttons: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      checkedIndex: 0,
    }
  },
  methods: {
    buttonClick ({value}, index) {
      this.checkedIndex = index
      this.$emit('change', value)
    },
    reset () {
      this.checkedIndex = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.title-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  .title {
    height: 22px;
    line-height: 22px;
    font-size: 16px;
    color: #87C2F8;
  }
  .button-list {
    height: 28px;
    border: 1px solid #3373AE;
    border-radius: 15px;
    overflow: hidden;
    background: linear-gradient(360deg, #072255 0%, #072855 1%, #08225E 100%);
    .button-item {
      display: inline-block;
      vertical-align: middle;
      height: 28px;
      line-height: 28px;
      width: 40px;
      background: linear-gradient(360deg, #0E2563 0%, #0E2563 1%, #0C4279 100%);
      color: #3373AE;
      font-size: 12px;
      text-align: center;
      margin: 0 1px;
      cursor: pointer;
      &:not(.checked) {
        box-shadow: 0 -2px 2px 0 #053a65,0 2px 2px 0 #053a65;
      }
      &.checked {
        background: linear-gradient(360deg, #072255 0%, #072855 1%, #08225E 100%);
      }
      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
