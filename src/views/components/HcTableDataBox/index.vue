<template>
  <div class="table-box-container">
    <slot v-if="!empty"></slot>
    <hc-empty-data v-else></hc-empty-data>
    <div class="el-loading-mask" v-show="loading">
      <div class="el-loading-spinner">
        <svg viewBox="25 25 50 50" class="circular">
          <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import HcEmptyData from '@/views/components/HcEmptyData/index'
export default {
  components: { HcEmptyData },
  props: {
    empty: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.table-box-container {
  position: relative;
  min-height: 200px;
}
</style>
