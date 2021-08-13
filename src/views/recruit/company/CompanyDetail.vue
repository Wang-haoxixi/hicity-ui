<template>
  <div class="detail-container">
    <el-image class="logo" :src="detail.companyLogo"></el-image>
    <div class="info">
      <div class="info-item">
        <div class="item-title">行业：</div>
        <div class="item-content">{{detail.industryInvolved}}</div>
      </div>
      <div class="info-item">
        <div class="item-title">简介：</div>
        <div class="item-content">{{detail.companyProfile}}</div>
      </div>
      <div class="info-item">
        <div class="item-title">相册：</div>
        <div class="item-content">
          <el-image v-for="(item, index) in detail.photosList" :key="index" class="photos" :src="item" :preview-src-list="detail.photosList"></el-image>
        </div>
      </div>
      <div class="info-item">
        <div class="item-title">福利：</div>
        <div class="item-content">
          {{welfares.join('，')}}
        </div>
      </div>
      <div class="info-item">
        <div class="item-title">地址：</div>
        <div class="item-content">{{detail.companyAddress}}</div>
      </div>
      <div class="info-item">
        <div class="item-title">网址：</div>
        <div class="item-content">{{detail.companyWebsite}}</div>
      </div>
      <div class="info-item">
        <el-button type='text' @click="toRecruit">&gt;职位管理&gt;</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { offShelf, audit } from "@/api/recruit/position"
export default {
  props: {
    detail: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
    }
  },
  computed: {
    welfares () {
      let welfares = []
      let welfareList = this.detail.welfareList || []
      for (let i = 0; i < welfareList.length; i++) {
        welfares.push(welfareList[i].welfareName)
      }
      return welfares
    }
  },
  methods: {
    toRecruit () {
      this.$store.commit('SET_RECRUIT_COMPANY_ID', this.detail.id)
      setTimeout(() => {
        this.$store.commit('SET_RECRUIT_COMPANY_ID', undefined)
      }, 3000)
      this.$router.push({
        path: '/recruit/position/index'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-container {
  display: flex;
  align-items: flex-start;
  .logo {
    flex: 250px 0 0;
    height: 150px
  }
  .info {
    margin-left: 20px;
    flex: 200px 1 1;
    .info-item {
      display: flex;
      .item-title {
        flex: 60px 0 0;
        height: 40px;
        line-height: 40px;
        font-weight: bold;
      }
      .item-content {
        line-height: 40px;
      }
    }
  }
  .photos {
    height: 200px;
    width: 200px;
    margin: 0 20px 20px 0;
  }
}
</style>
