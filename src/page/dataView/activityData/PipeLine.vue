<template>
  <div class="pipe-container" :style="getBoxStyle">
    <div class="percentage" :style="getPercentageStyle"></div>
  </div>
</template>

<script>
export default {
  props: {
    percentage: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: 'linear-gradient(270deg, #28C5FF 0%, #28C5FF 0%, rgba(11, 76, 126, 0.3) 100%)'
    },
    bgColor: {
      type: String,
      default: '#112D5B'
    },
    height: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    getBoxStyle () {
      return {
        height: this.height + 'px',
        width: this.width + 'px',
        backgroundColor: this.bgColor,
        borderRadius: this.height / 2 + 'px',
      }
    },
    getPercentageStyle () {
      return {
        width: this.percentage + '%',
        height: this.height + 'px',
        borderRadius: this.height / 2 + 'px',
        background: this.color
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pipe-container {
  .percentage {
    height: 100%;
    transition: all 0.6s linear;
  }
}
</style>
