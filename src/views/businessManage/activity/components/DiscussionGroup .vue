<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisibleDiscussionGroup"
      width="30%"
    >
      <div class="discussionGroup-warp">
        <p class="p1">正在生成活动讨论组</p>
        <p class="p2">
          <i class="el-icon-warning-outline"></i> 请输入相关信息生成活动讨论圈
        </p>
        <el-form
          ref="discussionFormRef"
          label-width="100px"
          :model="discussionData"
          :rules="discussionFormRules"
        >
          <el-form-item label="圈子名称：" prop="name">
            <el-input
              maxlength="15"
              v-model="discussionData.name"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="群主账号：" prop="acc">
            <el-input v-model.number="discussionData.acc"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleDiscussionGroup = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="confirmClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisibleDiscussionGroup: false,
      discussionData: {
        name: "",
        acc: "",
      },
      discussionFormRules: {
        name: [{ required: true, message: "请输入圈子名称", trigger: "blur" }],
        acc: [
          { required: true, message: "请输入群主账号", trigger: "blur" },
          { required: true, type:'number', message: "请输入正确的群主账号", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    openDiscussionGroupDialog() {
      this.dialogVisibleDiscussionGroup = false;
    },
    confirmClick() {
      console.log("dialogVisibleDiscussionGroup...", this.discussionData);
      this.$refs.discussionFormRef.validate((valid) => {
        console.log(valid);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.discussionGroup-warp {
  text-align: center;
  > .p1 {
    font-size: 18px;
    font-weight: 500;
  }
  .p2 {
    font-size: 16px;
    font-weight: 500;
    padding: 20px 0 15px 0;
  }
}
</style>