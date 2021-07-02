<template>
  <div>
    <div class="line-item">
      <div class="line-item-title">投诉编号：</div>
      <div class="line-item-content">{{detail.prosecuteNum}}</div>
    </div>
    <div class="line-item">
      <div class="line-item-title">投诉板块：</div>
      <div class="line-item-content">{{detail.module}}</div>
    </div>
    <div class="line-item">
      <div class="line-item-title">投诉时间：</div>
      <div class="line-item-content">{{detail.createTime}}</div>
    </div>
    <div class="line-item">
      <div class="line-item-title">投诉人姓名：</div>
      <div class="line-item-content">{{detail.prosecuteUserName}}</div>
    </div>
    <div class="line-item">
      <div class="line-item-title">投诉人账户：</div>
      <div class="line-item-content">{{detail.prosecuteUserAccount}}</div>
    </div>
    <div class="line-item">
      <div class="line-item-title">投诉类型：</div>
      <div class="line-item-content">{{detail.prosecuteReasonDesc}}</div>
    </div>
    <div class="line-item">
      <div class="line-item-title">投诉原因：</div>
      <div class="line-item-content">{{detail.prosecuteReasonDetails}}</div>
    </div>
    <div class="line-item">
      <div class="line-item-title">投诉对象：</div>
      <div class="line-item-content">
        <div class="content-block">
          <div class="line-item">
            <div class="line-item-title">{{prosecuteInfo.title}}：</div>
            <div class="line-item-content">{{detail.dataTitle}}</div>
          </div>
          <div class="line-item">
            <div class="line-item-title">{{prosecuteInfo.content}}：</div>
            <div class="line-item-content">{{detail.dataContent}}</div>
          </div>
          <div v-if="detail.dataImageList && detail.dataImageList.length > 0">
            <el-image v-for="(image, index) in detail.dataImageList" :key="index" :src="image" :preview-src-list="detail.dataImageList"></el-image>
          </div>
        </div>
      </div>
    </div>
    <div v-if="detail.prosecuteStatus == 1" class="line-item">
      <div class="line-item-title">处理结果：</div>
      <div class="line-item-content">
        <div v-if="detail.processorList && detail.processorList.length > 0" class="content-block">
          <div v-for="(processor, index) in detail.processorList" :key="index" class="content-block-item">
            <div class="line-item">
              <div class="line-item-title">处理人：</div>
              <div class="line-item-content">{{processor.processorUserName}}</div>
            </div>
            <div class="line-item">
              <div class="line-item-title">处理时间：</div>
              <div class="line-item-content">{{processor.processorTime}}</div>
            </div>
            <div class="line-item">
              <div class="line-item-title">处理内容：</div>
              <div class="line-item-content">{{getHandlingContent(processor.resultOfHandling)}}</div>
            </div>
          </div>
          <div class="line-item" style="padding-bottom: 10px">
            <div class="line-item-title"><el-button type="primary" size="small" @click="isModify = true">修改</el-button></div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="detail.prosecuteStatus == 0 || isModify" class="line-item">
      <div class="line-item-title">投诉处理：</div>
      <div class="line-item-content">
        <el-form ref="form" :model="formData">
          <el-form-item>
            <el-radio-group v-model="formData.resultOfHandling">
              <div v-for="(item, index) in prosecuteInfo.types" :key="index" class="type-radio">
                <el-radio :label="item.value">{{item.label}}</el-radio>
                <hc-input v-if="item.value == 4 && formData.resultOfHandling == 4" v-model="formData.bannedDays" :decimal="0" :min="1" maxlength="5" style="width: 200px;">
                  <div slot="append">天</div>
                </hc-input>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-form>
          <el-checkbox v-model="formData.batchHandle">投诉管理列表中，针对本投诉对象的未处理记录，全部按照此方式</el-checkbox>
        </el-form>
      </div>
    </div>
    <div class="line-item">
      <div class="line-item-title"></div>
      <div class="line-item-content">
        <el-button v-if="detail.prosecuteStatus == 0 || isModify" type="primary" @click="submit">确 定</el-button>
        <el-button>返 回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { handleProsecute } from '@/api/cms/prosecute'
import HcInput from "@/views/components/HcForm/HcInput/index"
export default {
  components: { HcInput },
  props: {
    detail: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      isModify: false,
      formData: {
        resultOfHandling: ''
      }
    }
  },
  computed: {
    prosecuteInfo () {
      if (this.detail.prosecuteType == 'travel') {
        return {
          title: '游记标题',
          content: '游记内容',
          types: [
            {
              label: '隐藏当前数据',
              value: 1
            },
            {
              label: '标记为已处理',
              value: 0
            }
          ]
        }
      } else if (this.detail.prosecuteType == 'heatedDebate') {
        return {
          title: '热议标题',
          content: '热议内容',
          types: [
            {
              label: '隐藏当前数据',
              value: 1
            },
            {
              label: '标记为已处理',
              value: 0
            }
          ]
        }
      } else if (this.detail.prosecuteType == 'user') {
        return {
          title: '用户姓名',
          content: '用户账户',
          types: [
            {
              label: '锁定',
              value: 2
            },
            {
              label: '标记为已处理',
              value: 0
            }
          ]
        }
      } else if (this.detail.prosecuteType == 'circle') {
        return {
          title: '圈子名称',
          content: '圈子id',
          types: [
            {
              label: '封禁自定义天数',
              value: 4
            },
            {
              label: '永久封禁',
              value: 3
            },
            {
              label: '标记为已处理',
              value: 0
            }
          ]
        }
      } else if (this.detail.prosecuteType == 'officialNews') {
        return {
          title: '资讯标题',
          content: '资讯内容',
          types: [
            {
              label: '隐藏当前数据',
              value: 1
            },
            {
              label: '标记为已处理',
              value: 0
            }
          ]
        }
      } else if (this.detail.prosecuteType == 'recruit') {
        return {
          title: '职位名称',
          content: '职位id',
          types: [
            {
              label: '隐藏当前数据',
              value: 1
            },
            {
              label: '标记为已处理',
              value: 0
            }
          ]
        }
      } else if (this.detail.prosecuteType == 'comment') {
        return {
          title: '店铺名称',
          content: '评论内容',
          types: [
            {
              label: '隐藏当前数据',
              value: 1
            },
            {
              label: '标记为已处理',
              value: 0
            }
          ]
        }
      }
    }
  },
  methods: {
    getHandlingContent (type) {
      const types = [
        {
          label: '标记为已处理',
          value: 0
        },
        {
          label: '隐藏当前数据',
          value: 1
        },
        {
          label: '锁定',
          value: 2
        },
        {
          label: '永久封禁',
          value: 3
        },
        {
          label: '封禁自定义天数',
          value: 4
        }
      ]
      for (let i = 0; i < types.length; i++) {
        if (type == types[i].value) {
          return types[i].label
        }
      }
    },
    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          handleProsecute({
            prosecuteId: this.detail.prosecuteId,
            ...this.formData
          }).then(({data}) => {
            this.$emit('save')
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.line-item {
  width: 100%;
  display: flex;
  align-items: flex-start;
  &:not(:first-child) {
    margin-top: 15px;
  }
  .line-item-title {
    height: 36px;
    line-height: 36px;
    text-align: right;
    flex: 100px 0 0;
  }
  .line-item-content {
    margin-left: 20px;
    line-height: 36px;
    flex: 150px 1 1;
    .content-block {
      background-color: #F3F3F3;
      border-radius: 5px;
      .content-block-item {
        border-bottom: 1px solid #DDDDDD;
      }
    }
  }
}
.type-radio {
  height: 36px;
  display: flex;
  align-items: center;
}
</style>
