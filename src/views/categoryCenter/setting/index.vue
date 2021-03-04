<template>
  <basic-container>
    <hc-table-form title="标签配置">
      <hc-crud :option="tableOption" :fetchListFun="fetchListFun">
        <template v-slot:table="scope">
          <hc-table-data-box :empty="!scope.tableData || scope.tableData.length == 0" :loading="boxLoading">
            <div class="tag-box">
              <div v-for="tag in scope.tableData" :key="tag.tagId" class="tag-item">
                <div class="tag-item-info">
                  <div class="tag-item-name">{{tag.name}}</div>
                  <div class="tag-item-sort" v-if="!isAdmin && tag.isOpening && tag.sort">No.{{tag.sort}}</div>
                </div>
                <div class="tag-item-option">
                  <div class="tag-item-option-left">
                    <el-button v-if="userInfo.userType == 3 || userInfo.userType == 4" type="text" size="mini" @click="cityView(tag.tagId)">查看配置城市</el-button>
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
          </hc-table-data-box>
        </template>
      </hc-crud>
    </hc-table-form>


    <hc-city-box ref="hcCityBox"></hc-city-box>

    <el-dialog
      :title="formTitle"
      :visible.sync="formDialogVisible"
      width="70%">
      <el-form :model="formData" labelWidth="150px">
        <el-form-item label="标签名称：">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="标签编码：">
          <el-input v-model="formData.tagCode"></el-input>
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
import { getTagList, setTagSort, tagEnable, addTag, updateTag, deleteTag, tagOpenList } from '@/api/tms/city'
import { mapGetters } from 'vuex'
import HcCityBox from '@/views/components/HcCity/HcCityBox/index'
import { tableOption } from './const.js'
export default {
  components: { HcCityBox },
  data () {
    return {
      tableOption,
      formData: {},
      formType: 'add',
      formDialogVisible: false,
      tagList: [],
      allCityList: [],
      initCityList: [],
      boxLoading: false,
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
    }
  },
  methods: {
    fetchListFun (params) {
      this.boxLoading = true
      return new Promise((resolve, reject) => {
        getTagList(params).then(({data}) => {
          resolve({
            records: data.data.data.records,
            page: {
              total: data.data.data.total
            }
          })
        }, (error) => {
          reject(error)
        }).finally(() => {
          this.boxLoading = false
        })
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
        this.$refs.hcCrud.refresh()
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
        this.$refs.hcCrud.refresh()
      }).catch(() => {
        loading()
      })
    },
    cityView (tagId) {
      tagOpenList(tagId).then(({data}) => {
        this.$refs.hcCityBox.open(this.userInfo.manageCityId, data.data.data || [], true)
      })
    },
    handleDel (tagId) {
      deleteTag({tagId}).then(({data}) => {
        if (data.code === 0) {
          this.$message.success('删除成功')
          this.$refs.hcCrud.refresh()
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
          this.$refs.hcCrud.refresh()
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
              this.$refs.hcCrud.refresh()
            }
          })
        }
      })
    },
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
</style>
