<template>
  <el-dialog :visible.sync="dialogShow" :title="`${methodName}`" width="500px" @close="_close()" append-to-body>
    <el-form class="el-form-detail" :model="form" ref="form" label-width="120px" :rules="formRules">
      <el-form-item v-if="form.type!=='0'" label="上级岗位" prop="parentId">
        <el-select v-model="form.parentId" filterable :disabled="isChild" placeholder="请选择上级岗位">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="岗位名称" prop="name">
        <el-input v-model.trim="form.name" placeholder="请输入岗位名称" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="岗位说明" prop="introduction">
        <el-input v-model.trim="form.introduction" placeholder="请输入岗位说明" maxlength="255"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button type="primary" @click="save()">保存</el-button>
      <el-button @click="_close()">取消</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { initForm } from "./const";
import {
  addPosition,
  updatePosition,
} from "@/api/admin/position";
export default {
  data() {
    return {
      form: initForm(),
      methodName: "创建",
      dialogShow: false,
      formRequestFn: () => {},
      options: [],
      isChild: false,
      formRules: {
        parentId: {required: true, message: "请选择上级岗位", trigger: "blur"},
        name: {required: true, message: "请输入岗位名称", trigger: "blur"},
      }
    };
  },
  methods: {
    open (options = [], data, edit = false, isChild = false) {
      this.methodName = edit ? '编辑' : '创建'
      this.dialogShow = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
      this.options = [
        {value: 0, label: '最高级'},
        ...options
      ]
      this.isChild = isChild
      this.edit = edit
      if (data) {
        this.form = {
          ...initForm(),
          ...data
        }
      } else {
        this.form = initForm()
      }
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let fn = null
          let form = {}
          if (this.edit) {
            fn = updatePosition
            form = {
              id: this.form.id,
              introduction: this.form.introduction,
              name: this.form.name,
              parentId: this.form.parentId,
              type: this.form.type,
              sort: this.form.sort
            }
          } else {
            fn = addPosition
            form = {
              introduction: this.form.introduction,
              name: this.form.name,
              parentId: this.form.parentId,
              type: this.form.type
            }
          }
          fn(form).then(({data}) => {
            this.$message({
              showClose: true,
              message: '添加成功',
              type: 'success'
            })
            this.close()
          })
        }
      })
      
    },
    _close() {
      this.dialogShow = false;
    },
    close() {
      this.form = initForm();
      this._close();
      this.$emit("load-page");
    },
    async submitForm() {
      const { data } = await this.formRequestFn(this.form);
      if (data) {
        this.$message.success("操作成功");
        this.close();
      }
    },
  },
};
</script>
