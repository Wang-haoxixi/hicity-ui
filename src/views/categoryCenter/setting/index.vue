<template>
  <basic-container>
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :table-loading="tableLoading"
      :option="tableOption"
      @on-load="getList"
      @search-change="searchChange"
      @refresh-change="refreshChange">
      <template slot="menu" slot-scope="scope">
        <el-button
          v-if="(userInfo.userType != 3 && userInfo.userType != 4) || scope.row.editable"
          type="text"
          size="mini"
          icon="el-icon-edit"
          @click="handleUpdate(scope.row,scope.index)">编辑
        </el-button>
        <el-button
          v-if="userInfo.userType != 3 && userInfo.userType != 4 && scope.row.editable"
          type="text"
          size="mini"
          icon="el-icon-edit"
          @click="handleUpdate(scope.row,scope.index)">{{scope.row.isopen ? '停用' : '启用'}}
        </el-button>
        <el-button
          v-if="userInfo.userType != 3 && userInfo.userType != 4"
          type="text"
          size="mini"
          icon="el-icon-delete"
          @click="handleSort(scope.row, scope.index)">排序
        </el-button>
        <el-button
          v-if="scope.row.editable && ((userInfo.userType == 3 || userInfo.userType == 4) || !scope.row.isPlatform)"
          type="text"
          size="mini"
          icon="el-icon-delete"
          @click="handleDel(scope.row, scope.index)">删除
        </el-button>
      </template>
      <template v-slot:city="scope">
        <el-button
          type="text"
          size="mini"
          @click="cityView(scope.row, scope.index)">查看
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getTagList, setTagSort } from '@/api/tms/city'
import { tableOption } from './const'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      tableLoading: false,
      tableData: [],
      page: {
        currentPage: 1,
        pageSize: 20,
      },
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    tableOption () {
      console.log(this.userInfo)
      return tableOption(this.userInfo.userType == 4 || this.userInfo.userType == 3)
    }
  },
  methods: {
    getList (page = this.page) {
      this.tableLoading = true
      getTagList({
        current: page.currentPage,
        size: page.pageSize,
        ...this.searchForm,
      }).then(({data}) => {
        if (data.code === 0) {
          console.log(data.data.data.records)
          this.tableData = data.data.data.records
        }
        console.log(data)
      }).finally(() => {
        this.tableLoading = false
      })
    },
    handleUpdate (row, index) {
      this.$refs.crud.rowEdit(row, index)
    },
    cityView (row) {
      console.log(row)
      this.$prompt('大于0的整数', '请输入排序', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'number',
        inputValidator: (val) => {
          return /^[1-9]+0*$/.test(val)
        },
        inputErrorMessage: '请输入大于0的整数'
      }).then(({ value }) => {
        if (value) {
          setTagSort({
            tagId: row.tagId,
            sort: value,
          }).then(({data}) => {
            if (data.code === 0) {
              this.$message.success('操作成功')
              this.getList()
            }
          })
        }
      })
      console.log(row.tagId)
    },
    handleSort (row, index) {
      this.$prompt('', '请输入清洗范围', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // inputValidator: (val) => {
        //   if (cleanScopeReg.test(val)) {
        //     let numArr = val.substring(0, val.length - 1).split('-')
        //     return !(parseInt(numArr[0]) > parseInt(numArr[1]))
        //   } else {
        //     return false
        //   }
        // },
        // inputErrorMessage: '格式不正确'
      }).then(({ value }) => {
        console.log(val)
      })
    },
    handleDel () {

    },
    
    searchChange (form) {
      this.page = {
        currentPage: 1,
        pageSize: 20,
      }
      this.getList(form)   
    },
    refreshChange () {
      this.getList(this.page)
    },
  }
}
</script>

<style lang="" scoped>
</style>
