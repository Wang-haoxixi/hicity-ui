<template>
  <!-- 官方发布 -->
  <div>
    <!-- 官方发布 -->
    <basic-container v-if="isShow">
      <div class="title">官方发布</div>

      <div class="add-inp-more">
        <!-- 新建按钮 -->
        <el-button @click="isShow = false" type="primary" class="el-icon-plus">
          新建</el-button
        >
        <div class="inp-more">
          <el-input
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
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="officialNewsName" label="名称">
        </el-table-column>
        <el-table-column
          prop="officialColumnName"
          label="栏目"
        ></el-table-column>
        <el-table-column prop="createByName" label="发布者"></el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          width="180"
        ></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="展示范围" width="180">
          <template slot-scope="scope">
            <span @click="check(scope.row)" class="isClick">查看</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="handleDetails(scope.row)"
              type="text"
              size="small"
              >详情</el-button
            >
            <el-button @click="handleEdit(scope.row)" type="text" size="small"
              >编辑</el-button
            >
            <el-button @click="handleDel(scope.row)" type="text" size="small"
              >删除</el-button
            >
            <el-button
              @click="handleCopylink(scope.row)"
              type="text"
              size="small"
              >复制链接</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="pageSize"
        :total="total"
        class="paging"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </basic-container>

    <!-- 官方发布 - 新增 -->
    <basic-container v-else>
      <div class="title">
        官方发布 - 新增
        <el-button @click="isShow = true">返回</el-button>
      </div>
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
                <el-option label="公告" value="0"></el-option>
                <el-option label="咨询" value="1"></el-option>
                <el-option label="活动" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 发布城市 -->
            <el-form-item label="发布城市">
              <!-- <el-select v-model="addform.cityIdList" placeholder="请选择">
                <el-option label="公告" value="0"></el-option>
                <el-option label="咨询" value="1"></el-option>
                <el-option label="活动" value="2"></el-option>
              </el-select> -->
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

        <!-- 详情 -->
        <el-form-item label="详情">
          <!-- <el-input v-model="addform.officialNewsContent"></el-input> -->
          <hc-quill v-model="quillContent"></hc-quill>
        </el-form-item>

        <!-- 是否允许城市停用 -->
        <el-form-item v-if="isAdmin" label="是否允许城市停用：">
          <el-switch
            v-model="formData.closeAllowed"
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
// import Quill from "quill";
import {
  officialReleaseList,
  officaialNewsCreate,
} from "@/api/officialRelease/officialRelease.js";
import HcQuill from "@/views/components/HcQuill";
import HcCityBox from "@/views/components/HcCityBox/index";
import HcCitySelect from "@/views/components/HcCitySelect/index";
import { mapGetters } from "vuex";
import store from "@/store";
export default {
  components: { HcQuill, HcCityBox, HcCitySelect },
  data() {
    return {
      isShow: false, //是否显示咨询列表
      uploadPicUrl: "/api/admin/sys-file/oss/upload",
      headersOpt: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      input: "",

      // 发布列表
      tableData: [],
      // 官方发布 - 新增
      addform: {},
      currentPage: 1,
      pageSize: 5,
      total: 30,

      fileList: [],
      urlList: [], //图片墙数组
      quillContent: {
        content: "",
        structuredContent: "",
      },
    };
  },
  methods: {
    // 获取官方发布列表
    getOfficialReleaseList() {
      officialReleaseList({
        current: this.currentPage,
        size: this.pageSize,
      }).then((res) => {
        console.log("官方发布列表", res);
        this.tableData = res.data.data.data.records;
      });
    },
    // 查看
    check(row) {
      console.log("查看", row);
    },
    // 详情
    handleDetails(row) {
      console.log("详情", row);
    },
    // 编辑
    handleEdit(row) {
      console.log("编辑", row);
    },
    // 删除
    handleDel(row) {
      console.log("删除", row);
    },
    // 复制链接
    handleCopylink(row) {
      console.log("复制链接", row);
    },
    handleSizeChange(val) {},
    handleCurrentChange(val) {},
    // 保存
    save() {
      console.log("新增数据", this.addform);
      officialColumnCreate({}).then((res) => {
        console.log("新增保存", res);
      });
    },
    // 图片移除
    handleRemove() {},
    // 图片上传成功的钩子
    handlePicSuccess(res) {
      console.log("图片上传成功的钩子", res);
    },
    // 预览
    preview() {},
    // 保存草稿
    handleDraft() {},
    // 直接发布
    handleCreate() {},
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  created() {
    this.getOfficialReleaseList();
  },

  // mounted() {
  //   var options = {
  //     debug: "info",
  //     modules: {
  //       toolbar: "#toolbar",
  //     },
  //     placeholder: "Compose an epic...",
  //     readOnly: true,
  //     theme: "snow",
  //   };
  //   var editor = new Quill("#editor");
  // },
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
