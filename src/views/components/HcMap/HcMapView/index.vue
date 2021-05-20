<template>
  <div id="hc-map"></div>
</template>

<script>
export default {
  props: {
    address: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      map: null,
    }
  },
  mounted () {
    this.map = new AMap.Map("hc-map", {
      zooms: [5, 22],
      enableMapClick: false
    });
    setTimeout(() => {
      this.setPlace(this.address)
    }, 300)
  },
  watch: {
    address (address) {
      this.setPlace(address)
    }
  },
  methods: {
    setPlace (location) {
      if (location.latitude && location.longitude && this.map) {
        const map = this.map
        map.clearMap();    //清除地图上所有覆盖物
        map.setZoomAndCenter(22, [location.lng || location.longitude, location.lat || location.latitude]); //设置地图中心点
        this.addOverlay({
          latitude: location.lat || location.latitude,
          longitude: location.lng || location.longitude
        })
      }
    },
    addOverlay ({latitude, longitude}) {
      var marker = new AMap.Marker({
        position: new AMap.LngLat(longitude, latitude),
        offset: new AMap.Pixel(-13, -30)
      });
      this.map.add(marker);
    },
  }
}
</script>

<style lang="scss" scoped>
#hc-map{height:300px;width:100%;}
</style>
