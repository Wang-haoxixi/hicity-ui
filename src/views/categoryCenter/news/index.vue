<template>
  <basic-container>
    <el-form inline :model="tempSearch" class="demo-form-inline">
      <el-form-item label="栏目名称：">
        <el-input v-model="tempSearch.newsColumnName" placeholder="请输入栏目名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="toSearch()">查询</el-button>
      </el-form-item>
      <div>
        <el-button
          class="filter-item"
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="handleCreate">添加
        </el-button>
      </div>
    </el-form>

    <div class="column-box">
      <div v-for="column in columnList" :key="column.newsColumnId" class="column-item">
        <div class="column-item-info">
          <div class="column-item-name">{{column.newsColumnName}}</div>
          <!-- <div class="column-item-sort" v-if="column.isOpening && column.sort">No.{{column.sort}}</div> -->
        </div>
        <div class="column-item-option">
          <div class="column-item-option-left">
            <el-button v-if="isAdmin" type="text" size="mini" @click="cityView(column.newsColumnId)">查看配置城市</el-button>
            <el-button v-else-if="column.closeAllowed == '0'" type="text" size="mini" @click="handleStart(column)">{{column.havEnable ? '启用' : '停用'}}</el-button>
          </div>
          <div class="column-item-option-right">
            <!-- <el-button v-if="!isAdmin" type="text" size="mini" @click="handleSort(column)">排序</el-button> -->
            <template v-if="isAdmin && column.source == 1 || !isAdmin && column.source == 2">
              <el-button type="text" size="mini" @click="handleUpdate(column)">编辑</el-button>
              <el-button type="text" size="mini" @click="handleDel(column.newsColumnId)">删除</el-button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination-box">
      <el-pagination
        style="display: inline-block"
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 30,, 40, 50, 100]"
        background
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>

    <el-dialog
      title="展示城市"
      :visible.sync="cityViewDialogVisible"
      width="70%">
      <hc-city-box view-only :init-city-list="initCityList" :all-city-list="allCityList"></hc-city-box>
      <div slot="footer">
        <el-button @click="cityViewDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    

    <el-dialog
      :title="formTitle"
      :visible.sync="formDialogVisible"
      width="70%">
      <el-form :model="formData" labelWidth="150px">
        <el-form-item label="栏目名称：">
          <el-input v-model="formData.newsColumnName"></el-input>
        </el-form-item>
        <el-form-item label="关联标签：">
          <el-select style="width: 100%" v-model="formData.lableIdList" multiple filterable placeholder="请选择">
            <el-option
              v-for="tag in tagList"
              :key="tag.tagId"
              :label="tag.name"
              :value="tag.tagId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isAdmin" label="是否允许城市停用：">
          <el-switch v-model="formData.closeAllowed" active-value="0" active-text="允许" inactive-text="不允许" inactive-value="1"></el-switch>
        </el-form-item>
        
      </el-form>
      <div slot="footer">
        <el-button v-show="formType == 'add'" type="primary" @click="create">保 存</el-button>
        <el-button v-show="formType == 'edit'" type="primary" @click="update">修 改</el-button>

        <el-button @click="formDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import { getColumnList, addColumn, updateColumn, deleteColumn, columnEnable, columnOpenList } from '@/api/cms/newsColumn'
import { getAllTagList } from '@/api/tms/city'
import { mapGetters } from 'vuex'
import HcCityBox from '@/views/components/HcCityBox/index'
export default {
  components: { HcCityBox },
  data () {
    return {
      tempSearch: {
        newsColumnName: ''
      },
      searchForm: {},
      formData: {},
      formType: 'add',
      formDialogVisible: false,
      columnList: [],
      tagList: [],
      page: {
        currentPage: 1,
        pageSize: 20,
        total: 0,
      },
      allCityList: [],
      initCityList: [],
      cityViewDialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    isAdmin () {
      return this.userInfo.userType == 3 || this.userInfo.userType == 4
    },
    formTitle () {
      if (this.formType == 'add') {
        return '新 增'
      } else if (this.formType == 'edit') {
        return '编 辑'
      }
    },
  },
  created () {
    this.initTagList()
    this.getList()
    
  },
  methods: {
    initTagList () {
      getAllTagList({cityId: this.userInfo.manageCityId}).then(({data}) => {
        this.tagList = data.data.data
      })
    },
    getList (page = this.page, form = this.searchForm) {
      this.tableLoading = true
      let formData = {
        current: page.currentPage,
        size: page.pageSize,
        ...form,
        cityId: this.userInfo.manageCityId
      }
      if (this.isAdmin) {
        formData.source = 1
      }
      getColumnList(formData).then(({data}) => {
        if (data.code === 0) {
          this.columnList = data.data.data.records
          this.page = {
            ...page,
            total: data.data.data.total
          }
        }
      }).finally(() => {
        this.tableLoading = false
      })
    },
    handleCreate () {
      this.formData = {
        cityIdList: [this.userInfo.manageCityId],
      }
      this.formType = 'add'
      this.formDialogVisible = true
    },
    create() {
      addColumn(this.formData).then(({data}) => {
        this.formDialogVisible = false
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
        this.page.currentPage = 1
        this.getList()
      }).catch(() => {
        loading()
      })
    },
    handleUpdate (row) {
      this.formData = row
      this.formType = 'edit'
      this.formDialogVisible = true
    },
    update() {
      updateColumn(this.formData).then(({data}) => {
        this.formDialogVisible = false
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      }).catch(() => {
        loading()
      })
    },
    cityView (columnId) {
      columnOpenList(columnId).then(({data}) => {
        let cityList = data.data.data
        let allCityList = []
        let initCityList = []
        for (let i = 0; i < cityList.length; i++) {
          allCityList.push({
            cityId: cityList[i].cityId,
            cityName: cityList[i].cityName
          })
          if (cityList[i].isOpening) {
            initCityList.push(cityList[i].cityId)
          }
        }
        this.initCityList = initCityList
        this.allCityList = allCityList
        this.cityViewDialogVisible = true
      })
    },
    handleDel (newsColumnId) {
      deleteColumn({cityId: this.userInfo.manageCityId, newsColumnId}).then(({data}) => {
        if (data.code === 0) {
          this.$message.success('删除成功')
          this.getList()
        }
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
    toSearch () {
      this.searchForm = this.tempSearch
      this.page.currentPage = 1
      this.getList()
    },
    currentChange (current) {
      this.page.currentPage = current
      this.getList()
    },
    sizeChange (size) {
      this.page.pageSize = size
      this.page.currentPage = 1
      this.getList()
    }
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
