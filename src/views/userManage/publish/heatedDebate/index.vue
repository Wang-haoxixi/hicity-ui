<template>
  <basic-container>
    <hc-table-form
      :title="title"
      :formVisible="publish"
      @go-back="publish = false"
    >
      <hc-crud ref="hcCrud" :fetchListFun="fetchListFun" :option="tableOption">
        <template slot="cityList" slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="cityView(scope.row.heatedDebateId)"
            >查看</el-button
          >
        </template>
        <template slot="menu" slot-scope="scope">
          <template>
            <el-button type="text" size="mini" @click="toView(scope.row)"
              >详情</el-button
            >
            <el-button type="text" size="mini" @click="toDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </template>
      </hc-crud>
      <template slot="form">
        <el-form
          ref="form"
          class="dialog-main-tree"
          :model="formData"
          label-width="180px"
          :rules="formRule"
          :disabled="publishType == 'view'"
        >
          <el-form-item label="游记名称：" prop="travelName">
            <hc-remote-select v-model="titleObj" value-key="heatedDebateId" label-key="title" is-object :remote-fun="getAllTitle" :show-word="titleShow" :disabled="publishType == 'edit' && formData.state != '0'" @change="titleChange">
              <template v-slot:option="scope">
                <div class="title-select-item">
                  <span style="color: #bbbbbb;">#</span>
                  <span style="margin-left: 10px;">{{scope.option.title}}</span>
                  <span class="new-icon" v-if="scope.option.heatedDebateId === 0">新</span>
                  <span v-else class="number" style="display: inline-block;margin-left: 10px;font-size: 10px;">
                    <i class="el-icon-user-solid"></i>
                    {{scope.option.numberOfParticipants}}
                  </span>
                </div>
              </template>
            </hc-remote-select>
          </el-form-item>
          <el-form-item
            v-if="(userType == 1 || userType == 2) && (!titleObj.heatedDebateId || titleObj.heatedDebateId === 0)"
            label="发布城市："
            prop="cityList"
          >
            <hc-city-select
              v-model="formData.cityList"
              :disabled="publishType == 'edit' && formData.state != '0'"
              :city-id="userInfo.manageCityId"
            ></hc-city-select>
          </el-form-item>
          <el-form-item label="游记图片：" prop="images">
            <hc-image-upload
              :disabled="publishType == 'view'"
              v-model="formData.images"
              :limit="9"
            ></hc-image-upload>
          </el-form-item>
          <el-form-item label="内容：" prop="content">
            <el-input
              type="textarea"
              v-model="formData.content"
              :autosize="{ minRows: 5, maxRows: 10 }"
              maxlength="250"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
    </hc-table-form>

    <hc-city-box ref="hcCityBox"></hc-city-box>
  </basic-container>
</template>

<script>
import { tableOption } from "./const";
import { mapGetters } from "vuex";
import { dateFormat } from "@/util/date";
import {
  getDebateList,
  saveDebate,
  getDebateDetail,
  deleteDebate,
  debateOpenList,
  debateMatchList
} from "@/api/cms/heatedDebate";
import { createComment } from "@/api/cms/common"
import HcCityBox from "@/views/components/HcCity/HcCityBox/index";
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index";
import HcImageUpload from "@/views/components/HcImageUpload/index";
import HcTableForm from "@/views/components/HcTableForm/index";
import HcRemoteSelect from "@/views/components/HcForm/HcRemoteSelect/index"
import "swiper/swiper.scss";
export default {
  name: "SysUser",
  components: {
    HcCityBox,
    HcCitySelect,
    HcImageUpload,
    HcTableForm,
    HcRemoteSelect
  },
  data() {
    return {
      titleObj: {},
      titleShow: '',
      formData: {},
      publish: false,
      publishType: "",
      formRule: {
        cityList: [{ required: true, message: "请选择城市" }],
        images: [{ required: true, message: "请添加游记图片" }],
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
    title() {
      if (!this.publish) {
        return "用户热议";
      } else {
        if (this.publishType == "add") {
          return "用户热议-新增";
        } else if (this.publishType == "edit") {
          return "用户热议-编辑";
        } else if (this.publishType == "view") {
          return "用户热议-详情";
        } else {
          return ''
        }
      }
    },
  },
  created() {},
  methods: {
    dateFormat,
    titleChange (title) {
      if (title.heatedDebateId && title.heatedDebateId !== 0) {
        this.formData.cityList = []
      } else {
        this.formData.cityList = [this.userInfo.manageCityId]
      }
    },
    getAllTitle (title) {
      return new Promise((resolve, reject) => {
        if (title.length <= 30) {
          debateMatchList({title}).then(({data}) => {
            let hasTitle = false
            let titles = data.data.data.records
            for (let i = 0; i < titles.length; i++) {
              if (titles[i].title == title) {
                hasTitle = true
                break
              }
            }
            if (!hasTitle) {
              titles.unshift({
                heatedDebateId: 0,
                title
              })
            }
            resolve(titles)
          })
        } else {
          this.$message.warning('话题名称最多30个字')
          resolve([])
        }
      })
    },
    fetchListFun(params) {
      return new Promise((resolve, reject) => {
        getDebateList({
          ...params,
          queryType: 1,
        }).then(
          ({ data }) => {
            resolve({
              records: data.data.data.records,
              page: {
                total: data.data.data.total,
              },
            });
          },
          (error) => {
            reject(error);
          }
        );
      });
    },
    toView({ heatedDebateId }) {
      getDebateDetail(heatedDebateId).then(({ data }) => {
        let formData = data.data.data;
        this.formData = {
          id: formData.heatedDebateId,
          images: formData.imageUrls,
          cityList: formData.cityIds || [],
          content: formData.content,
          state: formData.state
        };
        this.titleObj = {
          title: formData.title
        }
        this.titleShow = formData.title
        this.publish = true;
        this.publishType = "view";
      });
    },
    toDelete({ heatedDebateId }) {
      this.$confirm("是否确认删除该条热议?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteDebate(heatedDebateId).then(({ data }) => {
            this.publish = false;
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000,
            });
            this.$refs.hcCrud.refresh();
          });
        })
        .catch(function () {});
    },
    cityView(id) {
      debateOpenList({ id }).then(({ data }) => {
        this.$refs.hcCityBox.open(
          this.userInfo.manageCityId,
          data.data.data || [],
          true
        );
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
      height: 0.23rem;
      font-family: PingFangSC-Regular;
      font-size: 0.156rem;
      color: #fff;
      letter-spacing: 0;
      line-height: 0.12rem;
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
  background-color: #f9f9f9;
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

