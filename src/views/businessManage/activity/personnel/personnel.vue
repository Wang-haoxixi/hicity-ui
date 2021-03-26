<template>
  <div>
    <basic-container>
      <div class="title">
        <div>人员管理</div>
        <el-button @click="backClick">返回</el-button>
      </div>
      <div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="名称" width="180">
          </el-table-column>
          <el-table-column label="报名信息" width="180">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="handleCheck(scope.row.enroleId)"
                >查看</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="报名时间">
          </el-table-column>
          <el-table-column label="票名">
            <template slot-scope="scope">
              <el-button v-if="JSON.parse(scope.row.info).length>0" type="text" size="mini" @click="handleCheckTicketInfo(scope.row.info)">{{scope.row.ticketingName}}</el-button>
              <span v-else>{{scope.row.ticketingName}}</span>
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
          <el-table-column label="批注">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="handleAnnotation(scope.row)"
                >{{ !scope.row.soRemarks ? "添加" : "查看" }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
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
          width="50%"
        >
          <el-input
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
          width="50%"
        >
          <div>
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
                :required='formItem.must'
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
            </el-form>
          </div>
        </el-dialog>

        <el-dialog
          title="核销签到"
          :visible.sync="dialogSignInVisible"
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
          width="50%"
        >
          <div>参加项目</div>
          <el-checkbox v-for="(item,index) in infoList" :key="index" size="medium" v-model="item.select" disabled style="display:block;margin-top:10px">{{item.label}}</el-checkbox>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogUserSelectVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogUserSelectVisible = false">确 定</el-button>
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
} from "@/api/activity/personnel";
export default {
  data() {
    return {
      tableData: [],
      query: {
        activityId: null,
        name: "",
        orderStatus: "",
        current: 1,
        size: 20,
      },
      applyInfo: {}, //单条报名信息
      dialogAnnotationVisible: false,
      dialogApplyInfoVisible: false,
      dialogSignInVisible: false,
      dialogUserSelectVisible:false,
      total: 0,
      applyInfoForm: [],
      annotation: "",
      enroleId: "",
      checkAll: false,
      isIndeterminate: true,
      checkedSignInCode: [], //已选择
      signInCodeData: [], //核销数组
      infoList:[]
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
    backClick() {
      this.$router.go(-1);
    },
    // 批注
    handleAnnotation(row) {
      this.enroleId = row.enroleId;
      this.dialogAnnotationVisible = true;
      this.annotation = row.soRemarks;
    },
    handleCheckTicketInfo(info){
      console.log(222,JSON.parse(info))
      this.infoList = JSON.parse(info)
      this.dialogUserSelectVisible = true
    },
    handleSaveAnnotation() {
      addAnnotation({
        id: this.enroleId,
        soRemarks: this.annotation,
      }).then((res) => {
        // console.log(res)
        this.getPeopleManagementList();
      });
      this.dialogAnnotationVisible = false;
    },
    handleCheck(enroleId) {
      this.dialogApplyInfoVisible = true;
      formInquire({ enroleId: enroleId }).then((res) => {
        // console.log(res);
        this.applyInfoForm = res.data.data.data;
        // this.applyInfoForm.forEach(item=>{
        //   item.actived = true
        // })
        if (this.applyInfoForm && this.applyInfoForm.length > 0) {
          this.applyInfo = this.applyInfoForm[0];
        }
      });
    },
    handleSaveSignIn() {
      // console.log(this.checkedSignInCode);
      let codeArr = this.checkedSignInCode.map((item) => {
        return item.orderNo;
      });
      checkCode({
        orderNos: codeArr,
      }).then((res) => {
        // console.log(res);
        this.getPeopleManagementList();
      });
      this.dialogSignInVisible = false;
    },
    // 核销签到
    handleSignIn(row) {
      // console.log(row)
      this.dialogSignInVisible = true;
      this.enroleId = row.enroleId;
      signInCode({ enroleId: this.enroleId }).then((res) => {
        this.signInCodeData = res.data.data.data;
        // console.log(this.signInCodeData);
      });
    },
    getPeopleManagementList() {
      peopleManagement(this.query).then((res) => {
        // console.log("res", res);
        if (res.data.code != 0) {
          return this.$message.error("获取列表失败");
        }
        this.tableData = res.data.data.data.records;
        this.total = res.data.data.data.total;
        // this.info = res.data.data.data
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
    handleCheckAllChange(val) {
      // console.log(val);
      let writeOffStatusCode = this.signInCodeData.filter((item) => {
        return item.writeOffStatus == "0";
      });
      // console.log(writeOffStatusCode);
      this.checkedSignInCode = val ? writeOffStatusCode : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      // console.log(value);
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.checkedSignInCode.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.checkedSignInCode.length;
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

</style>