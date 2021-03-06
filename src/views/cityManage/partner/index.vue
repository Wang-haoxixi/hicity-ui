<template>
  <basic-container>
    <hc-table-form :title="title"
      :formVisible="accountManage"
      @go-back="goBack">
      <hc-crud ref="hcCrud" :option="tableOption" :fetchListFun="fetchListFun">
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
          <el-button
            v-if="scope.row.isOpening && scope.row.state == 0 "
            type="text"
            size="mini"
            @click="toAccountManage(scope.row)">账户管理</el-button>
        </template>
      </hc-crud>

      <template v-slot:form>
        <account-manage ref="accountManage"></account-manage>

        <!-- <hc-crud ref="accountCrud" :option="accountOption()" :fetchListFun="accountFetchListFun" :auto-load="false">
          <template
            slot="menu"
            slot-scope="scope">
            <el-button
              v-if="scope.row.transactionType == '3'"
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
            <el-button
              v-if="scope.row.isOpening && scope.row.state == 0 "
              type="text"
              size="mini"
              @click="toAccountManage(scope.row)">账户管理</el-button>
          </template>
        </hc-crud> -->
      </template>
    </hc-table-form>


    <el-dialog
      :visible.sync="dialogRoleVisible"
      :close-on-click-modal="false"
      append-to-body
      title="配置角色">
      <el-form ref="form" class="dialog-main-tree" :model="formData" label-width="180px" :rules="formRule">
        <el-form-item label="城市名称：">
          <el-input disabled :value="formData.cityName"></el-input>
        </el-form-item>
        <el-form-item label="开通最高管理员账号：" prop="username">
          <el-input v-model="formData.username" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="输入密码：" prop="password">
          <el-input v-model="formData.password" type="password" maxlength="20"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          :loading="formLoading"
          @click="handleOpen()">开 通
        </el-button>
        <el-button
          type="default"
          size="small"
          @click="cancal()">取 消</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import { tableOption, accountOption } from './const'
import { mapGetters } from 'vuex'
import { adminCityOpen, adminCityOpenList, adminCityLock } from '@/api/admin/city'
import AccountManage from './accountManage'

export default {
  components: { AccountManage },
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
      form: {},
      formRule: {
        username: {required: true, message: '请输入账号', trigger: 'blur'},
        password: {required: true, message: '请输入密码', trigger: 'blur'}
      },
      formLoading: false,
      accountManage: false,
    }
  },
  computed: {
    ...mapGetters(['permissions', 'userInfo']),
    tableOption() {
      return tableOption(this.edit, this.userInfo.userType == 3 || this.userInfo.userType == 4)
    },
    title () {
      return this.accountManage ? '账户管理' : '城市合伙人'
    }
  },
  watch: {
  },
  created() {
  },
  methods: {
    goBack () {
      this.accountManage = false
    },
    accountOption,
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        adminCityOpenList(params).then(({data}) => {
          resolve({
            records: data.data.data.records,
            page: {
              total: data.data.data.total
            }
          })
        }, (error) => {
          reject(error)
        })
      })
    },
    toOpen(row) {
      this.formData = {
        cityId: row.cityId,
        cityName: row.cityName,
      }
      this.dialogRoleVisible = true
    },
    handleOpen () {
      this.formLoading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          adminCityOpen(this.formData).then(({data}) => {
            this.$refs.hcCrud.refresh()
            this.$notify({
              title: '成功',
              message: '开通成功',
              type: 'success',
              duration: 2000
            })
            this.dialogRoleVisible = false
          }).finally(() => {
            this.formLoading = false
          })
        } else {
          this.formLoading = false
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
          this.$refs.hcCrud.refresh()
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
    toAccountManage (row) {
      this.accountManage = true
      this.$nextTick(() => {
        this.$refs.accountManage.open(row.userId)
      })
    }
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

