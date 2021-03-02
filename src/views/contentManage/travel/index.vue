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
          <el-button type="text" size="mini" @click="cityView(scope.row.id)">查看</el-button>
        </template>
        <template slot="menu" slot-scope="scope">
          <template v-if="userType <= scope.row.publishedSources">
            <el-button type="text" size="mini" @click="toUpdate(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" @click="toDelete(scope.row)">删除</el-button>
          </template>
        </template>
      </avue-crud>
      <template slot="form">
        <el-form
          ref="form"
          class="dialog-main-tree"
          :model="formData"
          label-width="180px"
          :rules="formRule">
          <el-form-item label="游记名称：" prop="travelName">
            <el-input v-model="formData.travelName" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="关联话题：" prop="topicsBankIdSet">
            <hc-topic-select v-model="formData.topicsBankIdSet" :topic-name="topicName"></hc-topic-select>
          </el-form-item>
          <el-form-item label="游记图片：" prop="images">
            <hc-image-upload v-model="formData.images" :limit="10"></hc-image-upload>
          </el-form-item>
          <el-form-item v-if="formData.publishedSources ? (userType != 3 && userType == formData.publishedSources) : (userType == 1 || userType == 2)" label="发布城市：" prop="cityList">
            <hc-city-select v-model="formData.cityList" :city-id="userInfo.manageCityId"></hc-city-select>
          </el-form-item>
          <el-form-item label="内容：" prop="content">
            <el-input type="textarea" v-model="formData.content" :autosize="{minRows: 5, maxRows: 10}" maxlength="250"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="handlePreview">预览</el-button>
            <el-button @click="handleDraft">保存草稿</el-button>
            <el-button @click="handleCreate">直接发布</el-button>
          </el-form-item>
        </el-form>
        <hc-preview v-if="preview" @close="preview = false">
          <div class="preview-image">
            <swiper :options="swiperOptions">
              <swiper-slide v-for="(image, index) in formData.images" :key="index">
                <img :src="image" />
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
          </div>
          <div class="preview-user">
            <img class="preview-avatar" :src="userInfo.avatar"/>
            <div class="name-time">
              <div class="user-name">{{userInfo.realName}}</div>
              <div class="preview-time">{{dateFormat(new Date())}}</div>
            </div>
          </div>
          <div class="preview-title">
            {{formData.travelName || '资讯标题'}}
          </div>
          <div class="preview-content" v-html="formData.content.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>')"></div>
        </hc-preview>
      </template>
    </hc-table-form>
    
    <hc-city-box ref="hcCityBox"></hc-city-box>
  </basic-container>
</template>

<script>
import { tableOption } from "./const";
import { mapGetters } from "vuex";
import { dateFormat } from "@/util/date"
import { getTravelList, getClassifyList, getTopicList, saveTravel, getTravelDetail, deleteTravel, travelOpenList } from "@/api/cms/travel"
import HcCityBox from "@/views/components/HcCity/HcCityBox/index";
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index";
import HcImageUpload from "@/views/components/HcImageUpload/index";
import HcTopicSelect from "@/views/components/HcTopicSelect/index";
import HcTableForm from "@/views/components/HcTableForm/index";
import HcPreview from "@/views/components/HcPreview/index"
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper.scss'
export default {
  name: "SysUser",
  components: { HcCityBox, HcCitySelect, HcImageUpload, HcTopicSelect, HcTableForm, HcPreview, Swiper, SwiperSlide },
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
      },
      topicName: '',
      formRule: {
        travelName: [{required: true, message: '请输入名称'}],
        topicsBankIdSet: [{required: true, message: '请选择话题'}],
        cityList: [{required: true, message: '请选择城市'}],
        images: [{required: true, message: '请添加游记图片'}],
        content: [{required: true, message: '请输入内容'}],
      },
      preview: false,
      swiperOptions: {
        pagination: {
          el: '.swiper-pagination'
        },
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
    dateFormat,
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
        cityList: [this.userInfo.manageCityId],
        images: [],
      };
      this.topicName = ''
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
      saveTravel({ ...formData, state }).then(({ data }) => {
        this.publish = false;
        this.$notify({
          title: "成功",
          message: state ? '保存成功！' : this.publishType == 'add' ? "发布成功！" : "编辑成功！",
          type: "success",
          duration: 2000,
        });
        this.getList();
      });
    },
    toUpdate({ id }) {
      getTravelDetail(id).then(({ data }) => {
        let formData = data.data.data
        let topicsBankIdSet = []
        for (let i = 0; i < formData.topicsBankList.length; i++) {
          topicsBankIdSet.push(formData.topicsBankList[i].id)
        }
        this.formData = {
          id: formData.id,
          travelName: formData.travelName,
          topicsBankIdSet,
          images: formData.imageUrls,
          cityList: formData.cityIds,
          content: formData.content,
          publishedSources: formData.publishedSources
        }
        this.topicName = formData.topicsBankList && formData.topicsBankList[0].topicsName || ''
        this.publish = true;
        this.publishType = "edit";
      });
    },
    handleDraft() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.save(0)
        }
      })
    },
    handlePreview() {
      this.preview = true
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
    cityView(id) {
      travelOpenList({ id }).then(({ data }) => {
        this.$refs.hcCityBox.open(this.userInfo.manageCityId, data.data.data || [], true)
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

.preview-image {
  margin: -16px -16px 0;
  height: 225px;
  width: 375px;
  img {
    height: 225px;
    width: 375px;
  }
  /deep/ .swiper-container {
    .swiper-pagination {
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    height: .23rem;
    font-family: PingFangSC-Regular;
    font-size: .156rem;
    color: #fff;
    letter-spacing: 0;
    line-height: .12rem;
  }
  .swiper-pagination-bullet {
    background: #fff;
    opacity: 0.8;
    height: 0.08rem;
    border-radius: 0.06rem;
    width: 0.08rem;
    transition: all 0.2s; //可设置缓慢变化
  }
  .swiper-pagination-bullet-active {
    width: 30px;
  }
  }
  
}
.preview-user {
  margin: 0 -16px;
  padding: 0 16px;
  height: 60px;
  display: flex;
  align-items: center;
  background-color: #F9F9F9;
  .preview-avatar {
    margin-right: 5px;
    height: 30px;
    width: 30px !important;
    flex: 0 0 30px !important;
  }
  .name-time {
    flex: 1 1 200px;
    .user-name {
      height: 20px;
      line-height: 20px;
      color: #333333;
      font-size: 14px;
    }
    .preview-time {
      margin-top: 2px;
      height: 17px;
      line-height: 17px;
      color: #999999;
      font-size: 12px;
    }
  }
}
.preview-title {
  margin-top: 16px;
  line-height: 26px;
  color: #333333;
  font-size: 18px;
}
.preview-content {
  margin-top: 16px;
}
</style>

