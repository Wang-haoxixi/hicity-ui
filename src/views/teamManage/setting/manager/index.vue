<template>
  <div class="user">
    <hc-crud ref="hcCrud" :option="tableOption" :fetchListFun="fetchListFun" :addFun="addFun" :updateFun="updateFun">
      <template slot="menuLeft">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="handleCreate"
          >新建</el-button>
      </template>
      <template
        v-if="userInfo.userId !== scope.row.userId"
        slot="menu"
        slot-scope="scope">
        <el-button
          v-if="sys_user_edit && editAuth(scope.row.userType)"
          type="text"
          size="mini"
          icon="el-icon-edit"
          @click="handleUpdate(scope.row,scope.index)">编辑
        </el-button>
        <el-button
          v-if="permissions['sys_user_role'] && editAuth(scope.row.userType)"
          type="text"
          size="mini"
          @click="handleRole(scope.row,scope.index)">配置角色
        </el-button>
        <el-button
          v-if="sys_user_del && notAdmin(scope.row) && editAuth(scope.row.userType)"
          type="text"
          size="mini"
          icon="el-icon-delete"
          @click="deletes(scope.row,scope.index)">删除
        </el-button>
      </template>
    </hc-crud>
    <el-dialog
      :visible.sync="dialogRoleVisible"
      :close-on-click-modal="false"
      append-to-body
      title="配置角色">
      <div class="dialog-main-tree role-setting">
        <el-select v-model="role" placeholder="请选择角色" multiple :clearable="false">
          <el-option v-for="item in rolesOptions" :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
            :disabled="item.roleId == 1 || item.roleId == 2 || item.roleId == 3 || item.roleId == 4"></el-option>
        </el-select>
      </div>
      <div slot="footer"
        class="dialog-footer">
        <el-button
          type="primary" size="small"
          @click="updateRole()">更 新
        </el-button>
        <el-button
	        type="default" size="small"
          @click="cancal()">取消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
    import {addObj, delObj, manageList, putObj, updateRole} from '@/api/admin/user'
    import {deptRoleList} from '@/api/admin/role'
    import {tableOption} from './const'
    import {mapGetters} from 'vuex'

    export default {
        name: 'SysUser',
        data() {
          return {
            listLoading: true,
            role: [],
            form: {},
            rolesOptions: [],
            dialogRoleVisible: false,
            edit: false,
            handleId: null,
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
          this.sys_user_add = this.permissions['sys_user_add']
          this.sys_user_edit = this.permissions['sys_user_edit']
          this.sys_user_del = this.permissions['sys_user_del']
        },
        methods: {
          notAdmin (data) {
            let roleList = data.roleList
            if (!roleList) {
              return true
            }
            for (let i = 0; i < roleList.length; i++) {
              if (roleList[i].roleCode == 'ROLE_CITY_ADMIN' || roleList[i].roleCode == 'ROLE_ADMIN') {
                return false
              }
            }
            return true
          },
          fetchListFun (params) {
            return new Promise((resolve, reject) => {
              manageList({...params, type: 2}).then(response => {
                resolve({
                  records: response.data.data.data.records,
                  page: {
                    total: response.data.data.data.total
                  }
                })
              }, (error) => {
                reject(error)
              })
            })
          },
          editAuth (userType) {
            userType = userType == '5' ? '2.5' : userType
            return this.userInfo.userType >= userType
          },
          handleCreate() {
            this.edit = false
            this.$nextTick(() => {
              this.$refs.hcCrud.rowAdd()
            })
          },
          handleUpdate(row, index) {
            this.edit = true
            this.$nextTick(() => {
              this.$refs.hcCrud.rowEdit(row, index)
            })
          },
          handleRole (row, index) {
            this.handleId = row.userId
            deptRoleList().then(response => {
              this.role = []
              let newUser = false
              for (var i = 0; i < row.roleList.length; i++) {
                if (row.roleList[i].roleCode == 'ROLE_NEW_USER') {
                  newUser = true
                }
                this.role.push(row.roleList[i].roleId)
              }
              let rolesOptions = response.data.data.data
              let hasNewUser = false
              if (newUser) {
                for (let i = 0; i < rolesOptions.length; i++) {
                  if (rolesOptions[i].roleCode == 'ROLE_NEW_USER') {
                    hasNewUser = true
                    break;
                  }
                }
                if (!hasNewUser) {
                  rolesOptions.unshift({
                    roleId: 3,
                    roleCode: 'ROLE_NEW_USER',
                    roleName: '新用户默认角色'
                  })
                }
              }
              this.rolesOptions = rolesOptions
              this.dialogRoleVisible = true
            })
          },
          updateRole () {
            let data = {
              userId: this.handleId,
              role: this.role
            }
            updateRole(data).then(() => {
              this.$refs.hcCrud.refresh()
              this.dialogRoleVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            })
          },
          cancal () {
            this.dialogRoleVisible = false
          },
          addFun(row, next) {
            addObj({...row, lockFlag: '0'}).then(() => {
              this.$refs.hcCrud.refresh()
              next()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          },
          updateFun(row, next) {
            if (row.phone && row.phone.indexOf('*') > 0) {
              this.form.phone = undefined
            }
            putObj(row).then(() => {
              this.$refs.hcCrud.refresh()
              next()
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            })
          },
          deletes(row, index) {
            this.$confirm(
              '此操作将永久删除该用户(用户名:' + row.username + '), 是否继续?',
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }
            ).then(() => {
              delObj(row.userId)
              .then(() => {
                this.$refs.hcCrud.refresh()
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                })
              })
              .cache(() => {
                this.$notify({
                  title: '失败',
                  message: '删除失败',
                  type: 'error',
                  duration: 2000
                })
              })
            })
          }
        }
    }
</script>
<style lang="scss" scope>
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
  .role-setting {
    .el-tag__close {
      display: none;
    }
  }
 
</style>

