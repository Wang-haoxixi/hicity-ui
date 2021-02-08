<template>
  <div class="city-name" :class="{'checked': checked, 'ellipsis': ellipsis}">
    <div v-if="!ellipsis" class="item-name" ref="name">{{name}}</div>
    <el-tooltip  class="item-name" v-else :content="name" placement="top" effect="light">
      <span>{{name}}</span>
    </el-tooltip>
    <div class="item-number" ref="number">{{number}}</div>  
  </div>
</template>

<script>
export default {
  name: 'CityName',
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    number: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      ellipsis: false
    }
  },
  mounted() {
    let width = this.$el.clientWidth
    let nameWidth = this.$refs.name.clientWidth
    let numberWidth = this.$refs.number.clientWidth
    if (width < nameWidth + numberWidth) {
      this.ellipsis = true
    }
  },
}
</script>

<style lang="scss" scoped>
.city-name {
  height: 36px;
  line-height: 36px;
  display: flex;
  color: #666666;
  cursor: pointer;
  &.checked {
    color: #1676FF;
  }
  &.ellipsis {
    .item-name {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .item-name {
    white-space: nowrap;
  }
  // .item-number {
  // }
}
</style>
