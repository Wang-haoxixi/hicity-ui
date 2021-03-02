<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="70%"
    :before-close="dialogBeforeClose">
    <el-form ref="form" :model="formData" :disabled="type == 'view'" :rules="formRules">
      <el-form-item v-for="item in formList" :key="item.prop" :prop="item.prop" :label="item.label+'：'" label-width="100px">
        <slot :name="`${item.prop}Form`" :form-data="formData">
          <hc-form-item v-model="formData[item.prop]" :option="item"></hc-form-item>
        </slot>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button v-if="type == 'view'" @click="dialogVisible = false">返 回</el-button>
      <template v-else>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import HcFormItem from './HcFormItem'
export default {
  components: { HcFormItem },
  props: {
    option: {
      type: Object,
      required: true
    },
  },
  data () {
    return {
      type: 'add',
      formList: [],
      formData: {},
      formRules: {},
      dialogVisible: false,
    }
  },
  computed: {
    title () {
      return this.type == 'add' ? '新 增' : this.type == 'edit' ? '编 辑' : this.type == 'view' ? '详 情' : ''
    }
  },
  methods: {
    reset () {
      this.formList = []
      this.formData = {}
      this.formRules = []
    },
    open (data = {}, type = 'add') {
      let columns = this.option.columns || []
      let formList = []
      let formRules = {}
      for (let i = 0; i < columns.length; i++) {
        if (!columns[i].formHidden && !columns[i][`${type}Hidden`]) {
          formList.push({
            prop: columns[i].prop,
            type: columns[i].type || 'text',
            label: columns[i].label,
            dicName: columns[i].dicName
          })
          if (columns[i].rules) {
            formRules[columns[i].prop] = columns[i].rules
          }
        }
      }
      this.formData = {...data}
      this.formRules = formRules
      this.formList = formList
      this.type = type
      this.dialogVisible = true
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit(`handle-${this.type}`, this.formData)
        }
      })
    },
    dialogBeforeClose (next) {
      next()
    },
    close () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="" scoped>
</style>
