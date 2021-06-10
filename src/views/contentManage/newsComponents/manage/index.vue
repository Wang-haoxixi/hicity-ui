<template>
  <basic-container>
    <hc-table-form
      :title="title"
      :formVisible="publish"
      @go-back="goBack">
      <hc-crud ref="hcCrud" :option="tableOption" :fetchListFun="fetchListFun" :search-query="searchQuery">
        <template v-slot:officialNewsName="scope">
          <hc-text-line :text="scope.row.officialNewsName" :lines="3" :line-height="20">
            <template v-slot="textScope">
              <strong class="preview-link" @click="toPreview(scope.row.officialNewsId)">{{textScope.text}}</strong>
            </template>
          </hc-text-line>
        </template>

        <template v-slot:cityIdSearchItem="scope">
          <hc-city-select v-model="scope.searchForm[scope.prop]" :city-id="userInfo.manageCityId" single></hc-city-select>
        </template>
        <template v-slot:officialColumnIdSearchItem="scope">
          <el-select
            style="width: 100%"
            v-model="scope.searchForm[scope.prop]"
            placeholder="请选择栏目"
            clearable
          >
            <el-option
              v-for="tag in columnsList"
              :key="tag.officialColumnId"
              :label="tag.officialColumnName"
              :value="tag.officialColumnId"
            >
            </el-option>
          </el-select>
        </template>
        <template v-slot:updateBySearchItem="scope">
          <hc-remote-select v-model="scope.searchForm[scope.prop]" :remote-fun="getAllUser" :show-word="updateByName" @option-change="updateByOptionChange" @change="updateByChange">
            <template v-slot:option="scope">
              <strong>{{scope.option.data.realName}} </strong>
              <span> ({{scope.option.data.username}})</span>
            </template>
          </hc-remote-select>
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
                <div class="cover" v-if="newsType == '1' && (userType == 1 || userType == 2)" @click="toRecommendBatch">批量推荐</div>
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
          <!-- <el-button  type="text" size="mini" @click="toView(scope.row)"
            >查看</el-button
          > -->
          <template v-if="userType <= scope.row.source">
            <el-button  type="text" size="mini" @click="toUpdate(scope.row)"
              >编辑</el-button
            >
            <el-button v-if="scope.row.state === 0" type="text" size="mini" @click="toPublish(scope.row)"
              >发布</el-button
            >
            <el-button v-if="scope.row.state === 1" type="text" size="mini" @click="toOffShelf(scope.row)"
              >下架</el-button
            >
            <el-button type="text" size="mini" @click="toDelete(scope.row)"
              >删除</el-button
            >
          </template>
          <template v-if="newsType == '1' && (userType == 1 || userType == 2)">
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
        <news-form ref="newsForm" :news-type="newsType" :form-data="formData" @save="save" @preview="handlePreview"></news-form>
      </template>
    </hc-table-form>

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
    <hc-city-box ref="recommendSelect" @save="setRecommend" :province="recommendType == 'batch' && userType == 1"></hc-city-box>

    <news-preview ref="preview"></news-preview>

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
  batchHandler,
  singleHandler,
  cityColumn
} from "@/api/cms/news";
import { getAllUser } from '@/api/admin/user'
import HcQuill from "@/views/components/HcQuill";
import HcCityBox from "@/views/components/HcCity/HcCityBox/index";
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index";
import HcTableForm from "@/views/components/HcTableForm/index"
import HcTextLine from "@/views/components/HcTextLine/index";
import NewsForm from "../form/index"
import NewsRecommend from "../recommend/index"
import HcRemoteSelect from "@/views/components/HcForm/HcRemoteSelect/index"
import NewsPreview from "../preview/index"

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
  components: { HcQuill, HcCityBox, HcCitySelect, HcTableForm, HcTextLine, NewsForm, NewsRecommend, HcRemoteSelect, NewsPreview },
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
      recommendId: null,
      recommendType: '',
      searchQuery: [
        {
          type: 'text',
          label: '名称',
          prop: 'searchName',
          maxlength: 10,
        },
        {
          label: '状态',
          prop: 'state',
          type: 'select',
          dicData: [
            {
              label: '已生效',
              value: 1
            },
            {
              label: '草稿',
              value: 0
            }
          ]
        },
        {
          label: '城市',
          prop: 'cityId',
        },
        {
          label: '原文时间',
          prop: 'createTime',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
        },
        {
          label: '更新时间',
          prop: 'updateTime',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
        },
        {
          label: '栏目',
          prop: 'officialColumnId',
        },
        {
          label: '更新人',
          prop: 'updateBy'
        }

      ],
      columnsList: [],
      updateByName: '',
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
  created () {
    cityColumn({ cityId: this.userInfo.manageCityId, type: this.newsType }).then(({ data }) => {
      this.columnsList = data.data.data;
    });
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
    fetchListFun (params) {
      let createTime = params.createTime
      if (createTime) {
        params.createStartTime = createTime[0]
        params.createEndTime = dateFormat(new Date(new Date(createTime[1]).getTime() + 24 * 60 * 60 * 1000))
        delete params.createTime
      }
      let updateTime = params.updateTime
      if (updateTime) {
        params.updateStartTime = updateTime[0]
        params.updateEndTime = dateFormat(new Date(new Date(updateTime[1]).getTime() + 24 * 60 * 60 * 1000))
        delete params.updateTime
      }
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
    toPreview (officialNewsId) {
      getNewsDetail({ officialNewsId }).then(({ data }) => {
        let newsDetail = data.data.data
        this.handlePreview(newsDetail)
      });
    },
    handlePreview(news) {
      this.$refs.preview.open(news)
    },
    toDelete({ officialNewsId }) {
      this.$confirm(`是否确认删除该资讯?`, "警告", {
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
          this.$message.success(data.data.data || '操作成功')
          this.$refs.hcCrud.refresh()
        })
      }
    },
    toCancelRecommend ({ recId }) {
      this.$confirm(`是否确认取消推荐该资讯?`, "警告", {
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
    toView({ officialNewsId }) {
      getNewsDetail({ officialNewsId }).then(({ data }) => {
        this.publish = true;
        this.publishType = 'edit'
        this.$nextTick(() => {
          this.$refs.newsForm.open(data.data.data, true)
        })
      });
    },
    toPublish ({ officialNewsId }) {
      this.$confirm(`是否确认发布该资讯?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        singleHandler({
          dataId: officialNewsId,
          operation: 1
        }).then(({ data }) => {
          this.$message.success('操作成功')
          this.$refs.hcCrud.refresh()
        })
      }).catch(function () {});
    },
    toOffShelf ({ officialNewsId }) {
      this.$confirm(`是否确认下架该资讯?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        singleHandler({
          dataId: officialNewsId,
          operation: 3
        }).then(({ data }) => {
          this.$message.success('操作成功')
          this.$refs.hcCrud.refresh()
        })
      }).catch(function () {});
    },
    getAllUser (name) {
      return new Promise((resolve, reject) => {
        getAllUser({name}).then(({data}) => {
          let userListTemp = data.data.data
          let userList = []
          for (let i = 0; i < userListTemp.length; i++) {
            userList.push({
              label: userListTemp[i].realName,
              value: userListTemp[i].userId,
              data: userListTemp[i]
            })
          }
          resolve(userList)
        }, () => {
          reject(new Error("数据获取失败！"))
        })
      })
    },
    updateByOptionChange (option) {
      this.updateByName = option.label
    },
    updateByChange (val) {
      console.log(val)
      if (!val) {
        this.updateByName = ''
      }
    }
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


.cover{
  display: inline-block;
  margin: 0 -17px 0 -17px;
  text-align: center;
  width: 84px;
  height: 100%;
}
.search-item {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin: 10px 20px 0 0;
}

.preview-link {
  color: #1E90FF;
  cursor: pointer;
}
</style>

