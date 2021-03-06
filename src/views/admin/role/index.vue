<template>
  <basic-container>
    <hc-table-form title="角色管理">
      <hc-crud ref="hcCrud" :option="tableOption" :fetchListFun="fetchListFun" :addFun="addFun" :updateFun="updateFun">
        <template slot="menuLeft">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="handleCreate"
            >新建</el-button>
        </template>
        <template v-slot:menu="scope">
          <template v-if="scope.row.roleId != 1 && scope.row.roleId != 2 && scope.row.roleId != 3 && scope.row.roleId != 4">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-view"
              @click="handleView(scope.row,scope.index)">查看
            </el-button>
            <el-button
              v-if="roleManager_btn_edit"
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row,scope.index)">编辑
            </el-button>
            <el-button
              v-if="roleManager_btn_del"
              type="text"
              size="mini"
              icon="el-icon-delete"
              @click="handleDelete(scope.row,scope.index)">删除
            </el-button>
          </template>
          <el-button
            v-if="roleManager_btn_perm && scope.row.roleId != 1 && scope.row.roleId != 3"
            type="text"
            size="mini"
            icon="el-icon-plus"
            @click="handlePermission(scope.row,scope.index)">权限
          </el-button>
        </template>
      </hc-crud>
    </hc-table-form>
    <el-dialog
      :visible.sync="dialogPermissionVisible"
      :close-on-click-modal="false"
      append-to-body
      title="分配权限">
      <div class="dialog-main-tree">
      <el-tree
        ref="menuTree"
        :data="treeData"
        :default-checked-keys="checkedKeys"
        :check-strictly="false"
        :props="defaultProps"
        :filter-node-method="filterNode"
        class="filter-tree"
        node-key="id"
        highlight-current
        show-checkbox
        default-expand-all/>
      </div>
      <div slot="footer"
        class="dialog-footer">
        <el-button
          type="primary"
                  size="small"
          @click="updatePermession(roleId)">更 新
        </el-button>
        <el-button
          type="default"
                  size="small"
          @click="cancal()">取消</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import { addObj, delObj, fetchList, fetchRoleTree, permissionUpd, putObj } from '@/api/admin/role'
import { tableOption } from './const'
import { getCityTree } from '@/api/admin/city'
import { fetchMenuTree } from '@/api/admin/menu'
import { mapGetters } from 'vuex'

export default {
  name: 'TableRole',
  data() {
    return {
      searchForm: {},
      treeCityData: [],
      treeData: [],
      checkedKeys: [],
      checkedDsScope: [],
      defaultProps: {
        label: 'name',
        value: 'id'
      },
      cityProps: {
        label: 'regionName',
        value: 'id'
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      menuIds: '',
      list: [],
      listLoading: true,
      form: {},
      roleId: undefined,
      roleCode: undefined,
      rolesOptions: undefined,
      dialogPermissionVisible: false,
      roleManager_btn_add: false,
      roleManager_btn_edit: false,
      roleManager_btn_del: false,
      roleManager_btn_perm: false
    }
  },
  created() {
    this.roleManager_btn_add = this.permissions['sys_role_add']
    this.roleManager_btn_edit = this.permissions['sys_role_edit']
    this.roleManager_btn_del = this.permissions['sys_role_del']
    this.roleManager_btn_perm = this.permissions['sys_role_perm']
  },
  computed: {
    ...mapGetters(['elements', 'permissions', 'userInfo']),
    tableOption() {
      return tableOption(this.userInfo.userType == 3 || this.userInfo.userType == 4)
    }
  },
  methods: {
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        fetchList({...params, cityId: this.userInfo.manageCityId}).then(response => {
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
    handleCreate() {
      this.$refs.hcCrud.rowAdd()
    },
    handleUpdate(row, index) {
      this.$refs.hcCrud.rowEdit(row, index)
    },
    handleView(row) {
      this.$refs.hcCrud.rowView(row)
    },
    addFun(row, next, loading) {
      addObj({
        ...row,
        cityId: this.userInfo.manageCityId
      }).then(() => {
        this.$refs.hcCrud.refresh()
        next()
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      }).finally(() => {
        loading()
      })
    },
    updateFun(row, next, loading) {
      putObj(row).then(() => {
        this.$refs.hcCrud.refresh()
        next()
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      }).finally(() => {
        loading()
      })
    },
    cancal () {
      this.dialogPermissionVisible = false;
    },
    handlePermission(row) {
      fetchRoleTree(row.roleId).then(response => {
        this.checkedKeys = response.data.data
        return fetchMenuTree()
      })
      .then(response => {
        this.treeData = response.data.data
        // 解析出所有的太监节点
        this.checkedKeys = this.resolveAllEunuchNodeId(this.treeData, this.checkedKeys, [])
        this.dialogPermissionVisible = true
        this.roleId = row.roleId
        this.roleCode = row.roleCode
      })
    },
    /**
       * 解析出所有的太监节点id
       * @param json 待解析的json串
       * @param idArr 原始节点数组
       * @param temp 临时存放节点id的数组
       * @return 太监节点id数组
       */
    resolveAllEunuchNodeId(json, idArr, temp) {
      for (let i = 0; i < json.length; i++) {
        const item = json[i]
        // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
        if (item.children && item.children.length !== 0) {
          this.resolveAllEunuchNodeId(item.children, idArr, temp)
        } else {
          temp.push(idArr.filter(id => id === item.id))
        }
      }
      return temp
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleDelete(row, index) {
      this.$confirm('是否确认删除名称为"' + row.roleName + '"' + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delObj(row.roleId)
      }).then(() => {
        this.$refs.hcCrud.refresh()
        this.$notify.success('删除成功')
      })
    },
    updatePermession (roleId) {
      this.menuIds = ''
      this.menuIds = this.$refs.menuTree.getCheckedKeys().join(',').concat(',').concat(this.$refs.menuTree.getHalfCheckedKeys().join(','))
      permissionUpd(roleId, this.menuIds).then(() => {
        this.dialogPermissionVisible = false
        this.$store.dispatch('GetMenu', false)
        this.$notify.success('修改成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-dialog__wrapper {
  .el-dialog {
    width: 61% !important;
  .dialog-main-tree {
    max-height: 400px;
    overflow-y: auto;
  }
  }
  .el-form-item__label {
    width: 20% !important;
    padding-right: 20px;
  }
  .el-form-item__content {
    margin-left: 20% !important;
  }
  }
</style>
