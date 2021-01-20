<template>
  <div class="city-open-status">
    <div class="status-pointer" :style="{backgroundColor: status.color}"></div>
    <span class="status-text">{{status.text}}</span>
  </div>
</template>

<script>
export default {
  props: {
    isOpening: {
      type: Boolean,
      required: true
    },
    state: {
      type: String,
      required: true
    }
  },
  computed: {
    status () {
      if (this.isOpening ) {
        if (this.state == 0) {
          return {
            color: '#52C41A',
            text: '已开通'
          }
        } else {
          return {
            color: '#FF4D4F',
            text: '已锁定'
          }
        }
      } else {
        return {
          color: '#BFBFBF',
          text: '未开通'
        }
      }
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.city-open-status {
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  height: 20px;
  .status-pointer {
    height: 6px;
    width: 6px;
    border-radius: 3px;
  }
  .status-text {
    margin-left: 7px;
    height: 20px;
    line-height: 20px;
    color: #666666;
    font-size: 14px;
  }
}
</style>
