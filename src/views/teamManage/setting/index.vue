<template>
  <div class="user">
    <basic-container>
      <avue-crud
        ref="crud"
        :option="tableOption"
        v-model="form"
        :page="page"
        :table-loading="listLoading"
        :before-open="handleOpenBefore"
        :data="list"
        @on-load="getList"
        @search-change="handleFilter"
        @refresh-change="handleRefreshChange"
        @row-update="update"
        @row-save="create">
        <template slot="menuLeft">
          <el-button
            v-if="sys_user_add"
            class="filter-item"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="handleCreate">添加
          </el-button>
        </template>
        <template
          slot="role"
          slot-scope="scope">
          <span
            v-for="(role,index) in scope.row.roleList"
            :key="index">
            <el-tag>{{ role.roleName }} </el-tag>&nbsp;&nbsp;
          </span>
        </template>
        <template
          slot="deptId"
          slot-scope="scope">
          {{ scope.row.deptName }}
        </template>
        <template
          slot="lockFlag"
          slot-scope="scope">
          <el-tag>{{ scope.label }}</el-tag>
        </template>
        <template
          slot="menu"
          slot-scope="scope">
          <el-button
            v-if="sys_user_edit && userInfo.userType >= scope.row.userType"
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,scope.index)">编辑
          </el-button>
          <el-button
            v-if="permissions['sys_user_role'] && userInfo.userType >= scope.row.userType"
            type="text"
            size="mini"
            @click="handleRole(scope.row,scope.index)">配置角色
          </el-button>
          <el-button
            v-if="sys_user_del && notAdmin(scope.row)"
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="deletes(scope.row,scope.index)">删除
          </el-button>
        </template>
        <template
          slot="deptIdForm"
          slot-scope="scope">
          <avue-input
            v-model="form.deptId"
            :dic="treeDeptData"
            :props="defaultProps"
            type="tree"
            :disabled="!notAdmin(scope.row)"
            placeholder="请选择所属部门"/>
        </template>
      </avue-crud>
    </basic-container>

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
            :disabled="item.roleId == 1 || item.roleId == 2"></el-option>
        </el-select>

        <!-- <avue-select
          v-model="role"
          :dic="rolesOptions"
          :props="roleProps"
          multiple
          placeholder="请选择角色"/> -->
      </div>
      <div slot="footer"
        class="dialog-footer">
        <el-button
          type="primary"
                   size="small"
          @click="updateRole()">更 新
        </el-button>
        <el-button
	        type="default"
                   size="small"
          @click="cancal()">取消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
    import {addObj, delObj, manageList, putObj, updateRole} from '@/api/admin/user'
    import {deptRoleList} from '@/api/admin/role'
    import {fetchTree} from '@/api/admin/dept'
    import {tableOption} from './const'
    import {mapGetters} from 'vuex'

    export default {
        name: 'SysUser',
        data() {
          return {
            searchForm: {},
            treeDeptData: [],
            checkedKeys: [],
            roleProps: {
              label: 'roleName',
              value: 'roleId'
            },
            defaultProps: {
              label: 'name',
              value: 'id'
            },
            page: {
              total: 0, // 总页数
              currentPage: 1, // 当前页数
              pageSize: 20, // 每页显示多少条,
              isAsc: false// 是否倒序
            },
            list: [],
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
            getList(page, params) {
                this.listLoading = true
                manageList(Object.assign({
                    current: page.currentPage,
                    size: page.pageSize
                }, params, this.searchForm)).then(response => {
                    this.list = response.data.data.data.records
                    this.page.total = response.data.data.data.total
                    this.listLoading = false
                })
            },
            handleDept() {
                fetchTree().then(response => {
                    this.treeDeptData = response.data.data
                })
            },
            handleFilter(param) {
                this.searchForm = param
                this.getList(this.page, param)
            },
            handleRefreshChange() {
                this.getList(this.page)
            },
            handleCreate() {
              this.edit = false
              this.$refs.crud.rowAdd()
              this.$nextTick(() => {
              })
            },
            handleOpenBefore(show, type) {
              window.boxType = type
              this.handleDept()
              show()
            },
            handleUpdate(row, index) {
              this.edit = true
                this.$refs.crud.rowEdit(row, index)
                this.form.password = undefined
              this.$nextTick(() => {
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
                      roleId: 8,
                      roleCode: 'ROLE_NEW_USER',
                      roleName: '新用户默认角色'
                    })
                  }
                }
                this.rolesOptions = rolesOptions
                console.log(123, rolesOptions)
                this.dialogRoleVisible = true
              })
            },
            updateRole () {
              let data = {
                userId: this.handleId,
                role: this.role
              }
              updateRole(data).then(() => {
                this.getList(this.page)
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
            create(row, done, loading) {
              addObj({...this.form, lockFlag: '0'}).then(() => {
                this.getList(this.page)
                done()
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
              }).catch(() => {
                loading()
              })
            },
            update(row, index, done, loading) {
                if (this.form.phone && this.form.phone.indexOf('*') > 0) {
                  this.form.phone = undefined
                }
                putObj(this.form).then(() => {
                  this.getList(this.page)
                  done()
                  this.$notify({
                      title: '成功',
                      message: '修改成功',
                      type: 'success',
                      duration: 2000
                  })
                }).catch(() => {
                  loading()
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
                            this.list.splice(index, 1)
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

