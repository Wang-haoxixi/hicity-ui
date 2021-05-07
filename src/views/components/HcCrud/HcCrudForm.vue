<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="70%"
    append-to-body
    :before-close="dialogBeforeClose">
    <el-form ref="form" :model="formData" :rules="formRules">
      <el-form-item v-for="item in formList" :key="item.prop" :prop="item.prop" :label="item.label+'：'" :label-width="option.labelWidth || item.labelWidth">
        <slot :name="`${item.prop}Form`" :form-data="formData">
          <hc-form-item v-model="formData[item.prop]" :option="item" :disabled="type == 'view' || item[`${type}Disabled`]"></hc-form-item>
        </slot>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button v-if="type == 'view'" @click="cancel">返 回</el-button>
      <template v-else>
        <el-button type="primary" :loading="loading" @click="save">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import HcFormItem from './HcFormItem'
function hasValue (value) {
  if (value === null || value === undefined) {
    return false
  }
  return true
}

export default {
  components: { HcFormItem },
  props: {
    option: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      type: 'add',
      formData: {},
      dialogVisible: false,
      columns: [],
    }
  },
  computed: {
    title () {
      return this.type == 'add' ? '新 增' : this.type == 'edit' ? '编 辑' : this.type == 'view' ? '详 情' : ''
    },
    formRules () {
      let formRules = {}
      let columns = this.columns
      for (let i = 0; i < columns.length; i++) {
        if (!columns[i].formHidden && !columns[i][`${this.type}Hidden`]) {
          if (columns[i].rules) {
            formRules[columns[i].prop] = columns[i].rules
          }
        }
      }
      return formRules
    },
    formList () {
      let formList = []
      let columns = this.columns
      for (let i = 0; i < columns.length; i++) {
        if (!columns[i].formHidden && !columns[i][`${this.type}Hidden`]) {
          formList.push({
            type: 'text',
            ...columns[i],
          })
        }
      }
      return formList
    }
  },
  methods: {
    reset () {
      this.formData = {}
    },
    open (data = {}, type = 'add') {
      this.columns = this.option.columns || []
      let initForm = {}
      let editForm = {}
      let columns = this.columns
      for (let i = 0; i < columns.length; i++) {
        if (!columns[i].formHidden && !columns[i][`${this.type}Hidden`] && hasValue(columns[i].value)) {
          initForm[columns[i].prop] = columns[i].value
        }
      }
      if (type == 'edit') {
        for (let i = 0; i < columns.length; i++) {
          if (!columns[i].formHidden && !columns[i][`${this.type}Hidden`] && hasValue(columns[i].editValue)) {
            editForm[columns[i].prop] = columns[i].editValue
          }
        }
      }
      this.type = type
      this.formData = {...initForm, ...data, ...editForm}
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit(`handle-${this.type}`, this.formData)
        }
      })
    },
    dialogBeforeClose (next) {
      // this.$refs.form.resetFields()
      this.$refs.form.clearValidate()
      next()
    },
    cancel () {
      // this.$refs.form.resetFields()
      this.$refs.form.clearValidate()
      this.dialogVisible = false
    },
    close () {
      // this.$refs.form.resetFields()
      this.$refs.form.clearValidate()
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="" scoped>
</style>
