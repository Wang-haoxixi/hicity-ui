<template>
  <el-popover
    placement="left"
    trigger="click">
    <template v-slot:reference>
      <el-button type="text" size="mini" @click="codeView">查看</el-button>
    </template>
    <template v-slot>
      <div class="qr-image-box" :class="{loading: loading}">
        <el-image v-if="codeUrl" class="qr-image" :src="codeUrl"></el-image>
        <div class="qr-image-refresh" @click="refreshCode">
          <i class="el-icon-refresh-right"></i>
        </div>
        <div class="qr-image-loading">
          <i class="el-icon-loading"></i>
        </div>
      </div>
    </template>
  </el-popover>
</template>

<script>
import { getMerchantQrCode } from "@/api/mms/merchant"
export default {
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      codeUrl: '',
      loading: false,
    }
  },
  methods: {
    refreshCode () {
      this.loading = true
      getMerchantQrCode({id: this.id}).then(({data}) => {
        this.codeUrl = data.data.data
      }).finally(() => {
        this.loading = false
      })
    },
    codeView () {
      if (!this.codeUrl) {
        this.loading = true
        getMerchantQrCode({id: this.id}).then(({data}) => {
          this.codeUrl = data.data.data
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.qr-image-box {
  position: relative;
  height: 200px;
  width: 200px;
  &:not(.loading):hover {
    .qr-image-refresh {
      visibility: visible;
    }
  }
  &.loading {
    .qr-image-loading {
      visibility: visible;
    }
  }
  .qr-image {
    height: 100%;
    width: 100%;
  }
  .qr-image-refresh, .qr-image-loading {
    position: absolute;
    visibility: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    cursor: pointer;
    font-size: 40px;
    color: #FFFFFF;
  }
}
</style>
