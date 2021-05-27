<template>
  <div>
    <el-dialog title="人员审核" :visible.sync="dialogVisibleAudit" width="20%">
      <div class="audit-box">
        <div class="current">当前TA的状态为：</div>
        <el-tag type="danger" class="tag" v-if="auditStatus == '1'"
          >待审核</el-tag
        >
        <el-tag type="danger" class="tag" v-else-if="auditStatus == '2'"
          >未通过</el-tag
        >
        <el-tag type="danger" class="tag" v-else-if="auditStatus == '3'"
          >通过</el-tag
        >
        <div class="reason" v-if="auditStatus == '2'">理 由</div>
        <div class="content" v-if="auditStatus == '2'">
          <i class="el-icon-message-solid"></i
          >亲爱的朋友，您好！很抱歉，您的报名信息不符合本次活动要求。
        </div>
      </div>
      <span slot="footer" class="dialog-footer" v-if="auditStatus == '1'">
        <el-button @click="handleOpenRejectReasonDialog">拒 绝</el-button>
        <el-button type="primary" @click="handlePass">通 过</el-button>
      </span>
      <span slot="footer" class="dialog-footer" v-else-if="auditStatus == '2'">
        <el-button @click="handlePass">重新通过</el-button>
        <el-button type="primary" @click="handleOpenRejectReasonDialog"
          >修改理由</el-button
        >
      </span>
      <span slot="footer" class="dialog-footer" v-else-if="auditStatus == '3'">
        <el-button @click="handleOpenRejectReasonDialog">驳 回</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisibleRejectReason"
      width="30%"
      @close="closeRejectReason"
    >
      <div class="reject-reason-box">
        <i class="el-icon-warning"></i>
        <div class="p">请选择拒绝告知理由</div>
        <el-select v-model="value" @change="changeOpt" class="select-box">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          maxlength="50"
          show-word-limit
          class="inp-textarea"
          v-model="content"
          v-if="value == '3'"
        >
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleFinish">完 成</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["dicList"]),
  },
  data() {
    return {
      dialogVisibleAudit: false,
      dialogVisibleRejectReason: false,
      value: "0",
      options: [],

      content: "", //拒绝理由

      auditStatus: "",
    };
  },
  created() {
    this.options = this.dicList.REFUSE_TYPE;
    console.log(this.options);
  },
  methods: {
    closeRejectReason() {
      this.value = "0";
      this.content = "";
    },
    openAuditDialog(auditStatus) {
      this.auditStatus = auditStatus;
      this.dialogVisibleAudit = true;
    },
    handleReject() {
      //拒绝
    },
    handleOpenRejectReasonDialog() {
      this.dialogVisibleRejectReason = true;
    },
    handlePass() {
      // pass code...
      this.dialogVisibleAudit = false;
    },
    handleFinish() {
      //完成
      // reject code...
      this.dialogVisibleRejectReason = false;
      this.dialogVisibleAudit = false;
    },
    changeOpt(val) {
      console.log(val);
      if (val == 3) {
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  text-align: center;
  .el-dialog__title {
    font-size: 22px;
    font-weight: bold;
  }
}
.audit-box,
.reject-reason-box {
  text-align: center;
  .current {
    font-size: 20px;
    font-weight: 500;
  }
  .tag {
    margin-top: 15px;
  }
  .reason {
    margin-top: 15px;
  }
  .content {
    > i {
      color: #909399;
      margin-right: 5px;
    }
  }
}
::v-deep .el-dialog__footer {
  text-align: center;
}
.reject-reason-box {
  > i {
    font-size: 20px;
  }
  .p {
    padding: 15px 0;
  }
  .select-box {
    width: 100%;
  }
  .inp-textarea {
    margin-top: 15px;
  }
}
</style>