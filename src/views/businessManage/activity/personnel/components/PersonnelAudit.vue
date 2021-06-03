<template>
  <div>
    <el-dialog title="人员审核" :visible.sync="dialogVisibleAudit" width="20%">
      <div class="audit-box">
        <div class="current">当前TA的状态为：</div>
        <el-tag type="danger" class="tag" v-if="currentAuditStatus == '1'"
          >待审核</el-tag
        >
        <el-tag type="danger" class="tag" v-else-if="currentAuditStatus == '2'"
          >通过</el-tag
        >
        <el-tag type="danger" class="tag" v-else-if="currentAuditStatus == '3'"
          >未通过</el-tag
        >
        <div class="reason" v-if="currentAuditStatus == '3'">理 由</div>
        <div class="content" v-if="currentAuditStatus == '3'">
          <i class="el-icon-message-solid"></i>{{ query.auditRemark }}
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
        v-if="currentAuditStatus == '1'"
      >
        <el-button @click="handleOpenRejectReasonDialog">拒 绝</el-button>
        <el-button type="primary" @click="handlePass">通 过</el-button>
      </span>
      <span
        slot="footer"
        class="dialog-footer"
        v-else-if="currentAuditStatus == '3'"
      >
        <el-button @click="handlePass">重新通过</el-button>
        <el-button type="primary" @click="handleOpenRejectReasonDialog"
          >修改理由</el-button
        >
      </span>
      <span
        slot="footer"
        class="dialog-footer"
        v-else-if="currentAuditStatus == '2'"
      >
        <el-button @click="handleOpenRejectReasonDialog">驳 回</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisibleRejectReason"
      width="30%"
    >
      <div class="reject-reason-box">
        <i class="el-icon-warning"></i>
        <div class="p">请选择拒绝告知理由</div>
        <el-select v-model="query.auditRemark" class="select-box">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          >
          </el-option>
        </el-select>
        <el-input
          v-if="
            query.auditRemark == '其他——自定义输入驳回理由，限制指数为50个字'
          "
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          maxlength="50"
          v-model="content"
          show-word-limit
          class="inp-textarea"
        >
          <!-- v-model="query.auditRemark" -->
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
import { auditPort } from "@/api/activity/personnel.js";
export default {
  computed: {
    ...mapGetters(["dicList"]),
  },
  data() {
    return {
      dialogVisibleAudit: false,
      dialogVisibleRejectReason: false,
      options: [],
      content: "",
      currentAuditStatus: "", //当前审核状态
      query: {
        id: "",
        auditStatus: "", //要改变的审核状态
        auditRemark:
          "亲爱的朋友，您好！很抱歉，您的报名信息不符合本次活动要求。", //拒绝理由
      },
    };
  },
  created() {
    this.options = this.dicList.REFUSE_TYPE;
  },
  methods: {
    openAuditDialog(auditStatus, id) {
      this.query.id = id;
      this.currentAuditStatus = auditStatus;
      this.dialogVisibleAudit = true;
    },
    handleOpenRejectReasonDialog() {
      this.dialogVisibleRejectReason = true;
    },
    handlePass() {
      // pass code...
      this.query.auditStatus = "2";
      auditPort(this.query).then((res) => {
        if (res.data.data.businessCode == 1000) {
          this.$notify({
            title: "成功",
            message: "审核通过",
            type: "success",
          });
          this.dialogVisibleAudit = false;
          this.$emit("refresh");
        }
      });

    },
    handleFinish() {
      // reject code...
      this.query.auditStatus = "3";
      if (
        this.query.auditRemark == "其他——自定义输入驳回理由，限制指数为50个字"
      ) {
        this.query.auditRemark = this.content;
      }
      auditPort(this.query).then((res) => {
        this.dialogVisibleRejectReason = false;
        this.dialogVisibleAudit = false;
        this.$emit("refresh");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  text-align: center;
  .el-dialog__title {
    font-size: 18px;
    font-weight: bold;
  }
}
.audit-box,
.reject-reason-box {
  text-align: center;
  .current {
    font-size: 16px;
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