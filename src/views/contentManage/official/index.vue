<template>
  <!-- 官方发布 -->
  <div>
    <!-- 官方发布 -->
    <basic-container v-if="isShow">
      <div class="title">官方发布</div>

      <div class="add-inp-more">
        <!-- 新建按钮 -->
        <el-button
          size="mini"
          @click="toCreate"
          type="primary"
          class="el-icon-plus"
        >
          新建</el-button
        >
        <div class="inp-more">
          <el-input
            size="mini"
            class="inp"
            placeholder="请输入"
            suffix-icon="el-icon-search"
            v-model="input"
          >
          </el-input>
          <el-button icon="el-icon-more" class="more"></el-button>
        </div>
      </div>

      <!-- 表格 -->
      <el-table
        :data="tableData"
        border
        stripe
        :header-cell-style="{ background: '#FAFAFA' }"
        style="width: 100%"
      >
        <el-table-column prop="officialNewsName" label="名称">
        </el-table-column>
        <el-table-column
          prop="officialColumnName"
          label="栏目"
        ></el-table-column>
        <el-table-column prop="createByName" label="发布者"></el-table-column>
        <el-table-column prop="state" label="状态" width="100">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <!-- 平台可见 -->
        <el-table-column label="展示范围" width="80" v-if="isAdmin">
          <template slot-scope="scope">
            <span @click="check(scope.row.officialNewsId)" class="isClick"
              >查看</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template
            slot-scope="scope"
            v-if="isAdmin || (!isAdmin && scope.row.source == 2)"
          >
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
      </el-table>

      <!-- 展示城市 -->
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
    </basic-container>

    <!-- 官方发布 - 新增 -->
    <basic-container v-else>
      <div class="title">官方发布 - 新增</div>
      <el-form ref="addformRef" :model="addform" label-width="80px">
        <!-- 名称 -->
        <el-form-item label="名称">
          <el-input v-model="addform.officialNewsName"></el-input>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <!-- 栏目 -->
            <el-form-item label="栏目">
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
            <el-form-item label="发布城市" v-if="isAdmin">
              <hc-city-select v-model="addform.cityIdList"></hc-city-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 标题图 -->
        <el-form-item label="标题图">
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
        <el-form-item label="图片展示比例" label-width="100px">
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
        <el-form-item label="详情">
          <hc-quill v-model="quillContent"></hc-quill>
        </el-form-item>

        <!-- 是否允许城市停用 -->
        <el-form-item
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
        </el-form-item>

        <!-- 事件按钮 -->
        <el-form-item>
          <el-button @click="preview">预览</el-button>
          <el-button @click="handleDraft">保存草稿</el-button>
          <el-button @click="handleCreate">直接发布</el-button>
        </el-form-item>
      </el-form>
    </basic-container>
  </div>
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
import HcQuill from "@/views/components/HcQuill";
import HcCityBox from "@/views/components/HcCityBox/index";
import HcCitySelect from "@/views/components/HcCitySelect/index";
import { mapGetters } from "vuex";
import store from "@/store";
import { getAllTagList } from "@/api/tms/city";
import { adminCityList } from "@/api/admin/city";
export default {
  components: { HcQuill, HcCityBox, HcCitySelect },
  data() {
    return {
      isShow: true, //是否显示咨询列表
      uploadPicUrl: "/api/admin/sys_file/oss/upload",
      headersOpt: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      input: "",

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
      urlList: [], //图片墙数组
      quillContent: {
        content: "",
        structuredContent: "",
      },
      // 栏目数据
      columnData: [],
      cityViewDialogVisible: false, //展示城市弹窗
      cityList: [],
      allCityList: [],
      initCityList: [],
      tagList: [],
      allCity: [],
      publishType: "",
    };
  },
  methods: {
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
      if (!this.isAdmin) {
        this.addform = {
          cityIdList: [this.userInfo.manageCityId],
          closeAllowed: "0", //启停
        };
        this.isShow = false;
        this.publishType = "add";
        return false;
      }
      this.addform = {
        cityIdList: [1],
        closeAllowed: "0", //启停
      };
      this.isShow = false;
      this.publishType = "add";
    },
    // 获取官方发布列表
    getOfficialReleaseList() {
      if (this.isAdmin) {
        this.addform.source = 1;
      }
      officialReleaseList({
        current: this.currentPage,
        size: this.pageSize,
        // source: this.addform.source, //1平台，2城市
      }).then((res) => {
        res.data.data.data.records.forEach((item) => {
          if (item.state === 0) {
            item.state = "草稿状态";
          } else if (item.state === 1) {
            item.state = "已生效";
          } else {
            item.state = "已失效";
          }
        });
        console.log("官方发布列表", res);
        this.total = res.data.data.data.total;
        this.tableData = res.data.data.data.records;
      });
    },
    // 查看
    check(id) {
      console.log("查看", id);
      checkCity({
        officialNewsId: id,
      }).then((res) => {
        console.log("res", res);
        let cityList = res.data.data.data;
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
      });
      this.cityViewDialogVisible = true;
    },
    // 详情
    // handleDetails(row) {
    //   console.log("详情", row);
    // },
    // 编辑
    handleEdit(row) {
      console.log("编辑", row);
      officialDetail({
        officialNewsId: row.officialNewsId,
      }).then((res) => {
        console.log("res", res);
        this.addform = res.data.data.data;
        this.quillContent = {
          content: res.data.data.data.officialNewsContent,
          structuredContent: res.data.data.data.structuredContent,
        };
        this.isShow = false;
        console.log("addform", this.addform);
        this.urlList = [];
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
        console.log("urlList", this.urlList);
      });
      this.publishType = "edit";
      // console.log('this.addform.urlList',this.addform.urlList)
    },
    // 删除
    handleDel(row) {
      console.log("删除", row);

      officialDel({
        officialNewsId: row.officialNewsId,
        cityId: this.userInfo.manageCityId,
      }).then((res) => {
        console.log(res);
        if (res.data.code !== 0) {
          return this.$message.error("删除失败！");
        }
        this.$message({
          message: "删除成功！",
          type: "success",
        });
        this.getOfficialReleaseList();
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
      console.log("新增数据", this.addform);
      officialColumnCreate({}).then((res) => {
        console.log("新增保存", res);
      });
    },
    // 图片移除
    handleRemove(res, file) {
      console.log("ree", res);
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
      console.log("urlList", this.urlList);
    },
    // 图片上传成功的钩子
    handlePicSuccess(res) {
      console.log("图片上传成功的钩子", res);
      this.urlList.push({
        type: "image",
        newsUrl: res.data.data.url,
        imageSizeType: this.addform.imageSizeType,
      });
    },
    // 预览
    preview() {},
    // 保存草稿
    handleDraft() {},
    // 直接发布
    handleCreate() {
      this.urlList.forEach((item) => {
        item.imageSizeType = this.addform.imageSizeType;
      });
      this.addform.urlList = this.urlList;
      console.log("aaa", this.addform);

      let addform = this.addform;
      console.log(addform);

      addform.officialNewsContent = this.quillContent.content;
      addform.structuredContent = this.quillContent.structuredContent;
      console.log("addform", addform);

      if (this.publishType == "add") {
        officaialNewsCreate(addform).then((res) => {
          // console.log("直接发布", res);
          if (res.data.code !== 0) {
            return this.$message.error("发布失败");
          }
          this.$message({
            message: "发布成功！",
            type: "success",
          });
          this.getOfficialReleaseList();
          this.isShow = true;
        });
      } else {
        console.log('sss',addform);
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
    ...mapGetters(["userInfo", "dicList"]),
    // 3/4平台
    isAdmin() {
      return this.userInfo.userType == 3 || this.userInfo.userType == 4;
    },
  },
  created() {
    this.getOfficialReleaseList();
    this.getCityColumn();
    this.init();
    console.log("userInfo", this.userInfo);
    // console.log("isAdmin", this.isAdmin);
    console.log("dicList", this.dicList);
    // console.log("source", this.addform.source);
  },
};
</script>

<style lang="scss" scoped>
.title {
  padding-bottom: 5px;
  font-size: 18px;
  font-weight: 400;
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
</style>
