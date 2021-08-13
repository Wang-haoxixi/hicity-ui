<template>
  <div class="hc-popover-container">
    <span @click="popoverShow = true">
      <slot name="reference"></slot>
    </span>
    <div v-show="popoverShow">
      <div class="hc-popover-shadow" @click="close"></div>
      <div class="hc-popover-content" :style="getPopoverStyle">
        <div class="triangle" :style="{right: clientRect.width / 2 - 4 + 'px'}"></div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      popoverShow: false,
      clientRect: {},
      bodyClientRect: {},
      windowWidth: 0
    }
  },
  computed: {
    getPopoverStyle () {
      return {
        top: this.bodyClientRect.top + this.clientRect.top + this.clientRect.height + 'px',
        right: this.windowWidth - this.bodyClientRect.width - this.bodyClientRect.left + this.bodyClientRect.right - this.clientRect.right + 'px',
        maxHeight: this.bodyClientRect.height - this. clientRect.top - this.clientRect.height - 10 + 'px'
      }
    }
  },
  mounted () {
    window.addEventListener('resize', this.setClientInfo)
    window.addEventListener('scroll', this.setClientInfo)
    setTimeout(() => {
      this.setClientInfo()
    }, 100)
  },
  methods: {
    setClientInfo () {
      this.clientRect = this.$el.getBoundingClientRect()
      this.bodyClientRect = document.body.getBoundingClientRect()
      this.windowWidth = window.innerWidth
    },
    close () {
      this.popoverShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.hc-popover-container {
  position: relative;
  display: inline-block;

  .hc-popover-content {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    position: fixed;
    z-index: 1901;
    right: 0;
    top: 0;
    margin-top: 10px;
    padding: 20px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    .triangle {
      position: absolute;
      top: -8px;
      width: 0px;
      height: 0px;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 8px solid #ebeef5;
      &:after {
        content: '';
        display: block;
        position: absolute;
        left: -4px;
        top: 1px;
        width: 0px;
        height: 0px;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 8px solid #FFFFFF;
      }
    }
  }
  .hc-popover-shadow {
    position: fixed;
    z-index: 1900;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
}
</style>
