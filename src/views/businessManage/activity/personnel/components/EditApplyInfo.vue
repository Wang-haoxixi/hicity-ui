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
            v-for="(item, index) in data.conferenceFormList"
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
            <template v-else-if="item.type == 'radio'">
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
      data: {},
    };
  },
  methods: {
    openApplyInfoDialog(data) {
      this.dialogVisibleApplyInfo = true;
      this.data = data;
      console.log("data...", this.data);
    },
    handleSave() {
      console.log("save_data...", this.data);
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
  ::v-deep .el-form-item__label {
    display: contents;
  }
  .el-checkbox {
    display: block;
    padding-left: 50px;
  }
  .el-radio {
    display: block;
    line-height: 40px;
    padding-left: 50px;
  }
}
</style>