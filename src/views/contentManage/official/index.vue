<template>
  <basic-container>
    <!-- 官方发布 -->
    <hc-table-form :title="title" :formVisible="!isShow" @go-back="backClisk">
      <template>
        <div class="add-inp-more">
          <!-- 新建按钮 -->
          <el-button
            size="mini"
            @click="toCreate"
            type="primary"
            icon="el-icon-plus"
            >新建</el-button
          >
          <div class="inp-more">
            <el-input
              clearable
              size="mini"
              class="inp"
              placeholder="请输入官方发布名称"
              v-model="input"
              @clear="clearVal"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="search"
              ></el-button>
            </el-input>
            <el-button
              icon="el-icon-more"
              class="more"
              @click="dialogOpenMoreVisible = true"
            ></el-button>
            <el-dialog
              title="多 选"
              :visible.sync="dialogOpenMoreVisible"
              width="600px"
            >
              <el-checkbox-group v-model="checkList">
                <el-checkbox label="名称"></el-checkbox>
                <el-checkbox label="栏目"></el-checkbox>
                <el-checkbox label="发布者"></el-checkbox>
                <el-checkbox label="状态"></el-checkbox>
                <el-checkbox label="创建时间"></el-checkbox>
                <el-checkbox label="展示范围"></el-checkbox>
              </el-checkbox-group>
            </el-dialog>
          </div>
        </div>
        <!-- 表格 -->
        <el-table
          :data="tableData"
          border
          stripe
          :header-cell-style="{ background: '#FAFAFA' }"
          v-loading="tableLoading"
          style="width: 100%"
        >
          <el-table-column
            align='center'
            v-if="checkList.includes('名称')"
            prop="officialNewsName"
            label="名称"
          >
          </el-table-column>
          <el-table-column
            align='center'
            v-if="checkList.includes('栏目')"
            prop="officialColumnName"
            label="栏目"
          ></el-table-column>
          <el-table-column
            align='center'
            v-if="checkList.includes('发布者')"
            prop="createByName"
            label="发布者"
          ></el-table-column>
          <el-table-column
            align='center'
            v-if="checkList.includes('状态')"
            prop="state"
            label="状态"
            width="100"
          >
          </el-table-column>
          <el-table-column align='center' v-if="checkList.includes('创建时间')" prop="createTime" label="创建时间"></el-table-column>
          <!-- 平台可见 -->
          <el-table-column
            label="展示范围"
            width="80"
            v-if="(userType == 1 || userType == 2) && checkList.includes('展示范围')"
          >
            <template slot-scope="scope">
              <span @click="check(scope.row.officialNewsId)" class="isClick"
                >查看</span
              >
            </template>
          </el-table-column>
          <el-table-column align='center' label="操作" width="150">
            <template slot-scope="scope" v-if="userType <= scope.row.source">
              <!-- <el-button
                @click="handleDetails(scope.row)"
                type="text"
                size="small"
                >详情</el-button
              > -->
              <el-button @click="handleEdit(scope.row)" type="text" size="small"
                >编辑</el-button
              >
              <el-button @click="handleDel(scope.row)" type="text" size="small"
                >删除</el-button
              >
              <!-- <el-button
                @click="handleCopylink(scope.row)"
                type="text"
                size="small"
                >复制链接</el-button
              > -->
            </template>
          </el-table-column>
          <template slot="empty">
            <hc-empty-data></hc-empty-data>
          </template>
        </el-table>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          :page-size="pageSize"
          :total="total"
          class="paging"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </template>

      <template slot="form">
        <el-form
          ref="addformRef"
          :model="addform"
          :rules="rules"
          label-width="120px"
        >
          <!-- 名称 -->
          <el-form-item label="名称" prop="officialNewsName">
            <el-input v-model="addform.officialNewsName" maxlength="200"></el-input>
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
          <el-form-item label="标题图" prop="urlList">
            <el-upload
              :action="uploadPicUrl"
              list-type="picture-card"
              :on-remove="handleRemove"
              :on-success="handlePicSuccess"
              :file-list="fileList"
              :headers="headersOpt"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
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

          <!-- 是否允许城市停用 -->
          <!-- <el-form-item
          label="是否允许城市停用"
          label-width="140px"
          v-if="isAdmin"
        >
          <el-switch
            v-model="addform.closeAllowed"
            active-value="0"
            active-text="允许"
            inactive-text="不允许"
            inactive-value="1"
          ></el-switch>
        </el-form-item> -->

          <!-- 事件按钮 -->
          <el-form-item>
            <el-button @click="handlePreview">预览</el-button>
            <el-button @click="handleDraft">保存草稿</el-button>
            <el-button @click="handleCreate">直接发布</el-button>
          </el-form-item>
        </el-form>
        <hc-preview v-if="preview" @close="preview = false">
          <div class="preview-title">
            {{addform.officialNewsName || '资讯标题'}}
          </div>
          <div class="preview-time">发布时间：{{dateFormat(new Date())}}</div>
          <div class="preview-content" v-html="quillContent.content || '内容'"></div>
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
import { dateFormat } from "@/util/date"
import HcQuill from "@/views/components/HcQuill";
import HcCityBox from "@/views/components/HcCity/HcCityBox/index";
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index";
import { mapGetters } from "vuex";
import store from "@/store";
import { getAllTagList } from "@/api/tms/city";
import { adminCityList } from "@/api/admin/city";
import HcTableForm from "@/views/components/HcTableForm/index";
import HcEmptyData from "@/views/components/HcEmptyData/index"
import HcPreview from "@/views/components/HcPreview/index"
export default {
  components: { HcQuill, HcCityBox, HcCitySelect, HcTableForm, HcEmptyData, HcPreview },
  data() {
    return {
      isShow: true, //是否显示咨询列表
      uploadPicUrl: "/api/admin/sys_file/oss/upload",
      headersOpt: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      input: "",
      dialogOpenMoreVisible: false,
      checkList: ["名称", "栏目", "发布者", "状态", "创建时间", "展示范围"], //已选中的菜单

      // 发布列表
      tableData: [],
      // 官方发布 - 新增
      addform: {
        cityIdList: [],
        closeAllowed: "0", //启停
      },
      currentPage: 1,
      pageSize: 20,
      total: 0,
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
        officialColumnId: [
          { required: true, message: "请选择栏目", trigger: "change" },
        ],
        cityIdList: [
          { required: true, message: "请输入城市", trigger: "blur" },
        ],
        urlList: [
          { required: true, message: "请添加标题图", trigger: "change" },
        ],
        imageSizeType: [
          { required: true, message: "请选择图片展示比例", trigger: "change" },
        ],
        content: [{ validator: this.contentValidator, required: true }],
      },
      tableLoading: false,
      preview: false
    };
  },
  watch: {
    quillContent() {
      this.$nextTick(() => {
        this.$refs.addformRef.validateField("content");
      });
    },
  },
  methods: {
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
    // 搜索
    search() {
      this.getOfficialReleaseList();
    },
    // 清空搜索
    clearVal() {
      this.getOfficialReleaseList();
    },
    // 新建
    toCreate() {
      this.addform = {
        cityIdList: [this.userInfo.manageCityId],
        closeAllowed: "0", //启停
      };
      this.isShow = false;
      this.publishType = "add";
    },
    // 获取官方发布列表
    getOfficialReleaseList() {
      this.tableLoading = true
      let form = {
        officialColumnName: this.input,
        current: this.currentPage,
        size: this.pageSize,
      };
      // if (this.isAdmin) {
      //   this.addform.source = 1;
      //   form.source = 1;
      // }
      officialReleaseList(form).then((res) => {
        res.data.data.data.records.forEach((item) => {
          if (item.state === 0) {
            item.state = "草稿状态";
          } else if (item.state === 1) {
            item.state = "已生效";
          } else {
            item.state = "已失效";
          }
        });
        this.total = res.data.data.data.total;
        this.tableData = res.data.data.data.records;
      }).finally(() => {
        this.tableLoading = false
      });
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
    // 详情
    // handleDetails(row) {
    //   console.log("详情", row);
    // },
    // 编辑
    handleEdit(row) {
      // console.log("编辑", row);
      officialDetail({
        officialNewsId: row.officialNewsId,
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
        this.addform.urlList = this.urlList;
        this.isShow = false;
      });

      this.publishType = "edit";
    },
    // 删除
    handleDel(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          officialDel({
            officialNewsId: row.officialNewsId,
            cityId: this.userInfo.manageCityId,
          }).then((res) => {
            if (res.data.code !== 0) {
              return this.$message.error("删除失败！");
            }
            this.$message({
              message: "删除成功！",
              type: "success",
            });
            this.getOfficialReleaseList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 复制链接
    // handleCopylink(row) {
    //   console.log("复制链接", row);
    // },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getOfficialReleaseList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getOfficialReleaseList();
    },
    // 保存
    save() {
      officialColumnCreate({}).then((res) => {
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
      this.preview = true
    },
    // 保存草稿
    handleDraft() {
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
              this.getOfficialReleaseList();
              this.isShow = true;
            });
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
                message: "编辑成功！",
                type: "success",
              });
              this.getOfficialReleaseList();
              this.isShow = true;
              this.fileList = [];
            });
          }
        });
      }
    },
    // 直接发布
    handleCreate() {
      this.urlList.forEach((item) => {
        item.imageSizeType = this.addform.imageSizeType; //标题图添加图片尺寸属性
      });
      this.addform.urlList = this.urlList;
      let addform = this.addform;

      addform.officialNewsContent = this.quillContent.content;
      addform.structuredContent = this.quillContent.structuredContent;
      addform.state = 1;
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
              this.getOfficialReleaseList();
              this.isShow = true;
            });
          }
        });
      }
      // 编辑
      else {
        this.$refs.addformRef.validate((valid) => {
          if (valid) {
            officaialNewsUpdate(addform).then((res) => {
              if (res.data.code !== 0) {
                return this.$message.error("编辑失败");
              }
              this.$message({
                message: "编辑成功！",
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
              this.getOfficialReleaseList();
            });
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
  },
  computed: {
    ...mapGetters(["userInfo", "dicList", "userType"]),
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
    this.getOfficialReleaseList();
    this.getCityColumn();
    this.init();
    // console.log("isAdmin", this.isAdmin);
    // console.log("source", this.addform.source);
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
  /deep/ img {
    width: 100% !important;
  }
}
</style>
