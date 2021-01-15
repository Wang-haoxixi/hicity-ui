<template>
  <basic-container>
    <el-form inline :model="tempSearch" class="demo-form-inline">
      <el-form-item label="栏目名称：">
        <el-input v-model="tempSearch.name" placeholder="请输入标签名称"></el-input>
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

    <div class="tag-box">
      <div v-for="tag in tagList" :key="tag.tagId" class="tag-item">
        <div class="tag-item-info">
          <div class="tag-item-name">{{tag.name}}</div>
          <div class="tag-item-sort" v-if="tag.isOpening && tag.sort">No.{{tag.sort}}</div>
        </div>
        <div class="tag-item-option">
          <div class="tag-item-option-left">
            <el-button v-if="userInfo.userType == 3 && userInfo.userType == 4" type="text" size="mini" @click="cityView(tag.tagId)">查看配置城市</el-button>
            <el-button v-else-if="tag.editable" type="text" size="mini" @click="handleStart(tag)">{{tag.isOpening ? '停用' : '启用'}}</el-button>
          </div>
          <div class="tag-item-option-right">
            <el-button v-if="!isAdmin" type="text" size="mini" @click="handleSort(tag)">排序</el-button>
            <template v-if="isAdmin || !tag.isPlatform">
              <el-button type="text" size="mini" @click="handleUpdate(tag)">编辑</el-button>
              <el-button type="text" size="mini" @click="handleDel(tag.tagId)">删除</el-button>
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
      :title="formTitle"
      :visible.sync="formDialogVisible"
      width="70%">
      <el-form :model="formData" labelWidth="150px">
        <el-form-item label="栏目名称：">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item v-if="isAdmin" label="是否允许城市停用：">
          <el-switch v-model="formData.editable" active-text="允许" inactive-text="不允许"></el-switch>
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
import { getColumnList, addNewsColumn, updateNewsColumn, deleteNewsColumn } from '@/api/cms/newsColumn'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      tempSearch: {
        name: ''
      },
      searchForm: {},
      formData: {},
      formType: 'add',
      formDialogVisible: false,
      tagList: [],
      page: {
        currentPage: 1,
        pageSize: 20,
        total: 0,
      },
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
    this.getList()
  },
  methods: {
    getList (page = this.page, form = this.searchForm) {
      this.tableLoading = true
      getColumnList({
        current: page.currentPage,
        size: page.pageSize,
        ...form,
      }).then(({data}) => {
        if (data.code === 0) {
          this.tagList = data.data.data.records
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
        editable: false
      }
      this.formType = 'add'
      this.formDialogVisible = true
    },
    create() {
      addTag(this.formData).then(({data}) => {
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
      updateTag(this.formData).then(({data}) => {
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
    cityView (tagId) {
      tagOpenList(tagId).then(({data}) => {
        console.log(data)
      })
    },
    handleDel (tagId) {
      deleteTag({tagId}).then(({data}) => {
        if (data.code === 0) {
          this.$message.success('删除成功')
          this.getList()
        }
      })
    },
    handleStart (row) {
      let enable = row.isOpening ? 0 : 1
      tagEnable({
        tagId: row.tagId,
        enable
      }).then(({data}) => {
        if (data.code === 0) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    }, 
    handleSort (row, index) {
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
            sort: parseInt(value),
          }).then(({data}) => {
            if (data.code === 0) {
              this.$message.success('操作成功')
              this.getList()
            }
          })
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
.tag-box {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 250px);
  grid-template-rows: repeat(auto-fill, 90px);
  grid-gap: 24px;
  .tag-item {
    border-radius: 2px;
    border: 1px solid #E9E9E9;
    padding: 16px 13px;
    .tag-item-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 22px;
      .tag-item-name {
        height: 22px;
        line-height: 22px;
        flex: 1 1 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .tag-item-sort {
        flex: 50px 0 0;
        height: 22px;
        line-height: 22px;
        text-align: right;
      }
    }
    .tag-item-option {
      margin-top: 16px;
      height: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .mune-item {
        font-size: 14px;
        
      }
      .tag-item-option-left {
      }
      .tag-item-option-right {

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
