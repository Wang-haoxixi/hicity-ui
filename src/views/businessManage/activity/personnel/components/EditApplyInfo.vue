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
              v-if="item.type == 'input' && item.code != 'phone_number'"
              v-model="item.value"
            ></el-input>
            <el-input
              disabled
              v-else-if="item.code == 'phone_number'"
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
import { updatePeopleInfo } from "@/api/activity/personnel.js";
export default {
  data() {
    return {
      dialogVisibleApplyInfo: false,
      data: {
        conferenceFormList: [],
        id: "",
      },
    };
  },
  methods: {
    validateRequiredItem(index) {
      let itemData = this.data.conferenceFormList[index];
      if (itemData.type == "input" || itemData.type == "textarea") {
        if (itemData.code == "user_name") {
          //姓名
          return (rules, value, callback) => {
            if (itemData.value && itemData.value.length <= 10) {
              callback();
            } else if (itemData.value && itemData.value.length > 10) {
              callback(new Error(`姓名不能超过10个字符`));
            } else {
              callback(new Error(`姓名不能为空`));
            }
          };
        } else if (itemData.code == "phone_number") {
          //手机号
          return (rules, value, callback) => {
            const phone = /^1[3|4|5|7|8]\d{9}$/;
            if (itemData.value && phone.test(itemData.value)) {
              callback();
            } else if (itemData.value && !phone.test(itemData.value)) {
              callback(new Error(`请输入正确的手机格式`));
            } else {
              callback(new Error(`手机号不能为空`));
            }
          };
        } else if (itemData.code == "company") {
          //单位
          return (rules, value, callback) => {
            if (itemData.value && itemData.value.length <= 15) {
              callback();
            } else if (itemData.value && itemData.value.length > 15) {
              callback(new Error(`单位不能超过15个字符`));
            } else {
              callback(new Error(`单位不能为空`));
            }
          };
        } else if (itemData.code == "position") {
          //职务
          return (rules, value, callback) => {
            if (itemData.value && itemData.value.length <= 10) {
              callback();
            } else if (itemData.value && itemData.value.length > 10) {
              callback(new Error(`职务不能超过10个字符`));
            } else {
              callback(new Error(`职务不能为空`));
            }
          };
        } else if (itemData.code == "remark") {
          //备注
          return (rules, value, callback) => {
            if (itemData.value && itemData.value.length <= 100) {
              callback();
            } else if (itemData.value && itemData.value.length > 100) {
              callback(new Error(`备注不能超过100个字符`));
            } else {
              callback(new Error(`备注不能为空`));
            }
          };
        } else if (itemData.code == "email") {
          //邮箱
          return (rules, value, callback) => {
            const email = /^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,4}$/;
            if (itemData.value && email.test(itemData.value)) {
              callback();
            } else if (itemData.value && !email.test(itemData.value)) {
              callback(new Error(`请输入正确的邮箱格式`));
            } else {
              callback(new Error(`邮箱不能为空`));
            }
          };
        } else if (itemData.type == "textarea" && !itemData.code) {
          // console.log("nocodetextarea...");
          // 自定义文本框
          return (rules, value, callback) => {
            if (itemData.value && itemData.value.length <= 100) {
              callback();
            } else if (itemData.value && itemData.value.length > 100) {
              callback(new Error(`${itemData.label}不能超过100个字符`));
            } else {
              callback(new Error(`${itemData.label}不能为空`));
            }
          };
        }

        // return (rules, value, callback) => {
        //   if (itemData.value) {
        //     callback();
        //   } else {
        //     callback(new Error(`请输入${itemData.label}`));
        //   }
        // };
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
      // console.log("formList111...", formList);
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
      return rules;
    },
    openApplyInfoDialog(data, id) {
      this.dialogVisibleApplyInfo = true;
      // console.log("data...", data);
      this.id = id;
      // this.data = data;
      this.data = {
        id: "",
        conferenceFormList: [],
        ...data,
      };
    },
    handleSave() {
      // console.log("开始校验...", this.data.conferenceFormList);
      let query = {
        id: this.id,
        infoFormConfigList: this.data.conferenceFormList,
      };
      // console.log("query...", query);
      updatePeopleInfo(query).then((res) => {
        // console.log("rst..", res);
        if (res.data.data.businessCode == 1000) {
          this.$notify({
            title: "成功",
            message: "编辑成功",
            type: "success",
          });
          this.dialogVisibleApplyInfo = false;
          this.$emit("refresh");
        }
      });

      // let list = this.data.conferenceFormList;
      // for (let i = 0; i < list.length; i++) {
      //   if (list[i].must) {
      //     this.validateRequiredItem(i)
      //   }
      // }
      // this.data.conferenceFormList.forEach((ele) => {
      //   if ((ele.type === "input" || ele.type === "textarea") && !ele.value && ele.must) {
      //     return this.$message.error("请填写必填项");
      //   } else if ((ele.type === "checkbox" || ele.type === "radio") && ele.must ) {
      //     let flag = ele.optionsList.every((item) => {
      //       return item.select == false;
      //     });
      //     if (flag) {
      //       return this.$message.error("请填写必填项");
      //     }
      //   }
      // });
      // console.log("校验通过...");
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