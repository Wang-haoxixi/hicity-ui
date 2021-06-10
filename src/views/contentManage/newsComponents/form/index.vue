<template>
  <el-form
    ref="form"
    class="dialog-main-tree"
    :model="formData"
    label-width="180px"
    :rules="formRule"
  >
    <template v-if="init">
      <el-form-item label="名称：" prop="officialNewsName">
        <el-input v-model.trim="formData.officialNewsName" maxlength="200"></el-input>
      </el-form-item>

      <el-form-item label="文章来源：" prop="dataType">
        <el-radio-group v-model="formData.dataType" @change="dataTypeChange">
          <el-radio label="1">原创</el-radio>
          <el-radio label="2">转载</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="平台来源：" prop="newsSource" v-if="formData.dataType == '2'">
        <el-input v-model.trim="formData.newsSource" maxlength="200"></el-input>
      </el-form-item>
      <el-form-item label="作者：" prop="author">
        <el-input v-model.trim="formData.author" maxlength="50" :disabled="formData.dataType=='1'"></el-input>
      </el-form-item>
      <el-form-item label="原文链接：" prop="originalLink">
        <el-input v-model.trim="formData.originalLink" maxlength="200"></el-input>
      </el-form-item>

      <el-form-item label="栏目：" prop="officialColumnId">
        <el-select
          style="width: 100%"
          v-model="formData.officialColumnId"
          @change="$refs.form.validateField('officialColumnId')"
          placeholder="请选择"
        >
          <el-option
            v-for="tag in columnsList"
            :key="tag.officialColumnId"
            :label="tag.officialColumnName"
            :value="tag.officialColumnId"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="标签：" prop="labelObj">
        <hc-remote-select v-model="labelObj" value-key="id" label-key="name" is-object :remote-fun="getAllLabel" :show-word="labelShow" multiple :max="3" style="width: 100%" @change="labelChange" @exceed="labelExceed">
          <template v-slot:option="scope">
            <div class="title-select-item">
              <span style="color: #bbbbbb;">#</span>
              <span style="margin-left: 10px;">{{scope.option.name}}</span>
              <span class="new-icon" v-if="typeof scope.option.id === 'string'"> 新</span>
              <span v-else class="number" style="display: inline-block;margin-left: 10px;font-size: 10px;">
                <i class="el-icon-user-solid"></i>
                {{scope.option.numberOfUse}}
              </span>
            </div>
          </template>
        </hc-remote-select>
      </el-form-item>

      <el-form-item v-if="formData.source ? (userType != 3 && userType == formData.source) : (userType == 1 || userType == 2)" label="发布城市：" prop="cityIdList">
        <hc-city-select v-model="formData.cityIdList" :city-id="userInfo.manageCityId" :province="userType == 1"></hc-city-select>
      </el-form-item>
      <el-form-item label="标题图：" prop="titleImage">
        <hc-image-upload v-model="titleImage" :limit="3" :file-size="10" bottom-tip="建议上传图片比例113px*76px，格式jpg/png，图片大小不能超过10M"></hc-image-upload>
      </el-form-item>
      <!-- <el-form-item label="图片展示比例：" prop="imageSizeType">
        <el-radio-group v-model="formData.imageSizeType">
          <el-radio
            v-for="size in dicList['NEWS_IMAGE_SIZE_TYPE']"
            :key="size.id"
            :label="size.value"
            >{{ size.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="详情：" prop="content">
        <hc-quill ref="quill" v-model="quillContent"></hc-quill>
      </el-form-item>
      <el-form-item>
        <el-button @click="handlePreview">预览</el-button>
        <el-button :loading="formLoading" @click="handleDraft">保存草稿</el-button>
        <el-button :loading="formLoading" @click="handleCreate">直接发布</el-button>
      </el-form-item>
    </template>

  </el-form>
</template>

<script>
import {
  getLabelList,
  cityColumn
} from "@/api/cms/news";
import { mapGetters } from "vuex";
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index";
import HcImageUpload from "@/views/components/HcImageUpload/index";
import HcQuill from "@/views/components/HcQuill";
import HcRemoteSelect from "@/views/components/HcForm/HcRemoteSelect/new"
export default {
  components: { HcQuill, HcCitySelect, HcImageUpload, HcRemoteSelect },
  data () {
    return {
      init: false,
      isEdit: false,
      columnsList: [],
      titleImage: [],
      quillContent: {},
      formData: {
        dataType: "1",//文章来源默认为原创
        cityIdList: [],
        officialColumnId: [],
        author: '',
      },
      formRule: {
        officialNewsName: [{required: true, message: '请输入名称', trigger: 'blur'}],
        dataType: [
          { required: true, message: "请选择文章来源", trigger: "change" },
        ],
        newsSource: [
          { required: true, message: "请输入平台来源", trigger: "blur" },
        ],
        officialColumnId: [{required: true, message: '请选择栏目', trigger: 'blur'}],
        imageSizeType: [{required: true, message: '请选择图片展示比例'}],
        cityIdList: [{required: true, message: '请选择城市'}],
        content: [{validator: this.contentValidator, required: true}],
        labelObj: [{validator: this.labelValidator, required: true}],
      },
      formLoading: false,
      labelObj: [],
      labelShow: [],
    }
  },
  props: {
    newsType: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters(["userInfo", "dicList", "userType"]),
  },
  created () {
    cityColumn({ cityId: this.userInfo.manageCityId, type: this.newsType }).then(({ data }) => {
      this.columnsList = data.data.data;
    });
  },
  // beforeDestroy () {
  //   this.init = false
  //   console.log(3123213123)
  // },
  watch: {
    titleImage () {
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.validateField('titleImage')
      })
    },
    quillContent () {
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.validateField('content')
      })
    },
  },
  methods: {
    open (formData, isEdit = false) {
      this.isEdit = isEdit
      this.formData = formData
      this.labelObj = []
      this.labelShow = []
      if (isEdit) {
        this.quillContent = {
          content: formData.officialNewsContent,
          structuredContent: formData.structuredContent,
        };
        let urlList = formData.officialNewsUrlList;
        let titleImage = [];
        for (let i = 0; i < urlList.length; i++) {
          if (urlList[i].type == "image") {
            titleImage.push(urlList[i].newsUrl);
          }
        }
        this.titleImage = titleImage;
        this.labelObj = formData.labelList
        let labelShow = []
        for (let i = 0; i < formData.labelList.length; i++) {
          labelShow.push(formData.labelList[i].name)
        }
        if (this.formData.dataType == '1' && !this.formData.autor) {
          this.formData.author = this.userInfo.realName
        }
        this.labelShow = formData.labelList
      } else {
        if (!this.quillContent || (this.quillContent.content || this.quillContent.structuredContent)) {
          this.quillContent = {
            content: "",
            structuredContent: "",
          };
        }
        if (!this.titleImage || this.titleImage && this.titleImage.length > 0) {
          this.titleImage = []
        }
      }
      this.init = true
    },
    contentValidator (rule, value, callback) {
      if (this.quillContent && this.quillContent.content) {
        callback()
      } else {
        callback(new Error('请输入详情'))
      }
    },
    labelValidator (rule, value, callback) {
      if (!this.labelObj || this.labelObj.length == 0) {
        callback('请添加标签')
      } else if (this.labelObj.length > 3) {
        callback(new Error('标签数量最多3个'))
      } else {
        callback()
      }
    },
    handleCreate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.save(1)
        } else {
          this.formLoading = false
        }
      })
    },
    handleDraft() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.save(0)
        } else {
          this.formLoading = false
        }
      })
    },
    save (state) {

      let formData = this.formData;
      formData.officialNewsContent = this.quillContent.content;
      formData.structuredContent = this.quillContent.structuredContent;
      let titleImage = [];
      for (let i = 0; i < this.titleImage.length; i++) {
        titleImage.push({
          type: "image",
          newsUrl: this.titleImage[i],
          imageSizeType: '1'
        });
      }
      formData.urlList = titleImage;
      let labels = []
      for (let i = 0; i < this.labelObj.length; i++) {
        if (typeof this.labelObj[i].id == "string") {
          labels.push({name: this.labelObj[i].name})
        } else {
          labels.push({
            id: this.labelObj[i].id,
            name: this.labelObj[i].name
          })
        }
      }
      formData.labelList = labels
      this.$emit('save', {
        data: {
          ...formData,
          state,
          imageSizeType: '1'
        },
        isEdit: this.isEdit
      })
    },
    handlePreview() {
      let labelList = []
      for (let i = 0; i < this.labelObj.length; i++) {
        if (typeof this.labelObj[i].id == "string") {
          labelList.push({name: this.labelObj[i].name})
        } else {
          labelList.push({
            id: this.labelObj[i].id,
            name: this.labelObj[i].name
          })
        }
      }
      this.$emit('preview', {
        createByName: this.userInfo.realName,
        ...this.formData,
        officialNewsContent: this.quillContent.content,
        labelList
      })
    },
    dataTypeChange (type) {
      this.$set(this.formData, 'newsSrouce', '')
      if (type == '2') {
        this.formData.author = ''
      } else if (type == '1') {
        this.formData.author = this.userInfo.realName
      }
    },
    labelChange (title) {
      if (title.heatedDebateId && title.heatedDebateId !== 0) {
        this.formData.cityList = []
      } else {
        this.formData.cityList = [this.userInfo.manageCityId]
      }
    },
    labelExceed () {
      this.$message.warning('标签最多添加3个！')
    },
    getAllLabel (name) {
      name = name.trim()
      return new Promise((resolve, reject) => {
        if (!name) {
          resolve([])
        } else if (name.length <= 8) {
          getLabelList({name}).then(({data}) => {
            let hasLabel = false
            let labels = data.data.data
            for (let i = 0; i < labels.length; i++) {
              if (labels[i].name == name.trim()) {
                hasLabel = true
                break
              }
            }
            if (!hasLabel) {
              labels.unshift({
                id: '-' + name,
                name
              })
            }
            resolve(labels)
          })
        } else {
          this.$message.warning('标题名称最多8个字')
          resolve([])
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.title-select-item {
  display: flex;
  align-items: center;
  .new-icon, .number {
    margin-left: 10px;
    display: inline-block;
    padding: 2px 4px;
    line-height: 16px;
    font-size: 10px;
    background-color: #EEEEEE;
  }
  .number {
    color: #999999;
    border-radius: 2px;
  }
}
</style>
