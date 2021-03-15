<template>
  <basic-container>
    <hc-table-form title="城市新闻栏目">
      <hc-crud ref="hcCrud" :option="tableOption" :fetchListFun="fetchListFun" :addFun="addFun" :updateFun="updateFun">
        <template v-slot:lableIdListForm="scope">
          <el-select style="width: 100%" v-model="scope.formData.lableIdList" multiple filterable placeholder="请选择">
              <el-option
                v-for="tag in tagList"
                :key="tag.tagId"
                :label="tag.name"
                :value="tag.tagId">
              </el-option>
            </el-select>
        </template>
        <template v-slot:table="scope">
           <hc-table-data-box :empty="!scope.tableData || scope.tableData.length == 0" :loading="boxLoading">
            <div class="column-box">
        <div v-for="column in scope.tableData" :key="column.newsColumnId" class="column-item">
          <div class="column-item-info">
            <div class="column-item-name">{{column.newsColumnName}}</div>
            <!-- <div class="column-item-sort" v-if="column.isOpening && column.sort">No.{{column.sort}}</div> -->
          </div>
          <div class="column-item-option">
            <div class="column-item-option-left">
              <el-button v-if="confAuthority(column)" type="text" size="mini" @click="cityView(column.newsColumnId)">查看配置城市</el-button>
              <el-button v-else-if="column.closeAllowed == '0'" type="text" size="mini" @click="handleStart(column)">{{column.havEnable ? '启用' : '停用'}}</el-button>
            </div>
            <div class="column-item-option-right">
              <!-- <el-button v-if="!isAdmin" type="text" size="mini" @click="handleSort(column)">排序</el-button> -->
              <template v-if="operAuthority(column)">
                <el-button type="text" size="mini" @click="handleUpdate(column)">编辑</el-button>
                <el-button type="text" size="mini" @click="handleDel(column.newsColumnId)">删除</el-button>
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
import { getColumnList, addColumn, getColumnDetail, updateColumn, deleteColumn, columnEnable, columnOpenList } from '@/api/cms/newsColumn'
import { getAllTagList } from '@/api/tms/city'
import { mapGetters } from 'vuex'
import HcCityBox from '@/views/components/HcCity/HcCityBox/index'
export default {
  components: { HcCityBox },
  data () {
    return {
      tagList: [],
      boxLoading: false,
      tableOption: {
        menu: ['add'],
        labelWidth: '150px',
        columns: [
          {
            label: '栏目名称',
            prop: 'newsColumnName',
            maxlength: 50,
            search: true,
            rules: [{required: true,message: '请输入栏目名称', trigger: 'blur'}]
          },
          {
            label: '关联标签',
            prop: 'lableIdList',
            formSlot: true,
            rules: [{required: true,message: '请选择关联标签', trigger: 'blur'}]
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
    isAdmin () {
      return this.userInfo.userType == 3 || this.userInfo.userType == 4
    },
  },
  created () {
    this.initTagList()
  },
  methods: {
    confAuthority (column) {
      return this.userType !== 3 && this.userType <= column.source
    },
    operAuthority (column) {
      return this.userType <= column.source
    },
    initTagList () {
      getAllTagList({cityId: this.userInfo.manageCityId}).then(({data}) => {
        this.tagList = data.data.data
      })
    },fetchListFun (params) {
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
    handleUpdate ({newsColumnId}) {
      getColumnDetail(newsColumnId).then(({data}) => {
        let formData = {
          newsColumnId: data.data.data.newsColumnId,
          newsColumnName: data.data.data.newsColumnName,
          lableIdList: data.data.data.lableIdList,
          closeAllowed: data.data.data.closeAllowed,
          cityIdList: data.data.data.cityIdList,
        }
        this.$refs.hcCrud.rowEdit(formData)
      })
    },
    updateFun(formData, next, loading) {
      updateColumn(formData).then(({data}) => {
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
    handleDel (newsColumnId) {
      this.$confirm("是否删除该栏目?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteColumn({cityId: this.userInfo.manageCityId, newsColumnId}).then(({data}) => {
          if (data.code === 0) {
            this.$message.success('删除成功')
            this.$refs.hcCrud.refresh()
          }
        })
      })
    },
    handleStart (row) {
      let havEnable = row.havEnable ? 0 : 1
      columnEnable({
        newsColumnId: row.newsColumnId,
        havEnable,
        cityId: this.userInfo.manageCityId
      }).then(({data}) => {
        if (data.code === 0) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    }, 
  }
}
</script>

<style lang="scss" scoped>
.column-box {
  margin-top: 24px;
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
