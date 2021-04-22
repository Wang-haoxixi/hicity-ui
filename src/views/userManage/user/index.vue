<template>
    <basic-container>
        <hc-table-form title="用户管理">
            <hc-crud ref="hcCrud" :option="option" :fetchListFun="fetchListFun" :updateFun="updateFun" :deleteFun="deleteFun">
                <template v-slot:lockFlag="scope">
                    <el-tag>{{ scope.label }}</el-tag>
                </template>
            </hc-crud>  
        </hc-table-form>
    </basic-container>
</template>

<script>
    import { delObj, fetchList, putObj} from '@/api/admin/user'
    import {tableOption} from './const'
    import {mapGetters} from 'vuex'

    export default {
        name: 'SysUser',
        data() {    
            return {
                option: tableOption,
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
                rolesOptions: []
            }
        },
        computed: {
            ...mapGetters(['permissions'])
        },
        watch: {
            role() {
                this.form.role = this.role
            }
        },
        created() {
            this.sys_user_add = this.permissions['sys_user_add']
            this.sys_user_edit = this.permissions['sys_user_edit']
            this.sys_user_del = this.permissions['sys_user_del']
        },
        methods: {
            fetchListFun (params) {
               return new Promise((resolve, reject) => {
                   fetchList(params).then(response => {
                       resolve({
                           records: response.data.data.records,
                           page: {
                               total: response.data.data.total
                           }
                       })
                    }, error => reject(error))
               }) 
            },
            updateFun(formData, next) {
                if (formData.phone && formData.phone.indexOf('*') > 0) {
                    formData.phone = undefined
                }
                putObj(formData).then(() => {
                    this.$refs.hcCrud.refresh()
                    this.$notify({
                        title: '成功',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    })
                    next()
                })
            },
            deleteFun(row, index) {
                this.$confirm(
                    '此操作将永久删除该用户(用户名:' + row.username + '), 是否继续?',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).then(() => {
                    delObj(row.userId).then(() => {
                        this.$refs.hcCrud.refresh()
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        })
                    }).cache(() => {
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

