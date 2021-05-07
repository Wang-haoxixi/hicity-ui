<template>
  <div>
    <basic-container>
      <div class="title">
        <div>人员管理</div>
        <el-button @click="backClick">返回</el-button>
      </div>
      <div>
        <el-button
          v-if="tableData.length > 0"
          type="primary"
          @click="exportData"
          size="mini"
          style="margin-right: 10px"
          >导出</el-button
        >
        <el-input clearable placeholder="请输入关键字" size="small" v-model="searchContent" class="input-with-select">
          <el-select v-model="selectType" slot="prepend" @change="handleChangeType" placeholder="请选择" style="width: 90px">
            <el-option label="用户名" value="1"></el-option>
            <el-option label="手机号" value="2"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="名称" width="180">
          </el-table-column>
          <el-table-column label="报名信息" width="100">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="handleCheck(scope.row.enroleId)"
                >查看</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="报名时间" width="160">
          </el-table-column>
          <el-table-column label="票名">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.info != 'null'"
                type="text"
                size="mini"
                @click="handleCheckTicketInfo(scope.row.info)"
                >{{ scope.row.ticketingName }}</el-button
              >
              <span v-else>{{ scope.row.ticketingName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderNum" label="购票数量"></el-table-column>
          <el-table-column prop="orderStatusName" label="订单状态">
          </el-table-column>
          <el-table-column prop="applyStatusName" label="报名状态">
          </el-table-column>
          <el-table-column prop="cancelNum" label="核销状态"></el-table-column>
          <el-table-column prop="auditStatus" label="审核状态">
            <template slot-scope="scope">
              {{ scope.row.auditStatus | auditStatusFilters }}
            </template>
          </el-table-column>
          <el-table-column label="批注" width="80">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="handleAnnotation(scope.row)"
                >{{ !scope.row.soRemarks ? "添加" : "查看" }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="handleSignIn(scope.row)"
                >核销签到</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <el-dialog
          title="添加批注"
          :visible.sync="dialogAnnotationVisible"
          append-to-body
          width="50%"
        >
          <el-input
            maxlength="300"
            show-word-limit
            type="textarea"
            :rows="4"
            placeholder="您可以输入对这个报名者的备注，方便您的管理与服务"
            v-model="annotation"
          >
          </el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogAnnotationVisible = false"
              >取 消</el-button
            >
            <el-button type="primary" @click="handleSaveAnnotation"
              >保 存</el-button
            >
          </span>
        </el-dialog>

        <el-dialog
          title="查看信息"
          :visible.sync="dialogApplyInfoVisible"
          append-to-body
          width="50%"
        >
          <!-- :before-close="handleCloseDialogApplyInfo" -->
          <div v-if="applyInfoForm.length>0">
            <!-- :plain='item.actived' -->
            <el-button
              size="mini"
              type="primary"
              class="tagInfo"
              @click="changeName(item, index)"
              v-for="(item, index) in applyInfoForm"
              plain
              :key="index"
              >{{ item.formItems[0].value }}</el-button
            >
            <el-form>
              <el-form-item
                :required="formItem.must"
                v-for="(formItem, indexF) in applyInfo.formItems || []"
                :key="indexF"
                :label="formItem.label"
              >
                <el-input
                  :value="formItem.value"
                  disabled
                  autocomplete="off"
                  v-if="formItem.type == 'input'"
                ></el-input>
                <el-input
                  v-if="formItem.type == 'textarea'"
                  disabled
                  type="textarea"
                  :rows="2"
                  :value="formItem.value"
                >
                </el-input>
                <el-radio
                  v-else-if="formItem.type == 'radio'"
                  v-for="(radioItem, indexR) in formItem.optionsList"
                  disabled
                  :key="indexR"
                  :label="true"
                  v-model="radioItem.select"
                  >{{ radioItem.label }}</el-radio
                >
                <el-checkbox
                  disabled
                  v-else-if="formItem.type == 'checkbox'"
                  v-for="(checkboxItem, indexC) in formItem.optionsList"
                  v-model="checkboxItem.select"
                  :key="indexC"
                  :label="checkboxItem.label"
                ></el-checkbox>
              </el-form-item>
              <el-form-item label="标记为VIP：">
                <el-switch v-model="applyInfo.isVip"></el-switch>
              </el-form-item>
              <el-form-item label="座位号">
                <el-input v-model="applyInfo.seatNumber"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" style="text-align: right">
              <el-button @click="dialogApplyInfoVisible = false"
                >取 消</el-button
              >
              <el-button type="primary" @click="handleSaveInfo"
                >保 存</el-button
              >
            </div>
          </div>
          <div v-else style="text-align: center;color: #909399;">暂无报名信息</div>

        </el-dialog>

        <el-dialog
          title="核销签到"
          :visible.sync="dialogSignInVisible"
          append-to-body
          width="50%"
        >
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >

          <el-checkbox-group
            v-model="checkedSignInCode"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="(item, i) in signInCodeData"
              :label="item"
              :key="i"
              :disabled="item.writeOffStatus == 0 ? false : true"
              >{{ item.orderNo }}</el-checkbox
            >
          </el-checkbox-group>

          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogSignInVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSaveSignIn"
              >保 存</el-button
            >
          </span>
        </el-dialog>

        <el-dialog
          title="用户选择"
          :visible.sync="dialogUserSelectVisible"
          append-to-body
          width="50%"
        >
          <div>参加项目</div>
          <el-checkbox
            v-for="(item, index) in infoList"
            :key="index"
            size="medium"
            v-model="item.select"
            disabled
            style="display: block; margin-top: 10px"
            >{{ item.label }}</el-checkbox
          >
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogUserSelectVisible = false"
              >取 消</el-button
            >
            <el-button type="primary" @click="dialogUserSelectVisible = false"
              >确 定</el-button
            >
          </span>
        </el-dialog>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.current"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          :page-size="query.size"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          class="paging"
        ></el-pagination>
      </div>
    </basic-container>
  </div>
</template>

<script>
import {
  peopleManagement,
  formInquire,
  addAnnotation,
  // remarkInfo,
  signInCode,
  checkCode,
  dataExport,
  saveInfo,
} from "@/api/activity/personnel";
export default {
  data() {
    return {
      tableData: [],
      query: {
        activityId: null,
        userName: "",
        phone: "",
        current: 1,
        size: 20,
      },
      applyInfo: {}, //单条报名信息
      dialogAnnotationVisible: false,
      dialogApplyInfoVisible: false,
      dialogSignInVisible: false,
      dialogUserSelectVisible: false,
      total: 0,
      applyInfoForm: [],
      annotation: "",
      enroleId: "",
      checkAll: false,
      isIndeterminate: true,
      checkedSignInCode: [], //已选择
      signInCodeData: [], //核销数组
      infoList: [],

      selectType: '',//搜索类型
      searchContent: ''//搜索内容
    };
  },
  created() {
    this.query.activityId = this.$route.query.id;
    this.getPeopleManagementList();
  },
  filters: {
    auditStatusFilters(val) {
      if (val == 0) {
        return "不需要审核";
      } else if (val == 1) {
        return "待审核";
      } else if (val == 2) {
        return "审核通过";
      } else if (val == 3) {
        return "审核未通过";
      }
    },
  },
  methods: {
    exportData() {
      dataExport(this.$route.query.id);
    },
    backClick() {
      this.$router.go(-1);
    },
    handleChangeType(){
      this.searchContent = ''
    },
    // 搜索
    handleSearch(){
      if(this.selectType == ''){
        return this.$message.error('请选择搜索类型')
      }
      if(this.selectType == '1'){
        this.query.userName = this.searchContent
        this.query.phone = ''
        this.getPeopleManagementList()
      }else if(this.selectType == '2'){
        this.query.phone = this.searchContent
        this.query.userName = ''
        this.getPeopleManagementList()
      }
    },
    // 批注
    handleAnnotation(row) {
      this.enroleId = row.enroleId;
      this.dialogAnnotationVisible = true;
      this.annotation = row.soRemarks;
    },
    handleCheckTicketInfo(info) {
      this.infoList = JSON.parse(info);
      this.dialogUserSelectVisible = true;
    },
    handleSaveAnnotation() {
      addAnnotation({
        id: this.enroleId,
        soRemarks: this.annotation,
      }).then((res) => {
        this.getPeopleManagementList();
      });
      this.dialogAnnotationVisible = false;
    },
    handleCheck(enroleId) {
      this.applyInfoForm = [];
      this.applyInfo = {}
      this.dialogApplyInfoVisible = true;
      formInquire({ enroleId: enroleId }).then((res) => {
        this.applyInfoForm = res.data.data.data;
        if (this.applyInfoForm && this.applyInfoForm.length > 0) {
          this.applyInfo = this.applyInfoForm[0];
        }
      });
    },
    handleSaveSignIn() {
      let codeArr = this.checkedSignInCode.map((item) => {
        return item.orderNo;
      });
      checkCode({
        orderNos: codeArr,
      }).then((res) => {
        this.getPeopleManagementList();
      });
      this.dialogSignInVisible = false;
    },
    // 核销签到
    handleSignIn(row) {
      this.dialogSignInVisible = true;
      this.enroleId = row.enroleId;
      signInCode({ enroleId: this.enroleId }).then((res) => {
        this.signInCodeData = res.data.data.data;
      });
    },
    getPeopleManagementList() {
      peopleManagement(this.query).then((res) => {
        if (res.data.code != 0) {
          return this.$message.error("获取列表失败");
        }
        this.tableData = res.data.data.data.records;
        this.total = res.data.data.data.total;
      });
    },
    handleSizeChange(val) {
      this.query.size = val;
      this.getPeopleManagementList();
    },
    handleCurrentChange(val) {
      this.query.current = val;
      this.getPeopleManagementList();
    },
    changeName(item, index) {
      // item.actived = false
      this.applyInfo = item;
    },
    handleCloseDialogApplyInfo(){
      this.applyInfoForm = [];
      this.applyInfo = {}
    },
    handleCheckAllChange(val) {
      let writeOffStatusCode = this.signInCodeData.filter((item) => {
        return item.writeOffStatus == "0";
      });
      this.checkedSignInCode = val ? writeOffStatusCode : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.checkedSignInCode.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.checkedSignInCode.length;
    },
    handleSaveInfo() {
      if (this.applyInfo.seatNumber.length > 15) {
        return this.$message.error("座位号字数不能超过15个字符");
      }
      saveInfo(this.applyInfo).then((res) => {
        if (res.data.code != 0) {
          return this.$message.error("保存失败");
        }
        this.$message.success("保存成功");
        this.dialogApplyInfoVisible = false;
      });
    },
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
.paging {
  margin-top: 20px;
  text-align: right;
}
.tagInfo {
  margin-bottom: 15px;
}

.input-with-select{
  width: 400px;
}
</style>