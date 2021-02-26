<template>
  <div>
    <el-input @focus="toSelect" :value="address.name" readonly></el-input>
    <el-dialog
      title="地址选择"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="dialogBeforeClose">
      <div>
        <div class="hc-map-search">
          请输入:
          <input type="text" id="hc-map-input" size="20" :value="tempAddress.name" />
        </div>
        <div id="hc-map"></div>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressSelect">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
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
      }
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
    openMap () {
      let _this = this
      this.tempAddress = {
        ...this.address
      }
      var map = new BMap.Map("hc-map", {
        minZoom: 5,
        maxZoom: 24,
        enableMapClick: false
      });
      map.enableScrollWheelZoom(true);

      var geoc = new BMap.Geocoder();
      map.addEventListener('click', handleClick);
      function handleClick (e) {
        console.log(e)
        var pt = e.point;
        geoc.getLocation(pt, function(rs){
          console.log(rs)
            // var addComp = rs.addressComponents;
            // alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
        })
        return false
      }
      function setPlace() {
        map.clearOverlays();    //清除地图上所有覆盖物
        var local = new BMap.LocalSearch(map, { //智能搜索
          onSearchComplete: searchCompleted
        });
        local.search(_this.tempAddress.name);
        function searchCompleted(){
          var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
          _this.tempAddress.longitude = pp.lng
          _this.tempAddress.latitude = pp.lat
          map.centerAndZoom(pp, 18);
          map.addOverlay(new BMap.Marker(pp));    //添加标注
        }
      }
      if (this.tempAddress.name && this.tempAddress.longitude && this.tempAddress.latitude) {
        setPlace()
      } else {
        // 开启SDK辅助定位
        var geolocation = new BMap.Geolocation();
        geolocation.enableSDKLocation();
        geolocation.getCurrentPosition(function(r){
          map.centerAndZoom(new BMap.Point(r.point.lng, r.point.lat), 12) // 初始化地图,设置城市和地图级别。
        });
      }
      //建立一个自动完成的对象
      var ac = new BMap.Autocomplete({ 
        "input" : "hc-map-input",
        "location" : map
      });
      //鼠标点击下拉列表后的事件
      ac.addEventListener("onconfirm", (e) => {
        var _value = e.item.value;
        this.tempAddress.name = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        setPlace()
      });
    },
    toSelect () {
      this.dialogVisible = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.openMap()
        })
      })
    },
    addressSelect () {
      this.$emit('input', {...this.tempAddress})
      this.dialogVisible = false
    },
    dialogBeforeClose () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
#hc-map{height:300px;width:100%;}
.hc-map-search{
  width:100%;
  padding: 10px 0;
  #hc-map-input {
    width: 400px;
  }
}
</style>

<style lang="scss">
.tangram-suggestion-main {
  z-index: 10000;
}
</style>
