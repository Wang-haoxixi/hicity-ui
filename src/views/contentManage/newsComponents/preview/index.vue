<template>
  <!-- <div class="preview-container"> -->
    <hc-preview v-if="preview" @close="preview = false">
      <div class="preview-title">
        {{detail.officialNewsName || '资讯标题'}}
      </div>
      <div class="author-time">
        <div class="author" v-if="detail.author">
          <div v-if="detail.dataType == '1'" class="original">原创</div>
          <div class="author-name">{{detail.author}}</div>
        </div>
        <span class="time">{{detail.updateTime ? getDateDiff(detail.updateTime, 'MM-dd') : '' }}</span>
      </div>
      <div class="preview-content">
        <div class="preview-content-inner" v-html="detail.officialNewsContent || '内容'"></div>
      </div>

      <div v-if="detail.dataType == '2'" class="resource">
        原文{{detail.author && `由${detail.author}`}}发布于{{detail.newsSource}},由<span style="color: #5F5F5F">{{detail.createByName}}</span>转载至超能平台，未经许可，禁止转载。内容、版权、和其他问题，请在30日内与本平台联系，我们将在第一时间处理。
      </div>
      <div v-if="detail.dataType == '1'" class="resource">
        由<span style="color: #5F5F5F">{{detail.createByName}}</span>发布于超能平台，未经许可，禁止转载。
      </div>

      <div v-if="detail.labelList && detail.labelList.length > 0" class="label-list">
        <div v-for="label in detail.labelList" :key="label.id" class="label-item" @tap="goLabelNews(label)">{{label.name}}</div>
      </div>

      <div class="browse">
        帖子浏览数&nbsp;&nbsp;&nbsp;{{detail.browseNum || 0}}
      </div>
    </hc-preview>
  <!-- </div> -->
</template>

<script>
import { getDateDiff } from '@/util/date'
import HcPreview from "@/views/components/HcPreview/index"
export default {
  components: { HcPreview },
  data () {
    return {
      preview: false,
      detail: {}
    }
  },
  methods: {
    getDateDiff,
    open (data) {
      this.detail = data
      this.preview = true
    }
  }
}
</script>

<style lang="scss" scoped>

.preview-title {
  color: #272727;
  font-size: 20px;
  line-height: 28px;
  font-weight: bold;
}

.author-time {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 20px;
  color: #999999;
  .author {
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
    height: 18px;
    line-height: 18px;
    .original {
      margin-right: 8px;
      height: 18px;
      line-height: 18px;
      width: 34px;
      border-radius: 2px;
      background-color: #EDEDED;
      text-align: center;
      font-size: 11px;
      color: #5F5F5F;
    }
    .author-name {
      height: 18px;
      line-height: 18px;
      font-size: 13px;
    }
  }
  .time {
    font-size: 12px;
  }
}

.preview-content {
  /deep/ .quill-image {
    width: 100% !important;
  }
  /deep/ .quill-image-box {
    width: 100% !important;
  }
  /deep/ img {
    width: 100% !important;
  }
}
.preview-content-inner {
  margin-top: 24px;
  line-height: 28px;
  font-size: 17px;
  color: #272727;
  word-wrap:break-word;
  margin-top: 24px;
}

.resource {
  margin-top: 24px;
  line-height: 17px;
  font-size: 12px;
  color: #999999;
}

.label-list {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 12px;
  .label-item {
    height: 34px;
    line-height: 34px;
    border-radius: 4px;
    border: 1px solid #EDEDED;
    text-align: center;
    color: #272727;
    background-color: #F5F7F8;
    font-size: 13px;
  }
}

.browse {
  margin-top: 16px;
  height: 17px;
  line-height: 17px;
  color: #999999;
  font-size: 12px;
}
</style>
