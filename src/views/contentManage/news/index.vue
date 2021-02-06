<template>
  <basic-container>
    <hc-table-form
      :title="title"
      :formVisible="publish"
      @go-back="publish = false">
      <avue-crud
        ref="crud"
        :option="tableOption"
        :page="page"
        :table-loading="tableLoading"
        :data="tableData"
        @on-load="getList"
        @refresh-change="handleRefreshChange"
        style="margin-left: 0;"
      >
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
        <template slot="menu" slot-scope="scope">
          <template v-if="userType <= scope.row.source">
            <el-button type="text" size="mini" @click="toUpdate(scope.row)"
              >编辑</el-button
            >
            <el-button type="text" size="mini" @click="toDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </template>
      </avue-crud>
      <template slot="form">
        <el-form
          ref="form"
          class="dialog-main-tree"
          :model="formData"
          label-width="180px"
          :rules="formRule"
        >
          <el-form-item label="名称：" prop="title">
            <el-input v-model="formData.title"></el-input>
          </el-form-item>
          <el-form-item label="标签：" prop="lableIdList">
            <el-select
              style="width: 100%"
              v-model="formData.lableIdList"
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
          <el-form-item v-if="formData.source ? userType == formData.source : (userType == 1 || userType == 2)" label="发布城市：" prop="cityIdList">
            <!-- <el-select style="width: 100%" v-model="formData.cityIdList" multiple filterable  placeholder="请选择城市" @change="cityChange">
              <el-option v-for="city in allCity" :key="city.id" :label="city.regionName" :value="city.id"></el-option>
            </el-select> -->
            <hc-city-select v-model="formData.cityIdList" :city-id="userInfo.manageCityId"></hc-city-select>
          </el-form-item>
          <el-form-item label="标题图：">
            <hc-image-upload v-model="titleImage" :limit="50"></hc-image-upload>
          </el-form-item>
          <el-form-item label="图片展示比例：">
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
            <!-- <el-input type="textarea" v-model="quillContent.content"></el-input>
            <el-input type="textarea" v-model="quillContent.structuredContent"></el-input> -->
            <hc-quill ref="quill" v-model="quillContent"></hc-quill>
          </el-form-item>
          <el-form-item>
            <!-- <el-button @click="preview">预览</el-button> -->
            <el-button @click="handleDraft">保存草稿</el-button>
            <el-button @click="handleCreate">直接发布</el-button>
          </el-form-item>
        </el-form>
      </template>
      
    </hc-table-form>


    <hc-city-box ref="hcCityBox"></hc-city-box>

    <el-dialog
      title="关联标签"
      :visible.sync="tagViewDialogVisible"
      width="70%"
    >
      <div class="tag-list">
        <div
          v-for="tag in newsTagList"
          :key="tag.lableId"
          class="tag-list-item"
        >
          {{ tag.lable }}
        </div>
      </div>
      <div slot="footer">
        <el-button @click="tagViewDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import { tableOption } from "./const";
import { mapGetters } from "vuex";
import {
  getNewsList,
  addNews,
  getNewsDetail,
  updateNews,
  newsOpenList,
  deleteNews,
  newsEnable,
} from "@/api/cms/news";
import { getAllTagList } from "@/api/tms/city";
import { adminCityList } from "@/api/admin/city";
import HcQuill from "@/views/components/HcQuill";
import HcCityBox from "@/views/components/HcCity/HcCityBox/index";
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index";
import HcImageUpload from "@/views/components/HcImageUpload/index";
import HcTableForm from "@/views/components/HcTableForm/index";

export default {
  name: "SysUser",
  components: { HcQuill, HcCityBox, HcCitySelect, HcImageUpload, HcTableForm },
  data() {
    return {
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false, // 是否倒序
      },
      tableLoading: false,
      tableData: [],
      formData: {},
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
        title: [{required: true, message: '请输入名称'}],
        lableIdList: [{required: true, message: '请选择标签', trigger: 'blur'}],
        cityIdList: [{required: true, message: '请选择城市'}],
        content: [{validator: this.contentValidator, required: true}]
      }
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
  watch: {},
  created() {
    this.init();
  },
  methods: {
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
    getList(page = this.page, params) {
      this.tableLoading = true;
      let form = {
        current: page.currentPage,
        size: page.pageSize,
      };
      getNewsList(form)
        .then(({ data }) => {
          this.tableData = data.data.data.records;
          this.page.total = data.data.data.total;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    toCreate() {
      this.formData = {
        cityIdList: [],
        closeAllowed: "0",
      };
      this.quillContent = {
        content: "",
        structuredContent: "",
      };
      this.titleImage = [];
      if (this.userType == 1 || this.userType == 2) {
        this.formData.cityIdList = [this.userInfo.manageCityId];
      }
      this.publish = true;
      this.publishType = "add";
    },
    handleCreate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.save(1)
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
            message: "发布成功",
            type: "success",
            duration: 2000,
          });
          this.getList();
        });
      } else {
        updateNews({ ...formData, state: 1 }).then(({ data }) => {
          this.publish = false;
          this.$notify({
            title: "成功",
            message: "发布成功",
            type: "success",
            duration: 2000,
          });
          this.getList();
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
    handleUpdate() {},
    handleDraft() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.save(0)
        }
      })
    },
    preview() {
      // this.$refs.quill.getData()
      // console.log()
    },
    toDelete({ newsId }) {
      this.$confirm("是否确认删除该条咨询?", "警告", {
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
              message: "发布成功",
              type: "success",
              duration: 2000,
            });
            this.getList();
          });
        })
        .catch(function () {});
    },
    handleStart(row) {
      let havEnable = row.havEnable ? 0 : 1;
      newsEnable({
        newsId: row.newsId,
        havEnable,
        cityId: this.userInfo.manageCityId,
      }).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success("操作成功");
          this.getList();
        }
      });
    },
    handleRefreshChange() {
      this.getList(this.page);
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
</style>

