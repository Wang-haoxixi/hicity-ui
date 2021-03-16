<template>
  <div class="text-line-container" :class="{'ellipsis': ellipsis}" :style="containerStyle">
    <div v-if="!ellipsis" class="item-text" ref="text">{{text}}</div>
    <el-tooltip  class="item-text" v-else :content="text" placement="top" effect="light" :style="tipStyle">
      <span>{{text}}</span>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'HcTextLine',
  props: {
    text: {
      type: String,
      default: ''
    },
    lines: {
      type: Number,
      default: 1
    },
    lineHeight: {
      type: Number,
      default: 36
    },
    textAlign: {
      type: String,
      default: 'left'
    }
  },
  data () {
    return {
      ellipsis: false
    }
  },
  computed: {
    containerStyle () {
      return {
        lineHeight: this.lineHeight + 'px',
        justifyContent: this.textAlign == 'left' ? 'flex-start' : this.textAlign == 'right' ? 'flex-end' : 'center',
        textAlign: this.textAlign
      }
    },
    tipStyle () {
      return {
        lineClamp: this.lines
      }
    }
  },
  updated () {
    let textHeight = this.$refs.text.clientHeight
    if (this.lineHeight * this.lines < textHeight) {
      this.ellipsis = true
    }
  },
  mounted() {
    let textHeight = this.$refs.text.clientHeight
    if (this.lineHeight * this.lines < textHeight) {
      this.ellipsis = true
    }
  },
}
</script>

<style lang="scss" scoped>
.text-line-container {
  line-height: 36px;
  display: flex;
  color: #666666;
  &.ellipsis {
    .item-text {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
  }
  .item-text {
    white-space: wrap;
  }
}
</style>
