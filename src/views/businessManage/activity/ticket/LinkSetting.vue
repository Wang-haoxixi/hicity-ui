<template>
  <el-dialog
    title="跳转对象"
    :visible.sync="dialogVisible"
    width="70%"
    append-to-body
    :before-close="dialogBeforeClose">
    <el-form label-width="auto">
      <el-form-item label="跳转类型：">
        <el-select v-model="link.type">
          <el-option label="官方发布" value="officialRelease">官方发布</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="跳转对象：">
        <div>{{link.name}}</div>
        <hc-crud :option="officialOption" :fetchListFun="fetchListFun">
          <template v-slot:menu="scope">
            <el-button type="text" @click="selectLink(scope.row)">选择</el-button>
          </template>
        </hc-crud>
        <div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveLink">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  officialReleaseList
} from "@/api/activity/publish";
export default {
  data () {
    return {
      dialogVisible: false,
      officialOption: {
        columns: [
          {
            label: '标题',
            prop: 'officialNewsName',
          },
          {
            label: '标题',
            prop: 'searchName',
            hidden: true,
            search: true
          }
        ],
        menu: true,
        menuWidth: '60px',
        header: false,
      },
      link: {
        type: 'officialRelease',
        id: '',
        name: ''
      },
    }
  },
  methods: {
    open (link = {}) {
      this.link = {
        id: '',
        name: '',
        ...link,
        type: 'officialRelease',
      }
      this.dialogVisible = true
    },
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        officialReleaseList(params).then(({data})=>{
          resolve({
            records: data.data.data.records,
            page: {
              total: data.data.data.total
            }
          })
        })
      })
    },
    selectLink (row) {
      this.link.name = row.officialNewsName
      this.link.id = row.officialNewsId
    },
    saveLink () {
      if (this.link.id) {
        this.$emit('link-select', this.link)
      } else {
        this.$message.warning('请选择跳转对象')
      }
    },
    close () {
      this.dialogVisible = false
    },
    dialogBeforeClose (next) {
      next()
    }
  }
}
</script>

<style lang="" scoped>
</style>
