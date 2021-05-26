<template>
  <div>
    <el-dialog
      title="人员信息"
      :visible.sync="dialogVisibleApplyInfo"
      width="50%"
    >
      <div class="applyInfo-box">
        <el-form label-width="50px">
          <el-form-item
            label-width="100"
            v-for="(item, index) in conferenceFormList"
            :label="item.label"
            :key="index"
            :required="item.must"
          >
            <el-input
              v-if="item.type == 'input'"
              v-model="item.value"
            ></el-input>
            <el-input
              v-else-if="item.type == 'textarea'"
              type="textarea"
              :rows="4"
              v-model="item.value"
            >
            </el-input>
            <!-- <el-radio-group
              v-else-if="item.type == 'radio'"
              v-model="radioVal"
            >
              <el-radio
                v-for="(itemR, indexR) in item.optionsList"
                :key="indexR"
                :label="itemR.label"
              ></el-radio>
            </el-radio-group> -->
            <template v-else-if="item.type == 'radio'">
              <!-- {{ item.optionsList }} -->
              <el-radio
                v-for="(itemR, indexR) in item.optionsList"
                :key="indexR"
                :label="itemR.value"
                :value="getRadioValue(item.optionsList)"
                @input="setRadioValue($event, item.optionsList)"
                >{{ itemR.label }}</el-radio
              >
            </template>
            <template v-else-if="item.type == 'checkbox'">
              <el-checkbox-group
                :value="getCheckboxValue(item.optionsList)"
                @input="setCheckboxValue($event, item.optionsList)"
              >
                <el-checkbox
                  v-for="(itemC, indexC) in item.optionsList"
                  :label="itemC.value"
                  :key="indexC"
                  >{{ itemC.label }}</el-checkbox
                >
              </el-checkbox-group>
            </template>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleApplyInfo = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisibleApplyInfo: false,
      ticketingFormList: [], //票务表单
      conferenceFormList: [], //报名表单

      checkboxList: [],
      radioVal: "",
    };
  },
  methods: {
    openApplyInfoDialog(data) {
      this.dialogVisibleApplyInfo = true;
      this.ticketingFormList = data.ticketingFormList;
      this.conferenceFormList = data.conferenceFormList;
      console.log("data...", this.ticketingFormList, this.conferenceFormList);
    },
    handleSave() {
      console.log("conferenceFormList...", this.conferenceFormList);
    },
    getRadioValue(options) {
      for (let i = 0; i < options.length; i++) {
        if (options[i].select) {
          return options[i].value;
        }
      }
    },
    setRadioValue(value, options) {
      for (let i = 0; i < options.length; i++) {
        if (options[i].value == value) {
          options[i].select = true;
        } else {
          options[i].select = false;
        }
      }
    },
    getCheckboxValue(options) {
      let arr = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].select) {
          arr.push(options[i].value);
        }
      }
      return arr;
    },
    setCheckboxValue(label, options) {
      for (let i = 0; i < options.length; i++) {
        if (!label.includes(options[i].value)) {
          options[i].select = false;
        } else {
          options[i].select = true;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.applyInfo-box {
//   .el-form-item__label {
//     display: contents;
//   }
}
</style>