<template>
  <div class="user">
    <basic-container>
      <avue-crud
        ref="crud"
        v-model="form"
        :option="tableOption"
        :page="page"
        :table-loading="tableLoading"
        :data="tableData"
        @on-load="getList"
        @refresh-change="handleRefreshChange"
        @search-change="handleFilter" >
        <template
          slot="menu"
          slot-scope="scope">
          <el-button
            v-if="!scope.row.isOpening"
            type="text"
            size="mini"
            @click="toOpen(scope.row)">开通城市
          </el-button>
          <el-button
            v-else
            type="text"
            size="mini"
            @click="handleLock(scope.row)">{{scope.row.state == 0 ? '锁定' : '解锁'}}
          </el-button>
        </template>
      </avue-crud>
    </basic-container>

    <el-dialog
      :visible.sync="dialogRoleVisible"
      :close-on-click-modal="false"
      append-to-body
      title="配置角色">
      <el-form ref="form" class="dialog-main-tree" :model="formData" label-width="180px">
        <el-form-item label="城市名称：">
          <el-input disabled :value="formData.cityName"></el-input>
        </el-form-item>
        <el-form-item label="开通最高管理员账号：">
          <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="输入密码：">
          <el-input v-model="formData.password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click="handleOpen()">开 通
        </el-button>
        <el-button
	        type="default"
          size="small"
          @click="cancal()">取 消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { tableOption } from './const'
import { mapGetters } from 'vuex'
import { adminCityOpen, adminCityOpenList, adminCityLock } from '@/api/admin/city'

export default {
  name: 'SysUser',
  data() {
    return {
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false// 是否倒序
      },
      tableLoading: false,
      tableData: [],
      dialogRoleVisible: false,
      formData: {},
      searchForm: {},
      form: {}
    }
  },
  computed: {
    ...mapGetters(['permissions', 'userInfo']),
    tableOption() {
      return tableOption(this.edit, this.userInfo.userType == 3 || this.userInfo.userType == 4)
    }
  },
  watch: {
  },
  created() {
  },
  methods: {
    getList(page = this.page) {
      this.tableLoading = true
      adminCityOpenList({
        current: page.currentPage,
        size: page.pageSize,
        ...this.searchForm
      }).then(({data}) => {
        this.tableData = data.data.data.records
        this.page.total = data.data.data.total
      }).finally(() => {
        this.tableLoading = false
      })
    },
    handleFilter(param) {
      this.searchForm = param
      this.getList(this.page, param)
    },
    toOpen(row) {
      this.formData = {
        cityId: row.cityId,
        cityName: row.cityName,
      }
      this.dialogRoleVisible = true
    },
    handleOpen () {
      this.$refs.form.validate(valid => {
        if (valid) {
          adminCityOpen(this.formData).then(({data}) => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '开通成功',
              type: 'success',
              duration: 2000
            })
            this.dialogRoleVisible = false
          })
        }
      })
    },
    cancal () {
      this.dialogRoleVisible = false
    },
    handleLock (row) {
      let lockWord = row.state == 0 ? '锁定' : '解锁'
      this.$confirm(`是否确认${lockWord}该城市?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        adminCityLock({
          cityId: row.cityId,
          lock: row.state == 0 ? true : false
        }).then(({data}) => {
          this.getList()
          this.$notify({
            title: '成功',
            message: `${lockWord}成功`,
            type: 'success',
            duration: 2000
          })
        })
      }).catch(function() {
      })
    },
    handleRefreshChange() {
      this.getList(this.page)
    },
  }
}
</script>
<style lang="scss">
  .user {
    height: 100%;

    &__tree {
      padding-top: 3px;
      padding-right: 20px;
    }

    &__main {
      .el-card__body {
        padding-top: 0;
      }
    }
  }
</style>

