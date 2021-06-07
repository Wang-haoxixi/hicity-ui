<template>
  <basic-container>
    <hc-table-form
      :title="title"
      :formVisible="publish"
      @go-back="goBack">
      <hc-crud ref="hcCrud" :option="tableOption" :fetchListFun="fetchListFun" @toUpdate="toUpdate" @toDelete="toDelete">
        <template v-slot:officialNewsName="scope">
          <hc-text-line :text="scope.row.officialNewsName" :lines="3" :line-height="20"></hc-text-line>
        </template>
        <template slot="menuLeft">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="toCreate"
            >新建</el-button>
          <el-button
            v-if="newsType == '1'"
            @click="manageRecommend"
            size="mini"
            >推荐管理</el-button>
          <el-dropdown style="margin-left: 8px">
            <el-button type="default" size="mini">
              批量操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div class="cover" @click="publishBatch">批量发布</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class="cover" @click="deleteBatch">批量删除</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class="cover" @click="offShelfBatch">批量下架</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class="cover" v-if="newsType == '1'" @click="toRecommendBatch">批量推荐</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </template>
        <template slot="cityList" slot-scope="scope">
          <el-button type="text" size="mini" @click="cityView(scope.row.officialNewsId)"
            >查看</el-button
          >
        </template>
        <template slot="menu" slot-scope="scope">
          <template v-if="userType <= scope.row.source">
            <el-button v-if="scope.row.isRecommend" type="text" size="mini" @click="toCancelRecommend(scope.row)"
              >取消推荐</el-button
            >
            <el-button v-else type="text" size="mini" @click="toRecommend(scope.row)"
              >推荐</el-button
            >
          </template>
        </template>
      </hc-crud>
      <template slot="form">
        <news-form ref="newsForm" :form-data="formData" @save="save"></news-form>
      </template>
    </hc-table-form>

    <!-- 预览 -->
    <hc-preview v-if="preview" @close="preview = false">
      <div class="preview-title">
        {{formData.officialNewsName || '资讯标题'}}
      </div>
      <div class="preview-time">发布时间：{{dateFormat(new Date())}}</div>
      <div class="preview-content" v-html="getContent(quillContent.content) || '内容'"></div>
    </hc-preview>

    <!-- 城市范围查看 -->
    <hc-city-box ref="hcCityBox"></hc-city-box>

    <!-- 推荐管理 -->
    <el-dialog
      title="推荐列表"
      :visible.sync="dialogVisible"
      width="width">
      <news-recommend ref="recommend" @refresh="recommendRefresh"></news-recommend>
      <div slot="footer">
        <el-button @click="dialogVisible = false">返 回</el-button>
      </div>
    </el-dialog>

    <!-- 推荐选择 -->
    <hc-city-box ref="recommendSelect" @save="setRecommend" :province="recommendType == 'batch'"></hc-city-box>

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
  cancelRecommend,
  setRecommend,
  batchHandler
} from "@/api/cms/news";
import HcQuill from "@/views/components/HcQuill";
import HcCityBox from "@/views/components/HcCity/HcCityBox/index";
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index";
import HcTableForm from "@/views/components/HcTableForm/index"
import HcPreview from "@/views/components/HcPreview/index"
import HcTextLine from "@/views/components/HcTextLine/index";
import NewsForm from "../form/index"
import NewsRecommend from "../recommend/index"

function getCityList (tree) {
  let cityList = []
  if (tree) {
    if (tree.children) {
      for (let i = 0; i < tree.children.length; i++) {
        cityList = [...cityList, ...getCityList(tree.children[i])]
      }
    } else {
      cityList.push(tree.id)
    }
  }
  return cityList
}

export default {
  components: { HcQuill, HcCityBox, HcCitySelect, HcTableForm, HcPreview, HcTextLine, NewsForm, NewsRecommend },
  props: {
    newsType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      formData: {
        dataType: "",//文章来源默认为转载
        cityIdList: [],
        officialColumnId: [],
        author: '',
      },
      publish: false,
      publishType: "",
      dialogVisible: false,
      preview: false,
      recommendId: null,
      recommendType: ''
    };
  },
  computed: {
    ...mapGetters(["permissions", "userInfo", "dicList", "userType"]),
    tableOption() {
      return tableOption(this.userType == 1 || this.userType == 2);
    },
    newsTitle () {
      if (this.newsType == '1') {
        return '本地资讯'
      } else {
        return '城市头条'
      }
    },
    title () {
      if (!this.publish) {
        return this.newsTitle
      } else {
        if (this.publishType == 'add') {
          return `${this.newsTitle}-新增`
        } else {
          return `${this.newsTitle}-编辑`
        }
      }
    }
  },
  methods: {
    goBack () {
      this.quillContent = {
        content: "",
        structuredContent: ""
      }
      this.formData = {
        cityIdList: [],
        officialColumnId: []
      }
      this.publish = false
    },
    dateFormat,
    getContent (content) {
      return content.replace(new RegExp(/\t/g), "&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\r\n/g, '<br>').replace(/\n/g, '<br>')
    },
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        getNewsList({
          ...params,
          type: this.newsType
        }).then((res) => {
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
        this.$refs.newsForm.open({
          cityIdList: [this.userInfo.manageCityId],
          closeAllowed: "0",
          officialColumnId: [],
          dataType: '1',
          author: this.userInfo.realName,
        })
      })
    },
    save (data) {
      if (!data.isEdit) {
        addNews({ ...data.data, type: this.newsType }).then(({ data }) => {
          this.publish = false;
          this.$notify({
            title: "成功",
            message: data.data.state ? "发布成功！" : "保存成功！",
            type: "success",
            duration: 2000,
          });
          this.$refs.hcCrud.refresh();
        }).finally(() => {
          this.formLoading = false
        });
      } else {
        updateNews({ ...data.data }).then(({ data }) => {
          this.publish = false;
          this.$notify({
            title: "成功",
            message: data.data.state ? "编辑成功！" : "保存成功！",
            type: "success",
            duration: 2000,
          });
          this.$refs.hcCrud.refresh();
        }).finally(() => {
          this.formLoading = false
        });
      }
    },
    toUpdate({ officialNewsId }) {
      getNewsDetail({ officialNewsId }).then(({ data }) => {
        this.publish = true;
        this.publishType = 'edit'
        this.$nextTick(() => {
          this.$refs.newsForm.open(data.data.data, true)
        })
      });
    },
    handlePreview() {
      this.preview = true
    },
    toDelete({ officialNewsId }) {
      this.$confirm(`是否确认删除该条${this.newsTitle}?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteNews({
            officialNewsId,
            cityId: this.userInfo.manageCityId,
          }).then(({ data }) => {
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
    toRecommend ({ officialNewsId }) {
      this.recommendId = officialNewsId
      this.recommendType = 'single'
      newsOpenList({ officialNewsId }).then(({ data }) => {
        this.$refs.recommendSelect.open(this.userInfo.manageCityId, [], false, data.data.data)
      });
    },
    setRecommend (city) {
      let cityList = getCityList(city)
      if (this.recommendType == 'single') {
        setRecommend({
          dataId: this.recommendId,
          cityList
        }).then(({data}) => {
          this.$notify({
            title: "成功",
            message: "操作成功",
            type: "success",
            duration: 2000,
          });
          this.$refs.hcCrud.refresh()
        })
      } else if (this.recommendType == 'batch') {
        batchHandler({
          cityList,
          operation: 4,
          dataIdList: this.recommendId
        }).then(({ data }) => {
          this.$message.success('操作成功')
          this.$refs.hcCrud.refresh()
        })
      }
    },
    toCancelRecommend ({ recId }) {
      this.$confirm(`是否确认取消推荐该条${this.newsTitle}?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          cancelRecommend(recId).then(({ data }) => {
            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success",
              duration: 2000,
            });
            this.$refs.hcCrud.refresh()
          });
        })
        .catch(function () {});
    },
    cityView(officialNewsId) {
      newsOpenList({ officialNewsId }).then(({ data }) => {
        this.$refs.hcCityBox.open(this.userInfo.manageCityId, data.data.data || [], true)
      });
    },
    manageRecommend () {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.recommend.open()
      })
    },
    recommendRefresh () {
      this.$refs.hcCrud.refresh()
    },
    publishBatch () {
      let selection = this.$refs.hcCrud.multipleSelection
      if (selection && selection.length > 0) {
        let dataIdList = []
        for (let i = 0; i < selection.length; i++) {
          dataIdList.push(selection[i].officialNewsId)
        }
        batchHandler({
          dataIdList,
          operation: 1
        }).then(({ data }) => {
          this.$message.success('操作成功')
          this.$refs.hcCrud.refresh()
        })
      } else {
        this.$message.warning('请先勾选需要发布的资讯')
      }
    },
    deleteBatch () {
      let selection = this.$refs.hcCrud.multipleSelection
      if (selection && selection.length > 0) {
        this.$confirm(`是否确认删除所选资讯?`, "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          let dataIdList = []
          for (let i = 0; i < selection.length; i++) {
            dataIdList.push(selection[i].officialNewsId)
          }
          batchHandler({
            dataIdList,
            operation: 2
          }).then(({ data }) => {
            this.$message.success('操作成功')
            this.$refs.hcCrud.refresh()
          })
        }).catch(function () {});
      } else {
        this.$message.warning('请先勾选需要删除的资讯')
      }
    },
    offShelfBatch () {
      let selection = this.$refs.hcCrud.multipleSelection
      if (selection && selection.length > 0) {
        this.$confirm(`是否确认下架所选资讯?`, "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          let dataIdList = []
          for (let i = 0; i < selection.length; i++) {
            dataIdList.push(selection[i].officialNewsId)
          }
          batchHandler({
            dataIdList,
            operation: 3
          }).then(({ data }) => {
            this.$message.success('操作成功')
            this.$refs.hcCrud.refresh()
          })
        }).catch(function () {});
      } else {
        this.$message.warning('请先勾选需要下架的资讯')
      }
    },
    toRecommendBatch () {
      let selection = this.$refs.hcCrud.multipleSelection
      if (selection && selection.length > 0) {
        let dataIdList = []
        for (let i = 0; i < selection.length; i++) {
          if (selection[i].isRecommend == 1) {
            this.$message.warning('勾选的资讯中存在已推荐数据，请重新勾选')
            return
          }
          dataIdList.push(selection[i].officialNewsId)
        }
        this.recommendId = dataIdList
        this.recommendType = 'batch'
        this.$refs.recommendSelect.open(this.userInfo.manageCityId, [], false)

      } else {
        this.$message.warning('请先勾选需要推荐的资讯')
      }
    },
  },
};
</script>
<style lang="scss" scoped>
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

.cover{
  display: inline-block;
  margin: 0 -17px 0 -17px;
  text-align: center;
  width: 84px;
  height: 100%;
}
</style>

