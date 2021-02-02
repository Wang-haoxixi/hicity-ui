<template>
  <el-dialog :visible.sync="dialogShow" :title="`${methodName}`" width="500px" @close="_close()">
    <el-form class="el-form-detail" :model="form" ref="form" label-width="120px">
      <el-form-item v-if="form.type!=='0'" label="上级分类" prop="parentId">
        <el-select v-model="form.parentId" filterable :disabled="isChild" placeholder="请选择上级分类">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类名称" prop="name">
        <el-input v-model.trim="form.name" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="分类编码" prop="number">
        <el-input v-model.trim="form.number" placeholder="请输入分类编码"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="form.sort" placeholder="请输入排序"></el-input-number>
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
  addCategory,
  updateCategory,
} from "@/api/admin/category";
export default {
  data() {
    return {
      form: initForm(),
      methodName: "创建",
      dialogShow: false,
      formRequestFn: () => {},
      options: [],
      isChild: false,
    };
  },
  methods: {
    open (options = [], data, edit = false, isChild = false) {
      this.methodName = edit ? '编辑' : '创建'
      this.dialogShow = true
      this.options = [
        {value: -1, label: '最高级'},
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
      let fn = null
      if (this.edit) {
        fn = updateCategory
      } else {
        fn = addCategory
      }
      fn(this.form).then(({data}) => {
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        })
        this.close()
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
