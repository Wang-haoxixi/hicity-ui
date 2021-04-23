<template>
  <div class="user">
    <hc-crud ref="hcCrud" :option="tableOption" :fetchListFun="fetchListFun">
    </hc-crud>
  </div>

</template>

<script>
    import {manageList} from '@/api/admin/user'
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
        },
        methods: {
          fetchListFun (params) {
            return new Promise((resolve, reject) => {
              manageList({...params, type: 1}).then(response => {
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
        }
    }
</script>
<style lang="scss" scoped>
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

