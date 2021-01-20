<template>
  <!-- 官方发布 -->
  <div>
    <basic-container>
      <div class="title">官方发布</div>

      <div class="add-inp-more">
        <!-- 新建按钮 -->
        <el-button
          @click="dialogAddFormVisible = true"
          type="primary"
          class="el-icon-plus"
        >
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

      <!-- 新建官方发布栏目弹窗 -->
      <el-dialog title="新增官方发布栏目" :visible.sync="dialogAddFormVisible">
        <el-form :model="addform">
          <!-- 栏目名称 -->
          <el-form-item label="栏目名称" label-width="70px">
            <el-input v-model="addform.officialColumnName"></el-input>
          </el-form-item>
          <!-- 是否允许城市关闭 -->
          <el-form-item label="是否允许城市关闭" label-width="125px">
            <el-radio-group v-model="addform.closeAllowed">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="save">保 存</el-button>
          <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
// import Quill from "quill";
import {
  officialReleaseList,
  officialColumnCreate,
} from "@/api/officialRelease/officialRelease.js";
import store from "@/store";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      // 新建官方发布栏目弹窗
      dialogAddFormVisible: false,
      input: "",

      // 发布列表
      tableData: [],
      // 新建官方发布栏目数据
      addform: {
        officialColumnName: "",
        closeAllowed: "",
        cityIdList: [], //城市ID集合
      },
      currentPage: 1,
      pageSize: 5,
      total: 30,
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
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  created() {
    this.getOfficialReleaseList();
    // const userInfo = store.getters.userInfo;
    console.log("userInfo", this.userInfo);
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
