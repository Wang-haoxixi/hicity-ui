<template>
  <div>
    <el-input @focus="toSelect()" :value="address.name" readonly></el-input>
    <hc-map-box ref="hcMapBox" @select="addressSelect"></hc-map-box>
  </div>
</template>

<script>
import HcMapBox from '../HcMapBox/index'
export default {
  components: { HcMapBox },
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          name: '',
          longitude: '',
          latitude: '',
        }
      }
    },
  },
  data () {
    return {
      dialogVisible: false,
      address: {
        name: '',
        longitude: '',
        latitude: '',
      },
      initAddress: {
        name: '',
        longitude: '',
        latitude: '',
      },
      tempAddress: {
        name: '',
        longitude: '',
        latitude: '',
      },
    }
  },
  created () {
    this.address = {
      ...this.initAddress,
      ...this.value
    }
  },
  watch: {
    value (val) {
      this.address = {
        ...this.initAddress,
        ...val
      }
    }
  },
  methods: {
    toSelect () {
      this.$refs.hcMapBox.open({
          ...this.address
      })
    },
    addressSelect ({address, city}) {
      this.$emit('city-change', city)
      this.$emit('change', address)
      this.$emit('input', address)
    },
    dialogBeforeClose () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
