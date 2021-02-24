<template>
  <div class="hc-preview-container">
    <div class="container-shadow"></div>
    <div class="content-box">
      <div class="content-box-overflow">
        <div class="content-inner">
          <div class="content">
            <slot></slot>
          </div>
        </div>
        <div class="btn-close">
          <i class="el-icon-circle-close" @click="handleClose"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    handleClose () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.hc-preview-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100000;
  .container-shadow {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
    background-color: rgba(0, 0, 0, 0.6)
  }
  .content-box {
    position: relative;
    .content-box-overflow {
      height: 667px;
      width: 375px;
      overflow: hidden;
      background-color: #ffffff;
      .content-inner {
        height: 667px;
        width: 400px;
        overflow-y: scroll;
        .content {
          box-sizing: border-box;
          width: 375px;
          padding: 16px;
        }
      }
    }
    .btn-close {
      position: absolute;
      bottom: -50px;
      left: 0;
      right: 0;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 40px;
      color: #DDDDDD;
      i {
        cursor: pointer;
      }
    }
  }
}
</style>
