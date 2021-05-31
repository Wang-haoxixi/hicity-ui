<template>
  <div>
    <el-dialog
      title="人员信息"
      :visible.sync="dialogVisibleApplyInfo"
      width="50%"
    >
      <div class="applyInfo-box">
        <el-form
          ref="customFormRef"
          label-width="50px"
          :rules="getRules(data.conferenceFormList)"
        >
          <el-form-item
            label-width="100"
            v-for="(item, index) in data.conferenceFormList"
            :prop="'formItem' + index"
            :label="item.label"
            :key="index"
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
      data: {
        conferenceFormList: [],
      },
    };
  },
  methods: {
    validateRequiredItem(index) {
      let itemData = this.data.conferenceFormList[index];
      if (itemData.type == "input" || itemData.type == "textarea") {
        return (rules, value, callback) => {
          if (itemData.value) {
            callback();
          } else {
            callback(new Error(`请输入${itemData.label}`));
          }
        };
      } else if (itemData.type == "checkbox" || itemData.type == "radio") {
        let options = itemData.optionsList;
        return (rules, value, callback) => {
          for (let i = 0; i < options.length; i++) {
            if (options[i].select) {
              callback();
              return;
            }
          }
          callback(new Error(`请选择${itemData.label}`));
        };
      }
    },
    getRules(formList) {
      console.log("formList111...", formList);
      let rules = {};
      for (let i = 0; i < formList.length; i++) {
        let formItem = formList[i];
        if (formItem.must) {
          rules["formItem" + i] = [
            {
              required: true,
              validator: this.validateRequiredItem(i),
              trigger: "change",
            },
          ];
        }
      }
      console.log("rules...", rules);
      return rules;
    },
    openApplyInfoDialog(data) {
      this.dialogVisibleApplyInfo = true;
      //   data.conferenceFormList.forEach(ele => {
      //     ele.formItem
      //   });
      this.data = data;
      console.log("data...", this.data);
    },
    handleSave() {
      console.log("开始校验...");
      this.data.conferenceFormList.forEach((ele) => {
        if ((ele.type === "input" || ele.type === "textarea") && !ele.value && ele.must) {
          return this.$message.error("请填写必填项");
        } else if ((ele.type === "checkbox" || ele.type === "radio") && ele.must ) {
          let flag = ele.optionsList.every((item) => {
            return item.select == false;
          });
          if (flag) {
            return this.$message.error("请填写必填项");
          }
        }
      });
    //   console.log("save_data...", this.data);
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
  }
  .el-radio {
    display: block;
    line-height: 40px;
  }
}
</style>