<template>
  <div class="hc-popover-container">
    <slot name="reference" @click="haha"></slot>
    <div class="hc-popover-content" :style="getPopoverStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      clientRect: {}
    }
  },
  computed: {
    getPopoverStyle () {
      return {
        top: this.clientRect.top + this.clientRect.height + 'px',
        right: this.clientRect.right + 'px'
      }
    }
  },
  mounted () {
    this.height = this.$el.offsetHeight
    this.width = this.$el.offsetWidth
    this.clientRect = this.$el.getBoundingClientRect()
    console.log(this.clientRect)
  }
}
</script>

<style lang="scss" scoped>
.hc-popover-container {
  position: relative;
  display: inline-block;

  .hc-popover-content {
    position: fixed;
    z-index: 1000;
    right: 0;
    top: 0;
    margin-top: 10px;
    padding: 20px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    &:before {
      content: '';
      position: absolute;

    }
  }
}
</style>
