<template>
  <div>
    <el-form ref="form" label-width="auto" :model="formData" :rules="formRules">
      <el-form-item label="选项题目" prop="label">
        <el-input v-model="formData.label" placeholder="请输入选项题目" maxlength="255"></el-input>
      </el-form-item>
      <el-form-item label="是否必填" style="margin-top: 30px;">
        <el-switch v-model="formData.must"></el-switch>
      </el-form-item>
      <el-form-item label="选项列表" prop="optionsList" style="margin-top: 30px;">
        <el-button @click="addOptions">添加选项</el-button>
        <el-row v-for="(option, index) in formData.optionsList" :key="index" style="margin-top: 10px;">
          <el-col :span="12">
            <el-input v-model="option.label" placeholder="请输入选项名称" maxlength="50"></el-input>
          </el-col>
          <el-col :span="12">
            <div class="options-right">
              <el-button v-if="!option.link" type="primary" round @click="toSetLink(option, index)">选择跳转对象</el-button>
              <div v-else>{{option.name}}</div>
              <div class="right-button-list">
                <i class="el-icon-edit-outline" @click="toSetLink(option, index)"></i>
                <i class="el-icon-remove" @click="removeOptions(index)"></i>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <link-setting ref="linkSetting" @link-select="linkSelect"></link-setting>
  </div>
</template>

<script>
import LinkSetting from './LinkSetting'
export default {
  components: { LinkSetting },
  props: {
    initForm: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      formData: {
        must: false,
        label: '',
        optionsList: [],
        type: 'checkbox',
      },
      handleOption: null,
      formRules: {
        label: {required: true, message: '请输入选项题目', trigger: 'blur'},
        optionsList: {validator: this.optionsValidator, trigger: 'blur'}
      }
    }
  },
  created () {
    this.setFormData()
  },
  watch: {
    initForm(val) {
      this.setFormData()
    }
  },
  methods: {
    validator () {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            resolve()
          } else {
            reject()
          }
        })
      })
    },
    optionsValidator (rules, value, callback) {
      if (!value || value.length === 0) {
        callback(new Error('选项列表不能为空'))
      } else {
        for (var i = 0; i < value.length; i++) {
          if (!value[i].label) {
            callback(new Error('选项名称不能为空'))
            return
          }
        }
        callback()
      }
    },
    setFormData () {
      this.formData = {
        must: false,
        label: '',
        optionsList: [],
        type: 'checkbox',
        ...this.initForm
      }
    },
    addOptions () {
      if (this.formData.optionsList.length < 10) {
        this.formData.optionsList.push({
          link: false,
          label: '',
          value: ''
        })
      } else {
        this.$message.warning('子项最多可以添加10条')
      }
    },
    toSetLink (option, index) {
      this.handleOption = index
      this.$refs.linkSetting.open({
        type: option.type,
        name: option.name,
        id: option.value
      })
    },
    removeOptions (index) {
      if (this.formData.optionsList && this.formData.optionsList.length > 0) {
        this.formData.optionsList.splice(index, 1)
      }
    },
    linkSelect (link) {
      this.formData.optionsList.splice(this.handleOption, 1, {
        ...this.formData.optionsList[this.handleOption],
        link: true,
        value: link.id,
        type: link.type,
        name: link.name 
      })
      this.$refs.linkSetting.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.options-right {
  margin-left: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .right-button-list {
    display: inline-flex;
    align-items: center;
    margin-left: 10px;
    i {
      margin-left: 10px;
      color: #409EFF;
      font-size: 18px;
      cursor: pointer;
      &:not(:first-child) {
        margin-left: 10px;
      }
    }
  }
}
</style>
