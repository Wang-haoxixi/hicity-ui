<template>
  <basic-container>
    <hc-table-form title="官方发布栏目">
      <hc-crud ref="hcCrud" :option="tableOption" :fetchListFun="fetchListFun" :addFun="addFun" :updateFun="updateFun">
        <template v-slot:table="scope">
           <hc-table-data-box :empty="!scope.tableData || scope.tableData.length == 0" :loading="boxLoading">
            <div class="column-box">
              <div v-for="column in scope.tableData" :key="column.officialColumnId" class="column-item">
                <div class="column-item-info">
                  <div class="column-item-name">{{column.officialColumnName}}</div>
                  <!-- <div class="column-item-sort" v-if="column.isOpening && column.sort">No.{{column.sort}}</div> -->
                </div>
                <div class="column-item-option">
                  <div class="column-item-option-left">
                    <el-button v-if="confAuthority(column)" type="text" size="mini" @click="cityView(column.officialColumnId)">查看配置城市</el-button>
                    <el-button v-else-if="column.closeAllowed == '0'" type="text" size="mini" @click="handleStart(column)">{{column.havEnable ? '启用' : '停用'}}</el-button>
                  </div>
                  <div class="column-item-option-right">
                    <!-- <el-button v-if="!isAdmin" type="text" size="mini" @click="handleSort(column)">排序</el-button> -->
                    <template v-if="operAuthority(column)">
                      <el-button type="text" size="mini" @click="handleUpdate(column)">编辑</el-button>
                      <el-button type="text" size="mini" @click="handleDel(column.officialColumnId)">删除</el-button>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </hc-table-data-box>
        </template>
      </hc-crud>

    </hc-table-form>

    <hc-city-box ref="hcCityBox"></hc-city-box>
    
  </basic-container>
</template>

<script>
import { getColumnList, addColumn, updateColumn, deleteColumn, columnEnable, columnOpenList } from '@/api/cms/officialColumn'
import { mapGetters } from 'vuex'
import HcCityBox from '@/views/components/HcCity/HcCityBox/index'
export default {
  components: { HcCityBox },
  data () {
    return {
      formData: {},
      formType: 'add',
      formDialogVisible: false,
      columnList: [],
      page: {
        currentPage: 1,
        pageSize: 20,
        total: 0,
      },
      allCityList: [],
      initCityList: [],
      boxLoading: false,
      tableOption: {
        addBtn: true,
        labelWidth: '150px',
        columns: [
          {
            label: '栏目名称',
            prop: 'officialColumnName',
            maxlength: 50,
            search: true,
            trim: true,
            rules: [{required: true,message: '请输入栏目名称', trigger: 'blur'}]
          },
          {
            label: '是否允许城市停用',
            prop: 'closeAllowed',
            type: 'switch',
            inactiveText: '不允许',
            inactiveValue: '1',
            activeText: '允许',
            activeValue: '0',
            value: '1',
            rules: [{required: true,message: '请选择是否允许城市停用', trigger: 'blur'}]
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'userType']),
    formTitle () {
      if (this.formType == 'add') {
        return '新 增'
      } else if (this.formType == 'edit') {
        return '编 辑'
      }
    },
  },
  methods: {
    confAuthority (column) {
      return this.userType !== 3 && this.userType <= column.source
    },
    operAuthority (column) {
      return this.userType <= column.source
    },
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        this.boxLoading = true
        getColumnList({
          ...params,
          cityId: this.userInfo.manageCityId
        }).then(({data}) => {
          this.boxLoading = false
          resolve({
            records: data.data.data.records,
            page: {
              total: data.data.data.total
            }
          })
        })
      })
    },
    addFun(formData, next, loading) {
      addColumn({
        cityIdList: [this.userInfo.manageCityId],
        ...formData
      }).then(({data}) => {
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
        next()
      }).finally(() => {
        loading()
      })
    },
    handleUpdate (row) {
      this.$refs.hcCrud.rowEdit(row)
    },
    updateFun(formData, next, loading) {
      updateColumn(formData).then(({data}) => {
        this.formDialogVisible = false
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        next()
      }).finally(() => {
        loading()
      })
    },
    cityView (columnId) {
      columnOpenList(columnId).then(({data}) => {
        this.$refs.hcCityBox.open(this.userInfo.manageCityId, data.data.data || [], true)
      })
    },
    handleDel (officialColumnId) {
      this.$confirm("是否删除该栏目?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteColumn({cityId: this.userInfo.manageCityId, officialColumnId}).then(({data}) => {
          if (data.code === 0) {
            this.$message.success('删除成功')
            this.$refs.hcCrud.refresh()
          }
        })
      });
    },
    handleStart (row) {
      let havEnable = row.havEnable ? 0 : 1
      columnEnable({
        officialColumnId: row.officialColumnId,
        havEnable,
        cityId: this.userInfo.manageCityId
      }).then(({data}) => {
        if (data.code === 0) {
          this.$message.success('操作成功')
          this.$refs.hcCrud.refresh()
        }
      })
    }, 
  }
}
</script>

<style lang="scss" scoped>
.column-box {
  display: grid;
  grid-template-columns: repeat(auto-fill, 250px);
  grid-template-rows: repeat(auto-fill, 90px);
  grid-gap: 24px;
  .column-item {
    border-radius: 2px;
    border: 1px solid #E9E9E9;
    padding: 16px 13px;
    .column-item-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 22px;
      .column-item-name {
        height: 22px;
        line-height: 22px;
        flex: 1 1 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .column-item-sort {
        flex: 50px 0 0;
        height: 22px;
        line-height: 22px;
        text-align: right;
      }
    }
    .column-item-option {
      margin-top: 16px;
      height: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .mune-item {
        font-size: 14px;
        
      }
      .column-item-option-left {
      }
      .column-item-option-right {

      }
    }
  }
}
.pagination-box {
  padding: 10px 20px;
  margin: 15px 0 10px;
  text-align: right;
}
</style>