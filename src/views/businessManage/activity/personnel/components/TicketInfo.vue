<template>
  <div>
    <el-dialog
      title="购票信息"
      :visible.sync="dialogVisibleTicketInfo"
      width="30%"
    >
      <div class="info-box">
        <el-form>
          <el-form-item label="票种类型:">
            {{ formData.ticketingType }}
          </el-form-item>
          <el-form-item label="票种名称:">
            {{ formData.ticketingName }}
          </el-form-item>

          <!-- <el-form-item label="参与项目" class="join-box"></el-form-item> -->
          <div class="join-box">参与项目</div>
          <div>{{ formData.ticketingFormList[0].label }}</div>
          <el-form-item>
            <el-checkbox
              disabled
              v-for="(item, index) in formData.ticketingFormList[0].optionsList"
              :key="index"
              :label="item.label"
              :checked="item.select"
            ></el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisibleTicketInfo = false"
          >关 闭</el-button
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
      formData: {
        ticketingFormList: [{ optionsList: [], label: "" }],
      },
    };
  },
  methods: {
    openTicketInfoDialog({ ticketingType, ticketingName, ticketingFormList }) {
      this.dialogVisibleTicketInfo = true;
      this.formData = {
        ticketingType: ticketingType == "1" ? "免费票" : "付费票",
        ticketingName,
        ticketingFormList: ticketingFormList
          ? ticketingFormList
          : [{ optionsList: [], label: "" }],
      };
      console.log("formData...", this.formData);
    },
  },
};
</script>

<style lang="scss" scoped>
.join-box{
    font-size: 18px;
    margin-bottom: 22px;
}
</style>