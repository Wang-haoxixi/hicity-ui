<template>
  <basic-container>
    <!-- 官方发布 -->
    <hc-table-form :title="title" :formVisible="!isShow" @go-back="backClisk">
      <hc-crud
        :option="tableOption"
        :fetchListFun="fetchListFun"
        @toUpdate="toUpdate"
        @toDelete="toDelete"
        ref="hcCrud"
      >
        <template v-slot:searchItems="scope">
          <div class="search-item">
            <div style="white-space: nowrap;">状态：</div>
            <el-select v-model="scope.searchForm.state">
              <el-option label="所有" :value="undefined">所有</el-option>
              <el-option label="草稿" value='0'>正常</el-option>
              <el-option label="已生效" value='1'>已生效</el-option>
              <el-option label="已失效" value='2'>已失效</el-option>
            </el-select>
          </div>
          <div class="search-item">
            <div style="white-space: nowrap;">城市/地区：</div>
            <hc-city-select v-model="scope.searchForm.cityId" :city-id="userInfo.manageCityId" single></hc-city-select>
          </div>
        </template>
        <template v-slot:officialNewsName="scope">
          <hc-text-line :text="scope.row.officialNewsName" :lines="3" :line-height="20"></hc-text-line>
        </template>
        <div slot="menuLeft">
          <el-button
            @click="toCreate"
            icon="el-icon-plus"
            type="primary"
            size="mini"
            >新建</el-button>
          <!-- <el-button
            @click="toPublish"
            size="mini"
            >快捷发布</el-button> -->
        </div>
        <template slot="cityList" slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="check(scope.row.officialNewsId)"
            >查看</el-button
          >
        </template>
      </hc-crud>

      <template slot="form">
        <el-form
          ref="addformRef"
          :model="addform"
          :rules="rules"
          label-width="120px"
        >
          <!-- 名称 -->
          <el-form-item label="名称" prop="officialNewsName">
            <el-input
              v-model.trim="addform.officialNewsName"
              maxlength="200"
            ></el-input>
          </el-form-item>

          <el-form-item label="文章来源：" prop="dataType">
            <el-radio-group v-model="addform.dataType" @change="dataTypeChange">
              <el-radio label="1">原创</el-radio>
              <el-radio label="2">转载</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="平台来源：" prop="newsSource" v-if="addform.dataType == '2'">
            <el-input v-model.trim="addform.newsSource" maxlength="200"></el-input>
          </el-form-item>
          <el-form-item label="作者：" prop="author">
            <el-input v-model.trim="addform.author" maxlength="50" :disabled="addform.dataType=='1'"></el-input>
          </el-form-item>

          <el-row>
            <el-col :span="12">
              <!-- 栏目 -->
              <el-form-item label="栏目" prop="officialColumnId">
                <el-select
                  v-model="addform.officialColumnId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in columnData"
                    :key="index"
                    :label="item.officialColumnName"
                    :value="item.officialColumnId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- 发布城市 平台可见 -->
              <el-form-item
                v-if="
                  addform.source
                    ? userType == addform.source
                    : userType == 1 || userType == 2
                "
                label="发布城市"
                prop="cityIdList"
              >
                <hc-city-select
                  v-model="addform.cityIdList"
                  :city-id="userInfo.manageCityId"
                ></hc-city-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 标题图 -->
          <el-form-item label="标题图" prop="titleImage">
            <hc-image-upload v-model="titleImage" :limit="1"></hc-image-upload>
            <!-- <el-upload
              :action="uploadPicUrl"
              list-type="picture-card"
              :on-remove="handleRemove"
              :on-success="handlePicSuccess"
              :file-list="fileList"
              :headers="headersOpt"
              :before-upload="onBeforeUpload"
              :on-exceed="handleExceed"
              :limit="9"
              accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PNG,.GIF,.BMP"
            >
              <i class="el-icon-plus"></i>
            </el-upload> -->
          </el-form-item>

          <!-- 图片展示比例 -->
          <el-form-item
            label="图片展示比例"
            label-width="120px"
            prop="imageSizeType"
          >
            <el-radio-group v-model="addform.imageSizeType">
              <el-radio
                v-for="(item, index) in dicList.NEWS_IMAGE_SIZE_TYPE"
                :key="index"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>

          <!-- 详情 -->
          <el-form-item label="详情" prop="content">
            <hc-quill v-model="quillContent"></hc-quill>
          </el-form-item>

          <!-- 事件按钮 -->
          <el-form-item>
            <el-button @click="handlePreview">预览</el-button>
            <el-button @click="handleDraft" :loading="formLoading">保存草稿</el-button>
            <el-button @click="handleCreate" :loading="formLoading">直接发布</el-button>
          </el-form-item>
        </el-form>
        <hc-preview v-if="preview" @close="preview = false">
          <div class="preview-title">
            {{ addform.officialNewsName || "资讯标题" }}
          </div>
          <div class="preview-time">发布时间：{{ dateFormat(new Date()) }}</div>
          <div
            class="preview-content"
            v-html="getContent(quillContent.content) || '内容'"
          ></div>
        </hc-preview>
      </template>
    </hc-table-form>

    <!-- 展示城市 -->
    <hc-city-box ref="hcCityBox"></hc-city-box>
  </basic-container>
</template>

<script>
import {
  officialReleaseList,
  officaialNewsCreate,
  cityColumn,
  checkCity,
  officialDetail,
  officialDel,
  officaialNewsUpdate,
} from "@/api/officialRelease/officialRelease.js";
import { dateFormat } from "@/util/date";
import HcQuill from "@/views/components/HcQuill";
import HcCityBox from "@/views/components/HcCity/HcCityBox/index";
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index";
import { mapGetters } from "vuex";
import store from "@/store";
import { getAllTagList } from "@/api/tms/city";
import { adminCityList } from "@/api/admin/city";
import HcTableForm from "@/views/components/HcTableForm/index";
import HcEmptyData from "@/views/components/HcEmptyData/index";
import HcPreview from "@/views/components/HcPreview/index";
import HcTextLine from "@/views/components/HcTextLine/index";
import HcImageUpload from "@/views/components/HcImageUpload/index";

// -------------
import { tableOption } from "./const.js";
import { getFileMimeType } from "@/util/file"

export default {
  components: {
    HcQuill,
    HcCityBox,
    HcCitySelect,
    HcTableForm,
    HcEmptyData,
    HcPreview,
    HcTextLine,
    HcImageUpload
  },
  data() {
    return {
      titleImage: [],
      formLoading: false,
      isShow: true, //是否显示资讯列表
      uploadPicUrl: "/api/admin/sys_file/oss/upload",
      headersOpt: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      // 官方发布 - 新增
      addform: {
        dataType: "",//文章来源默认为转载
        cityIdList: [],
        closeAllowed: "0", //启停,
        author: '',
      },
      // 预览的图片数组
      fileList: [],
      urlList: [], //标题图数组
      quillContent: {
        content: "",
        structuredContent: "",
      },
      // 栏目数据
      columnData: [],
      cityList: [],
      allCityList: [],
      initCityList: [],
      tagList: [],
      allCity: [],
      publishType: "",
      rules: {
        officialNewsName: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
        dataType: [
          { required: true, message: "请选择文章来源", trigger: "change" },
        ],
        newsSource: [
          { required: true, message: "请输入平台来源", trigger: "blur" },
        ],
        // author: [
        //   { required: true, message: "请输入作者", trigger: "blur" },
        // ],
        officialColumnId: [
          { required: true, message: "请选择栏目", trigger: "change" },
        ],
        cityIdList: [
          { required: true, message: "请输入城市", trigger: "blur" },
        ],
        urlList: [
          { required: true, message: "请添加标题图", trigger: "change" },
        ],
        // titleImage: [{validator: this.imageValidator, required: true, trigger: 'blur'}],
        imageSizeType: [
          { required: true, message: "请选择图片展示比例", trigger: "change" },
        ],
        content: [{ validator: this.contentValidator, required: true }],
      },
      preview: false,
    };
  },
  watch: {
    quillContent() {
      this.$nextTick(() => {
        this.$refs.addformRef && this.$refs.addformRef.validateField("content");
      });
    },
  },
  methods: {
    getContent (content) {
      return content.replace(new RegExp(/\t/g), "&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\r\n/g, '<br>').replace(/\n/g, '<br>')
    },
    imageValidator (rule, value, callback) {
      if (this.titleImage && this.titleImage.length > 0) {
        callback()
      } else {
        callback(new Error('请添加标题图'))
      }
    },
    onBeforeUpload(file) {
      return new Promise((resolve, reject) => {
        getFileMimeType(file).then(res => {
          if (res) {
            const isLt1M = file.size / 1024 / 1024 < 50;
            if (!isLt1M) {
              this.$message.warning("上传文件大小不能超过 50MB!");
              reject()
            } else {
              resolve(true)
            }
          } else {
            this.$message.warning("暂不支持该文件类型！");
            reject();
          }
        })
      })
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择50个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`,
      );
    },
    fetchListFun(params) {
      return new Promise((resolve, reject) => {
        officialReleaseList(params).then((res) => {
          resolve({
            records: res.data.data.data.records,
            page: {
              total: res.data.data.data.total,
            },
          });
        }, (error) => {
          reject(error)
        });
      });
    },
    toDelete({ officialNewsId }) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          officialDel({
            officialNewsId: officialNewsId,
            cityId: this.userInfo.manageCityId,
          }).then((res) => {
            if (res.data.code !== 0) {
              return this.$message.error("删除失败！");
            }
            this.$message({
              message: "删除成功！",
              type: "success",
            });
            this.isShow = true
            this.$refs.hcCrud.refresh();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 编辑
    toUpdate({ officialNewsId }) {
      officialDetail({
        officialNewsId: officialNewsId,
      }).then((res) => {
        let officialColumnId = res.data.data.data.officialColumnId;
        let officialMatch = false;
        for (let i = 0; i < this.columnData.length; i++) {
          if (this.columnData[i].officialColumnId == officialColumnId) {
            officialMatch = true;
            break;
          }
        }
        if (!officialMatch) {
          res.data.data.data.officialColumnId = "";
        }
        this.titleImage = res.data.data.data.urlList;
        this.addform = res.data.data.data;
        this.quillContent = {
          content: res.data.data.data.officialNewsContent,
          structuredContent: res.data.data.data.structuredContent,
        };
        this.urlList = [];
        this.fileList = [];
        this.addform.urlList.forEach((item, index) => {
          this.fileList.push({
            name: index,
            url: item,
          });
          this.urlList.push({
            type: "image",
            newsUrl: item,
            imageSizeType: this.addform.imageSizeType,
          });
        });

        if (this.addform.dataType == '1' && !this.addform.author) {
          this.addform.author = this.userInfo.realName
        }
        this.addform.urlList = this.urlList;
        this.isShow = false;
      });

      this.publishType = "edit";
    },
    // -----------
    dateFormat,
    backClisk() {
      // 清空标题图数组
      this.urlList = [];
      this.addform = {
        cityIdList: [],
        closeAllowed: "0", //启停
      };
      this.quillContent = {
        content: "",
        structuredContent: "",
      };
      this.fileList = [];
      this.isShow = true;
    },
    contentValidator(rule, value, callback) {
      if (this.quillContent && this.quillContent.content) {
        callback();
      } else {
        callback(new Error("请输入详情"));
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
    // 新建
    toCreate() {
      this.addform = {
        cityIdList: [this.userInfo.manageCityId],
        closeAllowed: "0", //启停
        dataType: '1',
        author: this.userInfo.realName,
      };
      this.isShow = false;
      this.publishType = "add";
    },
    // 查看
    check(id) {
      checkCity({
        officialNewsId: id,
      }).then((res) => {
        this.$refs.hcCityBox.open(
          this.userInfo.manageCityId,
          res.data.data.data || [],
          true
        );
      });
    },
    // 图片移除
    handleRemove(res, file) {
      if (!res.response) {
        this.urlList.forEach((item, index) => {
          if (res.url === item.newsUrl) {
            this.urlList.splice(index, 1);
          }
        });
      } else {
        this.urlList.forEach((item, index) => {
          if (res.response.data.data.url === item.newsUrl) {
            this.urlList.splice(index, 1);
          }
        });
      }
    },
    // 图片上传成功的钩子
    handlePicSuccess(res) {
      this.urlList.push({
        type: "image",
        newsUrl: res.data.data.url,
        // imageSizeType: this.addform.imageSizeType,
      });
    },
    // 预览
    handlePreview() {
      this.preview = true;
    },
    // 保存草稿
    handleDraft() {
      this.formLoading = true
      this.urlList.forEach((item) => {
        item.imageSizeType = this.addform.imageSizeType;
      });
      this.addform.urlList = this.urlList;
      let addform = this.addform;

      addform.officialNewsContent = this.quillContent.content;
      addform.structuredContent = this.quillContent.structuredContent;
      addform.state = 0;

      if (this.publishType == "add") {
        this.$refs.addformRef.validate((valid) => {
          if (valid) {
            officaialNewsCreate(addform).then((res) => {
              // console.log("直接发布", res);
              if (res.data.code !== 0) {
                return this.$message.error("保存失败");
              }
              this.$message({
                message: "保存成功！",
                type: "success",
              });
              this.isShow = true
              this.$refs.hcCrud.refresh();
            }).finally(() => {
              this.formLoading = false
            });
          } else {
            this.formLoading = false
          }
        });
      } else {
        this.$refs.addformRef.validate((valid) => {
          if (valid) {
            officaialNewsUpdate(addform).then((res) => {
              if (res.data.code !== 0) {
                return this.$message.error("编辑失败");
              }
              this.$message({
                message: "保存成功！",
                type: "success",
              });
              this.isShow = true
              this.$refs.hcCrud.refresh();
              this.fileList = [];
            }).finally(() => {
              this.formLoading = false
            });
          } else {
            this.formLoading = false
          }
        });
      }
    },
    // 直接发布
    handleCreate() {
      this.formLoading = true
      // this.urlList.forEach((item) => {
      //   item.imageSizeType = this.addform.imageSizeType; //标题图添加图片尺寸属性
      // });
      // console.log(this.urlList)
      // // return
      // this.addform.urlList = this.urlList;
      let addform = this.addform;

      addform.officialNewsContent = this.quillContent.content;
      addform.structuredContent = this.quillContent.structuredContent;
      addform.state = 1;

      let titleImage = [];
      for (let i = 0; i < this.titleImage.length; i++) {
        titleImage.push({
          type: "image",
          newsUrl: this.titleImage[i],
          imageSizeType: this.addform.imageSizeType
        });
      }
      addform.urlList = titleImage;
      // 新增
      if (this.publishType == "add") {
        this.$refs.addformRef.validate((valid) => {
          if (valid) {
            officaialNewsCreate(addform).then((res) => {
              // console.log("直接发布", res);
              if (res.data.code !== 0) {
                return this.$message.error("发布失败");
              }
              this.$message({
                message: "发布成功！",
                type: "success",
              });
              // 清空标题图数组
              this.urlList = [];
              this.addform = {
                cityIdList: [],
                closeAllowed: "0", //启停
              };
              this.quillContent = {
                content: "",
                structuredContent: "",
              };
              // this.getOfficialReleaseList();
              this.$refs.hcCrud.refresh();
              this.isShow = true;
            }).finally(() => {
              this.formLoading = false
            });
          } else {
            this.formLoading = false
          }
        });
      }
      // 编辑
      else {
        this.$refs.addformRef.validate((valid) => {
          if (valid) {
            officaialNewsUpdate(addform).then((res) => {
              if (res.data.code !== 0) {
                return this.$message.error("发布失败");
              }
              this.$message({
                message: "发布成功！",
                type: "success",
              });
              // 清空标题图数组
              this.urlList = [];
              this.addform = {
                cityIdList: [],
                closeAllowed: "0", //启停
              };
              this.quillContent = {
                content: "",
                structuredContent: "",
              };
              this.fileList = [];
              this.isShow = true;
              // this.getOfficialReleaseList();
              this.$refs.hcCrud.refresh();
            }).finally(() => {
              this.formLoading = false
            });
          } else {
            this.formLoading = false
          }
        });
      }
    },
    // 栏目
    getCityColumn() {
      cityColumn({
        cityId: this.userInfo.manageCityId,
      }).then((res) => {
        if (res.data.code !== 0) {
          return this.$message.error("获取栏目失败！");
        }
        this.columnData = res.data.data.data;
      });
    },
    toPublish () {
      console.log(this.$refs.hcCrud.multipleSelection)
    },
    dataTypeChange (type) {
      this.$set(this.addform, 'newsSource', '')
      if (type == '2') {
        this.addform.author = ''
      } else if (type == '1') {
        this.addform.author = this.userInfo.realName
      }
    },
  },
  computed: {
    ...mapGetters(["userInfo", "dicList", "userType"]),
    tableOption() {
      return tableOption(this.userType == 1 || this.userType == 2);
    },
    // 3/4平台
    isAdmin() {
      return this.userInfo.userType == 3 || this.userInfo.userType == 4;
    },
    title() {
      if (this.isShow) {
        return "官方发布";
      } else {
        if (this.publishType == "add") {
          return "官方发布-新增";
        } else {
          return "官方发布-编辑";
        }
      }
    },

  },
  created() {
    // this.getOfficialReleaseList();
    this.getCityColumn();
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.title {
  padding-bottom: 20px;
  font-size: 18px;
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.add-inp-more {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .inp-more {
    display: flex;
    .inp {
      width: 272px;
    }
    .more {
      padding: 0 12px;
      margin-left: 8px;
    }
  }
}
.el-table {
  margin-top: 16px;
}
.line {
  height: 14px;
  border-left: 1px solid #e9e9e9;
  margin: 0 6px;
}
.isClick {
  cursor: pointer;
}
.handleColor {
  font-size: 14px;
  color: #1676ff;
}
.handleItem {
  display: flex;
  align-items: center;
}
.paging {
  margin-top: 20px;
  text-align: right;
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
  /deep/ .quill-image,
  /deep/ .quill-image-box,
  /deep/ img {
    width: 100% !important;
  }
}
</style>
