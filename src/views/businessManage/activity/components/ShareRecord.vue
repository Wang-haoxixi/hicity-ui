<template>
  <hc-table-form title="分销管理" :formVisible="true" @go-back="goBack">
    <template slot="form">
      <SearchSection
        placeholder="分销人员"
        :refresh="true"
        @searchShare="searchShare"
      />
      <el-table
        border
        style="width: 100%"
        v-loading="shareListLoading"
        :header-cell-style="{ background: '#FAFAFA', color: 'rgb(51 51 51)' }"
        :data="shareList"
      >
        <el-table-column prop="userName" label="分销人员" width="180">
        </el-table-column>
        <el-table-column prop="activityName" label="活动名称">
        </el-table-column>
        <el-table-column prop="shareNumber" label="分享次数" width="100">
        </el-table-column>
        <el-table-column prop="signUpNumber" label="报名人次" width="100">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="handleInfo(scope.row)">
              查看报名信息
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleShareSizeChange"
          @current-change="handleShareCurrentChange"
          :current-page="query.current"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          :page-size="query.size"
          :total="shareListTotal"
        >
        </el-pagination>
      </div>
    </template>
    <!-- 报名信息弹窗 -->
    <el-dialog
      title="查看报名信息"
      width="70%"
      append-to-body
      :visible.sync="dialogApplyInfoVisible"
      @closed="closeApplyInfoDialog"
    >
      <div>
        <SearchSection
          ref="applyInfoRef"
          placeholder="关键字"
          :refresh="true"
          :prepend="true"
          @searchApplyInfo="searchApplyInfo"
        />
        <el-table
          border
          style="width: 100%"
          v-loading="applyInfoDataLoading"
          :cell-style="{ background: '#fff' }"
          :header-cell-style="{ background: '#FAFAFA', color: 'rgb(51 51 51)' }"
          :data="applyInfoData"
          :span-method="mergeCell"
        >
          <el-table-column
            prop="distributionUserName"
            label="分销人员"
            width="150"
          >
          </el-table-column>
          <el-table-column prop="enroleName" label="报名人员" width="150">
          </el-table-column>
          <el-table-column label="报名信息">
            <template slot-scope="scope">
              <div>
                {{ scope.row.info.userName }} &emsp;
                {{ scope.row.info.phone }} &emsp; {{ scope.row.info.company }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="ticketingType" label="购票信息" width="100">
          </el-table-column>
          <el-table-column prop="createTime" label="报名时间" width="180">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </hc-table-form>
</template>

<script>
import { shareList, applyInfo } from "@/api/activity/activity";
import SearchSection from "./components/SearchSection.vue";
export default {
  components: {
    SearchSection,
  },
  data() {
    return {
      dialogApplyInfoVisible: false, // 查看报名信息
      shareList: [], // 分销数据
      applyInfoData: [], // 报名列表信息数据
      // 分销列表参数
      query: {
        activityId: "",
        userName: "",
        current: 1,
        size: 10,
      },
      // 查看报名信息参数
      applyInfoQuery: {
        name: "",
        phone: "",
        company: "",
        distributionId: "", // 活动分销ID
        distributionUserId: "", // 分销人员ID
      },
      shareListLoading: false,
      applyInfoDataLoading: false,

      shareListTotal: 0,
    };
  },
  methods: {
    closeApplyInfoDialog() {
      this.$refs.applyInfoRef.handleReset();
      this.applyInfoQuery = {
        distributionId: "",
        name: "",
        phone: "",
        company: "",
      };
      this.applyInfoData = [];
    },
    // 处理获取的报名信息列表数据
    handleData(data) {
      if(Object.keys(data).length == 0) return this.applyInfoData = []
      let newList = [];
      let outNum = 0;
      for (let i = 0; i < data.personnelInfos.length; i++) {
        const enroleName = data.personnelInfos[i].enroleName;
        outNum += data.personnelInfos[i].signUps.length;
        for (let j = 0; j < data.personnelInfos[i].signUps.length; j++) {
          newList.push({
            rows: j == 0 ? data.personnelInfos[i].signUps.length : 0,
            distributionUserName: data.distributionUserName, // 分销者
            enroleName, // 购票者
            info: data.personnelInfos[i].signUps[j], // 购票人员信息
            // 购票信息
            ticketingType:
              data.personnelInfos[i].signUps[j].ticketingType &&
              data.personnelInfos[i].signUps[j].ticketingType == 1
                ? "免费票"
                : "付费票",
            createTime: data.personnelInfos[i].signUps[j].createTime, // 报名时间
          });
        }
      }
      for (let i = 0; i < newList.length; i++) {
        newList[i].outRows = i == 0 ? outNum : 0;
      }
      this.applyInfoData = newList;
    },
    mergeCell({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0) {
        if (row.outRows) {
          return {
            colspan: 1,
            rowspan: row.outRows,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
      if (columnIndex == 1) {
        if (row.rows) {
          return {
            colspan: 1,
            rowspan: row.rows,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    goBack() {
      this.$emit("hideShareRecord");
    },
    handleInfo({ id, userId }) {
      this.dialogApplyInfoVisible = true; // 报名信息弹窗
      this.applyInfoDataLoading = true; // 加载中
      this.applyInfoQuery.distributionId = id; // 活动分销ID
      this.applyInfoQuery.distributionUserId = userId; // 分销人员ID(邀请人ID)
      this.getApplyInfo();
    },
    getApplyInfo() {
      applyInfo(this.applyInfoQuery).then((res) => {
        if (res.data.data.businessCode == 1000) {
          let data = res.data.data.data;
          this.handleData(data);
          this.applyInfoDataLoading = false;
        }
      });
    },
    getShareList() {
      this.shareListLoading = true;
      shareList(this.query).then((res) => {
        this.shareListTotal = res.data.data.data.total;
        this.shareList = res.data.data.data.records;
        this.shareListLoading = false;
      });
    },
    updateData(id) {
      this.query.activityId = id;
      this.getShareList();
    },
    searchShare(data = "") {
      this.query.userName = data;
      this.query.current = 1;
      this.getShareList();
    },
    handleShareSizeChange(val) {
      this.query.size = val;
      this.query.current = 1;
      this.getShareList();
    },
    handleShareCurrentChange(val) {
      this.query.current = val;
      this.getShareList();
    },
    /**
     * @description: 代表搜索报名信息
     * @constructor
     * @param { String } data - 搜索数据.
     * @param { String } selectType - 代表搜索报名信息.
     * @return void
     */
    searchApplyInfo(data, selectType) {
      if (selectType == "name") {
        this.applyInfoQuery.name = data;
        this.applyInfoQuery.phone = "";
        this.applyInfoQuery.company = "";
        this.getApplyInfo();
      } else if (selectType == "phone") {
        this.applyInfoQuery.name = "";
        this.applyInfoQuery.phone = data;
        this.applyInfoQuery.company = "";
        this.getApplyInfo();
      } else if (selectType == "company") {
        this.applyInfoQuery.name = "";
        this.applyInfoQuery.phone = "";
        this.applyInfoQuery.company = data;
        this.getApplyInfo();
      } else {
        this.applyInfoQuery.name = "";
        this.applyInfoQuery.phone = "";
        this.applyInfoQuery.company = "";
        this.getApplyInfo();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination-box {
  padding: 10px 20px;
  margin: 15px 0 10px;
  text-align: right;
}
</style>