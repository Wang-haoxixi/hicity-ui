<template>
  <el-dialog
    title="地址选择"
    :visible.sync="dialogVisible"
    width="600px"
    :before-close="dialogBeforeClose">
    <div>
      <el-form-item label="请输入：" label-width="70px">
        <hc-map-search :value="searchAddress" @select="handleSelect"></hc-map-search>
      </el-form-item>
      <div id="hc-map"></div>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addressSelect">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import HcMapSearch from '../HcMapSearch/index'
export default {
  components: { HcMapSearch },
  data () {
    return {
      searchAddress: '',
      map: null,
      autoComplete: null,
      tempAddress: {},
      city: {},
      dialogVisible: false,
      geocoder: new AMap.Geocoder()
    }
  },
  beforeDestroy () {
    this.map && this.map.destroy();
  },
  methods: {
    open(address = {}, city = {}) {
      this.tempAddress = {...address}
      this.city = {...city}
      this.dialogVisible = true
      this.$nextTick(() => {
        setTimeout(() => {
          if (!this.map) {
            this.mapInit(address)
          } else if (address.name && address.latitude && address.longitude) {
            this.searchAddress = address.name
            this.setPlace(address)
          } else {
            this.pointInit()
          }
        })
      })
    },
    handleSelect (point) {
      if (point.location.lng && point.location.lat) {
        let address = {
          name: point.district + point.name,
          lat: point.location.lat,
          lng: point.location.lng
        }
        this.setPlace(address, true)
      } else {
        this.map.setCity(point.adcode, () => {
          this.$message.success('已切换到' + point.name)
        })
      }
    },
    mapInit (address) {
      const _this = this
      const map = this.map = new AMap.Map("hc-map", {
        zooms: [5, 22],
        enableMapClick: false
      });

      map.on("click", (e) => {
        let location = e.lnglat
        var lnglat = [location.lng || location.longitude, location.lat || location.latitude]
        this.geocoder.getAddress(lnglat, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            this.city = {
              city: result.regeocode.addressComponent.city || result.regeocode.addressComponent.province || '',
              district: result.regeocode.addressComponent.district
            }
            this.tempAddress.longitude = location.lng || location.longitude
            this.tempAddress.latitude = location.lat || location.latitude
            this.searchAddress = this.tempAddress.name = result.regeocode.formattedAddress
            this.setPlace(location)
          }
        })
      })

      if (address.name && address.latitude && address.longitude) {
        setTimeout(() => {
          this.searchAddress = address.name
          this.setPlace(address)
        }, 300)
      } else {
        this.pointInit()
      }
    },
    pointInit (point) {
      if (point) {
        map.setZoomAndCenter(11, [point.lng, point.lat]);
      } else {
        const map = this.map
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 10000,          //超过10秒后停止定位，默认：5s
          buttonPosition:'RB',    //定位按钮的停靠位置
          buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
        });
        geolocation.getCurrentPosition(function(status, result){
          if(status=='complete'){
            onComplete(result)
          }else{
            onError(result)
          }
        });
        //解析定位结果
        function onComplete({addressComponent}) {
          map.setCity(addressComponent.adcode)
        }
        //解析定位错误信息
        function onError(data) {
          document.getElementById('status').innerHTML='定位失败'
          document.getElementById('result').innerHTML = '失败原因排查信息:'+data.message;
        }
      }
    },
    addOverlay ({latitude, longitude}) {
      var marker = new AMap.Marker({
        position: new AMap.LngLat(longitude, latitude),
        offset: new AMap.Pixel(-13, -30)
      });
      this.map.add(marker);
    },
    setPlace (location, setData = false) {
      const map = this.map
      map.clearMap();    //清除地图上所有覆盖物
      map.setZoomAndCenter(22, [location.lng || location.longitude, location.lat || location.latitude]); //设置地图中心点
      this.addOverlay({
        latitude: location.lat || location.latitude,
        longitude: location.lng || location.longitude
      })
      if (setData) {
        var lnglat = [location.lng || location.longitude, location.lat || location.latitude]
        this.geocoder.getAddress(lnglat, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            this.city = {
              city: result.regeocode.addressComponent.city || result.regeocode.addressComponent.province || '',
              district: result.regeocode.addressComponent.district
            }
          }
        })

        this.tempAddress.longitude = location.lng || location.longitude
        this.tempAddress.latitude = location.lat || location.latitude
        this.searchAddress = this.tempAddress.name = location.name
      }
    },
    addressSelect () {
      this.$emit('select', {address : {...this.tempAddress}, city: this.city})
      this.dialogVisible = false
    },
    dialogBeforeClose (next) {
      next()
    }
  }
}
</script>

<style lang="scss" scoped>
#hc-map{height:300px;width:100%;}
</style>
