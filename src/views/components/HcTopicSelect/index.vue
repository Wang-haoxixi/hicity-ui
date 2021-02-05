<template>
  <div>
    <el-input @focus="toSelect" :value="topicShow" readonly></el-input>
    <el-dialog
      title="话题分类选择"
      :visible.sync="classifyChooseDialogVisible"
      width="90%">
      <div>
        <div class="classify-box">
          <div v-for="classify in classifyList" :key="classify.id" class="classify-item" @click="selectClassify(classify.id)">
            <div class="classify-item-name">{{classify.classifyName}}</div>
            <el-image class="classify-item-cover" :src="classify.imageUrl"></el-image>
          </div>
        </div>
        <div class="pagination-box">
          <el-pagination
            style="display: inline-block"
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page="page.currentPage"
            :page-sizes="[10, 20, 30,, 40, 50, 100]"
            background
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total">
          </el-pagination>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="classifyChooseDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="话题选择"
      :visible.sync="topicChooseDialogVisible"
      width="70%"
    >
      <div class="classify-list">
        <div v-for="topic in relativeTopicList"
          :key="topic.id"
          class="classify-list-item"
          @click="handleSelect(topic)">
          {{ topic.topicsName }}
        </div>
      </div>
      <div slot="footer">
        <el-button @click="topicChooseDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
  
</template>

<script>
import { getClassifyList, getTopicList } from '@/api/cms/travel'
export default {
  props: {
    topicName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      topicShow: '',
      classifyList: [],
      page: {
        currentPage: 1,
        pageSize: 20,
        total: 0,
      },
      classifyChooseDialogVisible: false,
      relativeTopicList: [],
      topicChooseDialogVisible: false,
    }
  },
  created () {
    this.topicShow = this.topicName
  },
  watch: {
    topicName (value) {
      this.topicShow = value
    }
  },
  methods: {
    getList (cb) {
      this.tableLoading = true
      getClassifyList({
        current: this.page.currentPage,
        size: this.page.pageSize,
      }).then(({data}) => {
        if (data.code === 0) {
          this.classifyList = data.data.data.records
          this.page.total = data.data.data.total
        }
      }).finally(() => {
        this.tableLoading = false
        cb && cb()
      })
    },
    currentChange (current) {
      this.page.currentPage = current
      this.getList()
    },
    sizeChange (size) {
      this.page.pageSize = size
      this.page.currentPage = 1
      this.getList()
    },
    toSelect () {
      this.getList(() => {
        this.classifyChooseDialogVisible = true
      })
    },
    selectClassify (classifyId) {
      getTopicList({
        queryType: 1,
        classifyId
      }).then(({data}) => {
        this.relativeTopicList = data.data.data.records
        this.topicChooseDialogVisible = true;
      })
    },
    handleSelect (topic) {
      this.classifyChooseDialogVisible = false
      this.topicChooseDialogVisible = false
      this.topicShow = topic.topicsName
      this.$emit('input', [topic.id])
    }
  }
}
</script>

<style lang="scss" scoped>
.classify-box {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 250px);
  grid-template-rows: repeat(auto-fill, auto);
  grid-gap: 24px;
  .classify-item {
    border-radius: 2px;
    border: 1px solid #E9E9E9;
    padding: 16px;
    .classify-item-name {
      height: 22px;
      line-height: 22px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-align: center;
    }
    .classify-item-cover {
      margin-top: 16px;
      height: 138px;
      width: 218px;
    }
    .classify-item-topic-view {
      margin-top: 12px;
      height: 34px;
      line-height: 34px;
      border: 1px solid #D9D9D9;
      border-radius: 5px;
      color: #666666;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
    }
    .classify-item-option {
      margin-top: 16px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      .mune-item {
        font-size: 14px;
      }
    }
  }
}

.pagination-box {
  padding: 10px 20px;
  margin: 15px 0 10px;
  text-align: right;
}

.classify-list {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  .classify-list-item {
    margin-bottom: 10px;
    height: 30px;
    line-height: 30px;
    padding: 0 15px;
    border: 1px solid #e9e9e9;
    border-radius: 4px;
    margin-right: 20px;
  }
}
</style>
