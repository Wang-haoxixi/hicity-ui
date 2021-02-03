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
            class="filter-item"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="toCreate"
            >新建</el-button>
        </template>
        <template slot="cityList" slot-scope="scope">
          <el-button type="text" size="mini"
            >查看</el-button
          >
        </template>
        <template slot="menu" slot-scope="scope">
          <template v-if="isAdmin || (!isAdmin && scope.row.source == 2)">
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
          label-width="180px">
          <el-form-item label="游记名称：">
            <el-input v-model="formData.travelName"></el-input>
          </el-form-item>
          <el-form-item label="关联话题：">
            <hc-topic-select v-model="formData.topicsBankIdSet" topic-name="122222"></hc-topic-select>
          </el-form-item>
          <el-form-item label="游记图片：">
            <hc-image-upload v-model="formData.images" :limit="50"></hc-image-upload>
          </el-form-item>
          <el-form-item v-if="isAdmin" label="发布城市：">
            <hc-city-select v-model="formData.cityList"></hc-city-select>
          </el-form-item>
          <el-form-item label="内容：">
            <el-input type="textarea" v-model="formData.content"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="preview">预览</el-button>
            <el-button @click="handleDraft">保存草稿</el-button>
            <el-button @click="handleCreate">直接发布</el-button>
          </el-form-item>
        </el-form>
      </template>
    </hc-table-form>
    <el-dialog
      title="展示城市"
      :visible.sync="cityViewDialogVisible"
      width="70%"
    >
      <hc-city-box
        view-only
        :init-city-list="initCityList"
        :all-city-list="allCityList"
      ></hc-city-box>
      <div slot="footer">
        <el-button @click="cityViewDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import { tableOption } from "./const";
import { mapGetters } from "vuex";
import {
  newsOpenList,
} from "@/api/cms/news";
import { getTravelList, getClassifyList, getTopicList, saveTravel, getTravelDetail, deleteTravel } from "@/api/cms/travel"
import HcCityBox from "@/views/components/HcCityBox/index";
import HcCitySelect from "@/views/components/HcCitySelect/index";
import HcImageUpload from "@/views/components/HcImageUpload/index";
import HcTopicSelect from "@/views/components/HcTopicSelect/index";
import HcTableForm from "@/views/components/HcTableForm/index";
export default {
  name: "SysUser",
  components: { HcCityBox, HcCitySelect, HcImageUpload, HcTopicSelect, HcTableForm },
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
      publish: false,
      publishType: "",
      allCityList: [],
      initCityList: [],
      cityViewDialogVisible: false,
      topicProps: {
        lazy: true,
        lazyLoad (node, resolve) {
          const { level } = node;
          if (level == 0) {
            getClassifyList({
              current: 1,
              size: 1000000
            }).then(({data}) => {
              let classifyList = data.data.data.records
              let nodes = []
              for (let i = 0; i < classifyList.length; i++) {
                nodes.push({
                  value: classifyList[i].id,
                  label: classifyList[i].classifyName,
                  leaf: false
                })
              }
              resolve(nodes)
            })
          } else {
            getTopicList({
              queryType: 1,
              classifyId: node.value
            }).then(({data}) => {
              let topicList = data.data.data.records
              let nodes = []
              for (let i = 0; i < topicList.length; i++) {
                nodes.push({
                  value: topicList[i].id,
                  label: topicList[i].topicsName,
                  leaf: true
                })
              }
              resolve(nodes)
            })
          }
        }
      }
    };
  },
  computed: {
    ...mapGetters(["permissions", "userInfo", "dicList"]),
    tableOption() {
      return tableOption(this.isAdmin);
    },
    isAdmin() {
      return this.userInfo.userType == 3 || this.userInfo.userType == 4;
    },
    title () {
      if (!this.publish) {
        return '官方话题'
      } else {
        if (this.publishType == 'add') {
          return '官方话题-新增'
        } else {
          return '官方话题-编辑'
        }
      }
    }
  },
  created() {
  },
  methods: {
    getList(page = this.page, params) {
      this.tableLoading = true;
      let form = {
        current: page.currentPage,
        size: page.pageSize,
        queryType: 0
      };
      getTravelList(form)
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
        cityList: [],
        images: [],
      };
      if (!this.isAdmin) {
        this.formData.cityList = [this.userInfo.manageCityId];
      }
      this.publish = true;
      this.publishType = "add";
    },
    handleCreate() {
      let formData = this.formData;
      saveTravel({ ...formData, state: 1 }).then(({ data }) => {
        this.publish = false;
        this.$notify({
          title: "成功",
          message: "发布成功",
          type: "success",
          duration: 2000,
        });
        this.getList();
      });
    },
    toUpdate({ id }) {
      getTravelDetail(id).then(({ data }) => {
        let formData = data.data.data
        let images = []
        for (let i = 0; i < formData.images.length; i++) {
          images.push(formData.images[i].imageUrl)
        }

        this.formData = {
          ...formData,
          images
        };
        this.publish = true;
        this.publishType = "edit";
      });
    },
    handleDraft() {},
    preview() {
      // this.$refs.quill.getData()
      // console.log()
    },
    toDelete({ id }) {
      this.$confirm("是否确认删除该条游记?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteTravel(id).then(({ data }) => {
            this.publish = false;
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000,
            });
            this.getList();
          });
        })
        .catch(function () {});
    },
    handleRefreshChange() {
      this.getList(this.page);
    },
    cityView(newsId) {
      newsOpenList({ newsId }).then(({ data }) => {
        let cityList = data.data.data;
        let allCityList = [];
        let initCityList = [];
        for (let i = 0; i < cityList.length; i++) {
          allCityList.push({
            cityId: cityList[i].cityId,
            cityName: cityList[i].cityName,
          });
          if (cityList[i].isOpening) {
            initCityList.push(cityList[i].cityId);
          }
        }
        this.initCityList = initCityList;
        this.allCityList = allCityList;
        this.cityViewDialogVisible = true;
      });
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

