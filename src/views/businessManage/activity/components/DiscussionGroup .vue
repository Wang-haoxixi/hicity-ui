<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisibleDiscussionGroup"
      width="30%"
      :close-on-click-modal="false"
      @close="closeDialog"
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
          <el-form-item label="绑定城市：" prop="cityId">
            <hc-city-select
              v-model="discussionData.cityId"
              :city-id="userInfo.manageCityId"
              :single="true"
            ></hc-city-select>
          </el-form-item>
          <el-form-item label="圈子名称：" prop="circleName">
            <el-input
              maxlength="15"
              v-model="discussionData.circleName"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="群主账号：" prop="phone">
            <el-input v-model.number="discussionData.phone"></el-input>
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
import { mapGetters } from "vuex";
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index";
import { createCircle } from "@/api/activity/publish";
export default {
  components: { HcCitySelect },
  computed: {
    ...mapGetters(["userType", "userInfo"]),
  },
  data() {
    return {
      dialogVisibleDiscussionGroup: false,
      discussionData: {
        circleName: "",
        phone: "",
        cityId: "",
        id: "",
      },
      discussionFormRules: {
        cityId: [{ required: true, message: "请绑定城市", trigger: "change" }],
        circleName: [
          { required: true, message: "请输入圈子名称", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入群主账号", trigger: "blur" },
          {
            required: true,
            type: "number",
            message: "请输入正确的群主账号",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    closeDialog() {
      this.$message.success("发布活动成功");
      this.$router.go(-1);
    },
    openDiscussionGroupDialog(data) {
      console.log("id...", data);
      this.discussionData.id = data;
      this.dialogVisibleDiscussionGroup = true;
    },
    //确定生成圈子
    confirmClick() {
      console.log("dialogVisibleDiscussionGroup...", this.discussionData);
      this.$refs.discussionFormRef.validate((valid) => {
        if (valid) {
          createCircle(this.discussionData).then((res) => {
            // console.log("create...", res);
            if (res.data.data.businessCode == 1000) {
              this.$message.success("发布活动并生成讨论组成功");
              this.$router.go(-1);
            }
          });
        }
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