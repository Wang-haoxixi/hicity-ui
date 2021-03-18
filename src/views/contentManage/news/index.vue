<template>
  <basic-container>
    <hc-table-form
      :title="title"
      :formVisible="publish"
      @go-back="goBack">
      <hc-crud ref="hcCrud" :option="tableOption" :fetchListFun="fetchListFun" @toUpdate="toUpdate" @toDelete="toDelete">
        <template v-slot:title="scope">
          <hc-text-line :text="scope.row.title" :lines="3" :line-height="20"></hc-text-line>
        </template>
        <template slot="menuLeft">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="toCreate"
            >新建</el-button>
        </template>
        <template slot="tagList" slot-scope="scope">
          <el-button type="text" size="mini" @click="tagView(scope.row)"
            >查看</el-button
          >
        </template>
        <template slot="cityList" slot-scope="scope">
          <el-button type="text" size="mini" @click="cityView(scope.row.newsId)"
            >查看</el-button
          >
        </template>
        <!-- <template slot="menu" slot-scope="scope">
          <template v-if="userType <= scope.row.source">
            <el-button type="text" size="mini" @click="toUpdate(scope.row)"
              >编辑</el-button
            >
            <el-button type="text" size="mini" @click="toDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </template> -->
      </hc-crud>
      <template slot="form">
        <el-form
          ref="form"
          class="dialog-main-tree"
          :model="formData"
          label-width="180px"
          :rules="formRule"
        >
          <el-form-item label="名称：" prop="title">
            <el-input v-model="formData.title" maxlength="200"></el-input>
          </el-form-item>
          <el-form-item label="标签：" prop="lableIdList">
            <el-select
              style="width: 100%"
              v-model="formData.lableIdList"
              @change="$refs.form.validateField('lableIdList')"
              multiple
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="tag in tagList"
                :key="tag.tagId"
                :label="tag.name"
                :value="tag.tagId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="formData.source ? (userType != 3 && userType == formData.source) : (userType == 1 || userType == 2)" label="发布城市：" prop="cityIdList">
            <hc-city-select v-model="formData.cityIdList" :city-id="userInfo.manageCityId"></hc-city-select>
          </el-form-item>
          <el-form-item label="标题图：" prop="titleImage">
            <hc-image-upload v-model="titleImage" :limit="50"></hc-image-upload>
          </el-form-item>
          <el-form-item label="图片展示比例：" prop="imageSizeType">
            <el-radio-group v-model="formData.imageSizeType">
              <el-radio
                v-for="size in dicList['NEWS_IMAGE_SIZE_TYPE']"
                :key="size.id"
                :label="size.value"
                >{{ size.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="详情：" prop="content">
            <hc-quill ref="quill" v-model="quillContent"></hc-quill>
          </el-form-item>
          <el-form-item>
            <el-button @click="handlePreview">预览</el-button>
            <el-button :loading="formLoading" @click="handleDraft">保存草稿</el-button>
            <el-button :loading="formLoading" @click="handleCreate">直接发布</el-button>
          </el-form-item>
        </el-form>
        <hc-preview v-if="preview" @close="preview = false">
          <div class="preview-title">
            {{formData.title || '资讯标题'}}
          </div>
          <div class="preview-time">发布时间：{{dateFormat(new Date())}}</div>
          <div class="preview-content" v-html="quillContent.content || '内容'"></div>
        </hc-preview>
      </template>
    </hc-table-form>

    <hc-city-box ref="hcCityBox"></hc-city-box>

    <el-dialog
      title="关联标签"
      :visible.sync="tagViewDialogVisible"
      width="70%"
    >
      <template>
        <div v-if="newsTagList && newsTagList.length > 0" class="tag-list">
          <div
            v-for="tag in newsTagList"
            :key="tag.lableId"
            class="tag-list-item"
          >
            {{ tag.lable }}
          </div>
        </div>
        <hc-empty-data v-else></hc-empty-data>
      </template>
      <div slot="footer">
        <el-button @click="tagViewDialogVisible = false">返 回</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import { tableOption } from "./const";
import { mapGetters } from "vuex";
import { dateFormat } from "@/util/date"
import {
  getNewsList,
  addNews,
  getNewsDetail,
  updateNews,
  newsOpenList,
  deleteNews,
} from "@/api/cms/news";
import { getAllTagList } from "@/api/tms/city";
import { adminCityList } from "@/api/admin/city";
import HcQuill from "@/views/components/HcQuill";
import HcCityBox from "@/views/components/HcCity/HcCityBox/index";
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index";
import HcImageUpload from "@/views/components/HcImageUpload/index";
import HcTableForm from "@/views/components/HcTableForm/index"
import HcEmptyData from "@/views/components/HcEmptyData/index"
import HcPreview from "@/views/components/HcPreview/index"
import HcTextLine from "@/views/components/HcTextLine/index";

export default {
  components: { HcQuill, HcCityBox, HcCitySelect, HcImageUpload, HcTableForm, HcEmptyData, HcPreview, HcTextLine },
  data() {
    return {
      formData: {
        cityIdList: [],
        lableIdList: []
      },
      tagList: [],
      allCity: [],
      publish: false,
      publishType: "",
      cityList: [],
      allCityList: [],
      initCityList: [],
      quillContent: {
        content: "",
        structuredContent: "",
      },
      cityChooseDialogVisible: false,
      newsTagList: [],
      tagViewDialogVisible: false,
      titleImage: [],
      formRule: {
        title: [{required: true, message: '请输入名称', trigger: 'blur'}],
        lableIdList: [{required: true, message: '请选择标签', trigger: 'blur'}],
        titleImage: [{validator: this.imageValidator, required: true, trigger: 'blur'}],
        imageSizeType: [{required: true, message: '请选择图片展示比例'}],
        cityIdList: [{required: true, message: '请选择城市'}],
        content: [{validator: this.contentValidator, required: true}]
      },
      preview: false,
      formLoading: false,
    };
  },
  computed: {
    ...mapGetters(["permissions", "userInfo", "dicList", "userType"]),
    tableOption() {
      return tableOption(this.userType == 1 || this.userType == 2);
    },
    title () {
      if (!this.publish) {
        return '城市新闻'
      } else {
        if (this.publishType == 'add') {
          return '城市新闻-新增'
        } else {
          return '城市新闻-编辑'
        }
      }
    }
  },
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
  created() {
    this.init();
  },
  methods: {
    goBack () {
      this.quillContent = {
        content: "",
        structuredContent: ""
      }
      this.formData = {
        cityIdList: [],
        lableIdList: []
      }
      this.titleImage = []
      this.publish = false
    },
    dateFormat,
    imageValidator (rule, value, callback) {
      if (this.titleImage && this.titleImage.length > 0) {
        callback()
      } else {
        callback(new Error('请添加标题图'))
      }
    },
    contentValidator (rule, value, callback) {
      if (this.quillContent && this.quillContent.content) {
        callback()
      } else {
        callback(new Error('请输入详情'))
      }
    },
    init() {
      getAllTagList({ cityId: this.userInfo.manageCityId }).then(({ data }) => {
        this.tagList = data.data.data;
      });
      adminCityList().then(({ data }) => {
        this.allCity = data.data.data;
        this.allCity.unshift({
          id: 1,
          regionName: "全国",
        });
      });
    },
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        getNewsList(params).then((res) => {
          let records = res.data.data.data.records;
          let total = this.total = res.data.data.data.total;
          resolve({
            records,
            page: {
              total
            }
          })
        }, (error) => {
          reject(error)
        });
      })
    },
    toCreate() {
      this.publish = true;
      this.publishType = "add";
      this.$nextTick(() => {
        this.formData = {
          cityIdList: [this.userInfo.manageCityId],
          closeAllowed: "0",
          lableIdList: []
        }
        if (!this.quillContent || (this.quillContent.content || this.quillContent.structuredContent)) {
          this.quillContent = {
            content: "",
            structuredContent: "",
          };
        }
        if (!this.titleImage || this.titleImage && this.titleImage.length > 0) {
          this.titleImage = []
        }
      })
    },
    handleCreate() {
      this.formLoading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          this.save(1)
        } else {
          this.formLoading = false
        }
      })
    },
    save (state) {
      let formData = this.formData;
      formData.content = this.quillContent.content;
      formData.structuredContent = this.quillContent.structuredContent;
      let titleImage = [];
      for (let i = 0; i < this.titleImage.length; i++) {
        titleImage.push({
          type: "image",
          newsUrl: this.titleImage[i],
        });
      }
      formData.urlList = titleImage;
      if (this.publishType == "add") {
        addNews({ ...formData, state }).then(({ data }) => {
          this.publish = false;
          this.$notify({
            title: "成功",
            message: state ? "发布成功！" : "保存成功！",
            type: "success",
            duration: 2000,
          });
          this.$refs.hcCrud.refresh();
        }).finally(() => {
          this.formLoading = false
        });
      } else {
        updateNews({ ...formData, state }).then(({ data }) => {
          this.publish = false;
          this.$notify({
            title: "成功",
            message: state ? "编辑成功！" : "保存成功！",
            type: "success",
            duration: 2000,
          });
          this.$refs.hcCrud.refresh();
        }).finally(() => {
          this.formLoading = false
        });
      }
    },
    toUpdate({ newsId }) {
      getNewsDetail({ newsId }).then(({ data }) => {
        this.formData = data.data.data;
        this.quillContent = {
          content: data.data.data.content,
          structuredContent: data.data.data.structuredContent,
        };
        let urlList = data.data.data.newsUrlList;
        let titleImage = [];
        for (let i = 0; i < urlList.length; i++) {
          if (urlList[i].type == "image") {
            titleImage.push(urlList[i].newsUrl);
          }
        }
        this.titleImage = titleImage;
        this.publish = true;
        this.publishType = "edit";
      });
    },
    handleDraft() {
      this.formLoading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          this.save(0)
        } else {
          this.formLoading = false
        }
      })
    },
    handlePreview() {
      this.preview = true
      // this.$refs.quill.getData()
      // console.log()
    },
    toDelete({ newsId }) {
      this.$confirm("是否确认删除该条城市新闻?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteNews({
            newsId,
            cityId: this.userInfo.manageCityId,
          }).then(({ data }) => {
            this.publish = false;
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000,
            });
            this.$refs.hcCrud.refresh()
          });
        })
        .catch(function () {});
    },
    cityView(newsId) {
      newsOpenList({ newsId }).then(({ data }) => {
        this.$refs.hcCityBox.open(this.userInfo.manageCityId, data.data.data || [], true)
      });
    },
    tagView(row) {
      this.newsTagList = row.lableList;
      this.tagViewDialogVisible = true;
    },
  },
};
</script>
<style lang="scss" scope>
.user {
  height: 100%;

  &__tree {
    padding-top: 3px;
    padding-right: 20px;
  }

  &__main {
    .el-card__body {
      padding-top: 0;
    }
  }
}
.tag-list {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  .tag-list-item {
    margin-bottom: 10px;
    height: 30px;
    line-height: 30px;
    padding: 0 15px;
    border: 1px solid #e9e9e9;
    border-radius: 4px;
    margin-right: 20px;
  }
}

.form-title {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  .form-title-name {
    height: 60px;
    line-height: 60px;
    font-size: 20px;
  }
}

.preview-title {
  line-height: 26px;
  color: #333333;
  font-size: 18px;
}
.preview-time {
  margin-top: 10px;
  height: 17px;
  line-height: 17px;
  color: #999999;
  font-size: 12px;
}
.preview-content {
  margin-top: 24px;
  /deep/ .quill-image, .quill-image-box, img {
    width: 100% !important;
  }
}
</style>

