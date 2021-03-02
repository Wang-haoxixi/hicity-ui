<template>
  <div class="hc-single-view" :class="{'ellipsis': ellipsis}">
    <div v-if="!ellipsis" class="item-view" ref="view">{{text}}</div>
    <el-tooltip  class="item-view" v-else :content="text" placement="top" effect="light">
      <span>{{text}}</span>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'HcSingleView',
  props: {
    text: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      ellipsis: false
    }
  },
  mounted() {
    this.setWidth()
  },
  methods: {
    setWidth () {
      let width = this.$el.clientWidth
      let textWidth = this.$refs.view.clientWidth
      this.ellipsis = width < textWidth
    }
  }
}
</script>

<style lang="scss" scoped>
.hc-single-view {
  width: 100%;
  height: 36px;
  line-height: 36px;
  display: flex;
  color: #666666;
  &.ellipsis {
    .item-view {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .item-view {
    white-space: nowrap;
  }
  // .item-number {
  // }
}
</style>
