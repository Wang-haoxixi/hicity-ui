<template>
  <div>
    <basic-container>
      <div class="title">基本信息</div>

      <el-form ref="baseFormDataRef" :model="baseFormData" label-width="120px">
        <!-- 所属城市 -->
        <el-form-item label="所属城市：">
          <el-select
            v-model="baseFormData.city"
            placeholder="请选择已开通的城市"
          >
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <!-- 活动标题 -->
        <el-form-item label="活动标题">
          <el-input
            v-model="baseFormData.title"
            placeholder="不小于5个字，不超过40个字"
          ></el-input>
        </el-form-item>

        <!-- 举报时间 -->
        <el-form-item label="举报时间：">
          <el-date-picker
            style="margin-right: 15px"
            v-model="baseFormData.beginTime"
            type="datetime"
            placeholder="选择开始日期"
          >
          </el-date-picker>
          <el-date-picker
            v-model="baseFormData.endTime"
            type="datetime"
            placeholder="选择结束日期"
          >
          </el-date-picker>
        </el-form-item>

        <!-- 活动类型 -->
        <el-form-item label="活动类型：">
          <el-select v-model="baseFormData.type" placeholder="请选择类型">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <!-- 活动海报 -->
        <el-form-item label="活动海报：">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-success="handlePosterSuccess"
          >
            <el-button size="small">点击上传</el-button>
          </el-upload>
          <div class="poster-box"></div>
        </el-form-item>

        <!-- 活动地址 -->
        <el-form-item label="活动地址：">
          <div class="addressbox">
            <el-select
              style="width: 200px"
              v-model="baseFormData.address"
              placeholder="请选择"
            >
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>

            <el-input
              style="width: 600px; margin: 0 10px"
              v-model="baseFormData.title"
              placeholder="请输入活动地址"
            ></el-input>

            <el-checkbox v-model="onLine">线上举办</el-checkbox>
          </div>
        </el-form-item>

        <!-- 活动分类 -->
        <el-form-item label="活动分类：">
          <el-select v-model="baseFormData.classify" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <!-- 活动标签 -->
        <el-form-item label="活动标签：">
          <em style="margin-right: 10px" v-if="!baseFormData.tags">暂无标签</em>
          <el-tag v-else>标签一</el-tag>
          <el-button v-if="isEdit" @click="isEdit = false" class="el-icon-edit"
            >编辑</el-button
          >
          <el-autocomplete
            class="inline-input"
            placeholder="请输入内容"
            v-else
            v-model="state1"
            :fetch-suggestions="querySearch"
            @select="handleSelect"
            @blur="isEdit = true"
          ></el-autocomplete>
        </el-form-item>

        <!-- 活动亮点 -->
        <el-form-item label="活动亮点：">
          <el-input
            placeholder="请填写几句活动核心亮点，便于分享摘要以及百度等搜索引擎搜索（150个字）"
            type="textarea"
            v-model="baseFormData.lightspot"
          ></el-input>
        </el-form-item>

        <!-- 活动详情 -->
        <el-form-item label="活动详情：">
          <!-- <el-input v-model="baseFormData.eventDetail"></el-input> -->
          <hc-quill v-model="quillContent"></hc-quill>
        </el-form-item>

        <!-- 活动附件 -->
        <el-form-item label="活动附件：">
          <!-- <el-button>点击上传</el-button> -->
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="handleChange"
            :file-list="fileList"
          >
            <el-button size="small">点击上传</el-button>
          </el-upload>
        </el-form-item>

        <!-- 设置票种 -->
        <el-form-item label="设置票种："></el-form-item>

        <!-- 底部按钮 -->
        <el-form-item label="活动附件：">
          <el-button>发布活动</el-button>
          <el-button>保存草稿</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </basic-container>
  </div>
</template>

<script>
import HcQuill from "@/views/components/HcQuill";
export default {
  components: { HcQuill },
  data() {
    return {
      // 基本信息数据
      baseFormData: {
        city: "",
        title: "",
        beginTime: "",
        endTime: "",
        type: "",
        poster: "", //海报
        address: "",
        classify: "",
        tags: "",
        lightspot: "", //亮点
        eventDetail: "",
        accessorys: "", //附件
        ticket: "", //票种
      },
      // 线上举办
      onLine: "",
      // 是否编辑标签
      isEdit: true,
      quillContent: {
        content: "",
        structuredContent: "",
      },
      // 活动附件
      fileList: [],
    };
  },
  methods: {
    // 海报上传成功回调
    handlePosterSuccess(res) {
      console.log("海报上传成功回调", res);
    },
    // 返回输入建议
    querySearch() {},
    // 选择活动标签
    handleSelect(item) {
      console.log(item);
    },
    // 活动附件-文件状态改变时的钩子
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  padding-bottom: 5px;
  font-size: 18px;
  font-weight: 400;
}
.poster-box {
  width: 400px;
  height: 240px;
  border: 1px solid #ccc;
  margin-top: 20px;
  border-radius: 5px;
}
.addressbox {
  display: flex;
}
</style>