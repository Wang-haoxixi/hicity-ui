<template>
  <basic-container>
    <div class="title">活动列表</div>

    <el-button @click="addCreate" type="primary" class="el-icon-plus">
      新增</el-button
    >

    <el-table
      style="margin-top: 10px"
      :header-cell-style="{ background: '#FAFAFA' }"
      :row-key="getRowKeys"
      :expand-row-keys="expends"
      :data="tableData"
    >
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-button
            class="managBtn"
            icon="el-icon-user"
            size="mini"
            type="text"
            @click="peopleManagement(props)"
            >人员管理</el-button
          >
          <el-button
            class="managBtn"
            icon="el-icon-tickets"
            size="mini"
            type="text"
            @click="ticketManagement(props)"
            >票务管理</el-button
          >
          <span style="margin-left: 30px; color: #919397"
            >发布时间：2020-12-29 10:39</span
          >
        </template>
      </el-table-column>
      <!-- 其他列表页 -->
      <el-table-column label="活动封面" width="200">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.poster"
            fit="contain"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="活动信息">
        <template slot-scope="scope">
          <div>{{ scope.row.name }}</div>
          <div>
            <i class="el-icon-time" style="margin-right: 5px"></i
            >{{ scope.row.createTime }} 至 {{ scope.row.endTime }}
          </div>
          <div>
            <i class="el-icon-location-outline" style="margin-right: 5px"></i
            >{{ scope.row.field }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="活动状态" width="100">
        <template slot-scope="scope">
          {{ scope.row.statusFlag | actStateFilter }}
        </template>
      </el-table-column>
      <el-table-column prop="exhibits" label="展示范围" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="check(scope.row.id)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="joinNumber"
        label="报名人数"
        width="100"
      ></el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 5, 10, 15]"
      :page-size="pageSize"
      :total="total"
      background
      layout="total, sizes, prev, pager, next, jumper"
      class="paging"
    ></el-pagination>

    <!-- 查看城市范围弹窗 -->
    <el-dialog
      title="展示范围"
      :visible.sync="showCityDialogVisible"
      width="70%"
    >
      <hc-city-box
        view-only
        :init-city-list="initCityList"
        :all-city-list="allCityList"
      ></hc-city-box>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showCityDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="showCityDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import { activitiesList } from "@/api/activity/activity";
import HcCityBox from "@/views/components/HcCityBox/index";
export default {
  components: { HcCityBox },
  data() {
    return {
      tableData: [
        {
          id: 1,
          poster: "xxx",
          name: "",
          createTime: "",
          endTime: "",
          field: "",
          statusFlag: "", //活动状态标志（0草稿、1进行中、2已结束 3被下架）
          joinNumber: "",
        },
      ],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      expends: [], // 展开行数组id
      showCityDialogVisible: false, //控制展示城市
      allCityList: [],
      initCityList: [],
    };
  },
  computed: {},
  filters: {
    // 活动状态过滤
    actStateFilter(val) {
      if (val === 0) {
        return "草稿";
      } else if (val === 1) {
        return "进行中";
      } else if (val === 2) {
        return "已结束";
      } else {
        return "被下架";
      }
    },
  },
  methods: {
    // 获取活动列表数据
    getActivitiesListFn() {
      activitiesList({
        current: this.currentPage,
        size: this.pageSize,
      }).then((res) => {
        // console.log(res);
        if (res.data.code !== 0) {
          return this.$message.error("获取活动数据失败！");
        }
        this.tableData = res.data.data.data.records;
        this.total = res.data.data.data.total;
        this.currentPage = res.data.data.data.current;
        this.pageSize = res.data.data.data.size;
        console.log(this.tableData);
      });
    },
    // 编辑
    handleEdit(res) {
      console.log("编辑", res);
      this.$router.push("/publish");
    },
    // 删除
    handleDelete(res) {
      console.log("删除", res);
      this.$confirm("确定删除该活动?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log("确定");
        })
        .catch(() => {
          console.log("取消");
        });
    },
    // 查看
    check(id) {
      console.log(id);
      // checkCity({
      //   officialNewsId: id,
      // }).then((res) => {
      //   console.log("res", res);
      //   let cityList = res.data.data.data;
      //   let allCityList = [];
      //   let initCityList = [];
      //   for (let i = 0; i < cityList.length; i++) {
      //     allCityList.push({
      //       cityId: cityList[i].cityId,
      //       cityName: cityList[i].cityName,
      //     });
      //     if (cityList[i].isOpening) {
      //       initCityList.push(cityList[i].cityId);
      //     }
      //   }
      //   this.initCityList = initCityList;
      //   this.allCityList = allCityList;
      // });
      // this.showCityDialogVisible = true;
    },
    handleSizeChange(val) {},
    handleCurrentChange(val) {},
    // 新增
    addCreate() {
      this.$router.push("/publish");
    },
    // 人员管理
    peopleManagement() {},
    // 票务管理
    ticketManagement() {},
    // 遍历数据获取展开列id
    getExpends() {
      var Id = this.tableData.map((item) => item.id);
      this.expends = Id;
    },
    // 行数据的 Key
    getRowKeys(row) {
      return row.id;
    },
  },
  created() {
    this.getActivitiesListFn();
    this.getExpends();
  },
};
</script>

<style lang="scss" scoped>
.title {
  padding-bottom: 5px;
  font-size: 18px;
  font-weight: 400;
}
.paging {
  margin-top: 20px;
  text-align: right;
}
.managBtn {
  color: #c0c4cc;
  font-size: 14px;
}
</style>
