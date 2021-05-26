<template>
  <div>
    <el-dialog
      title="购票信息"
      :visible.sync="dialogVisibleTicketInfo"
      width="30%"
    >
      <div class="info-box">
        <el-form label-width="80px">
          <el-form-item label="票种类型:"> 付费票 </el-form-item>
          <el-form-item label="票种名称:"> 2021超能城市VIP嘉宾票 </el-form-item>
          <el-form-item label="参与项目"></el-form-item>
          <el-form-item>
            <el-checkbox disabled>备选项1</el-checkbox>
            <el-checkbox disabled>备选项</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="请输入内容" disabled> </el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleTicketInfo = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleTicketInfo = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisibleTicketInfo: false,
    };
  },
  methods: {
    openTicketInfoDialog(data) {
      this.dialogVisibleTicketInfo = true;
      console.log("info...", data);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>