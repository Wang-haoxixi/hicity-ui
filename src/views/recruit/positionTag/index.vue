<template>
  <basic-container>
    <hc-table-form title="职位标签管理">
      <hc-crud ref="hcCrud" :fetchListFun="fetchListFun" :option="tableOption" :add-fun="addTag" :update-fun="updateTag" :delete-fun="deleteTag">
        <template v-slot:menuLeft>
          <el-button type="small" @click="showTagType">标签分类</el-button>
        </template>
        <template v-slot:positionLableTypeIdForm="scope">
          <hc-remote-select v-model="scope.formData.positionLableTypeId" :remote-fun="getAllTagType" :show-word="scope.formData.positionLableType" @change="scope.formData.positionLableType = $event" placeholder="请输入关键字"></hc-remote-select>
        </template>
      </hc-crud>
    </hc-table-form>
    <el-dialog
      title="标签分类"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="dialogBeforeClose">
      <div>
        <el-button icon="el-icon-plus" size="small" @click="addTagType"></el-button>
        <div class="type-list" v-loading="listLoading">
          <tag-type-item v-for="(item, index) in tagTypeList" :key="index" :item-data="item" @loading="listLoading = $event" @delete-item="deleteTagType(item, index)"></tag-type-item>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">返 回</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import { getTagList, addTag, updateTag, deleteTag, addTagType, deleteTagType, getAllTagType } from "@/api/recruit/positionTag"
import HcRemoteSelect from "@/views/components/HcForm/HcRemoteSelect/index"
import TagTypeItem from './TagTypeItem'
export default {
  components: { HcRemoteSelect, TagTypeItem },
  data () {
    return {
      tableOption: {
        labelWidth: '100px',
        columns: [
          {
            label: 'ID',
            prop: 'positionLableId',
            width: 120,
            formHidden: true
          },
          {
            label: '标签名称',
            prop: 'positionLable',
            rules: [{required: true, message: '请输入标签名称'}],
            maxlength: 50
          },
          {
            label: '标签分类',
            prop: 'positionLableTypeId',
            formSlot: true,
            rules: [{required: true, message: '请输入关键字并选择分类'}],
            maxlength: 50,
            formatter: function (row) {
              return row.positionLableType
            }
          }
        ],
        addBtn: true,
        menu: ['edit', 'delete'],
        menuWidth: 100
      },
      dialogVisible: false,
      tagTypeList: [],
      listLoading: false
    }
  },
  methods: {
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        getTagList(params).then(({data}) => {
          let records = data.data.data.records
          for (let i = 0; i < records.length; i++) {
            if (!records[i].positionLableType) {
              records[i].positionLableType = ''
            }
          }
          resolve({
            records,
            page: {
              total: data.data.data.total
            }
          })
        })
      })
    },
    getAllTagType (positionLableType) {
      return new Promise((resolve, reject) => {
        getAllTagType({positionLableType, current: 1, size: 100}).then(({data}) => {
          let typeListTemp = data.data.data
          let typeList = []
          for (let i = 0; i < typeListTemp.length; i++) {
            typeList.push({
              label: typeListTemp[i].positionLableType,
              value: typeListTemp[i].positionLableTypeId
            })
          }
          resolve(typeList)
        }, () => {
          reject(new Error("数据获取失败！"))
        })
      })
    },
    addTag (row, done, loading) {
      addTag(row).then(({data}) => {
        this.$message.success('添加成功')
        done()
      }).finally(() => {
        loading()
      })
    },
    updateTag (row, done, loading) {
      updateTag(row).then(({data}) => {
        this.$message.success('修改成功')
        done()
      }).finally(() => {
        loading()
      })
    },
    deleteTag (row, done) {
      this.$confirm("是否确认删除该标签?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteTag([row.positionLableId]).then(({data}) => {
          this.$message.success('删除成功')
          done()
        })
      });
    },
    showTagType () {
      getAllTagType().then(({data}) => {
        this.tagTypeList = data.data.data
        this.dialogVisible = true
      })
    },
    addTagType () {
      addTagType({positionLableType: '新建分类'}).then(({data}) => {
        this.$message.success('分类添加成功')
        this.showTagType()
      })
    },
    deleteTagType (item, index) {
      this.$confirm("是否确认删除该标签分类?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteTagType([item.positionLableTypeId]).then(({data}) => {
          this.$message.success('删除成功')
          this.tagTypeList.splice(index, 1)
        })
      });
    },
    dialogBeforeClose (next) {
      next()
    }
  }
}
</script>

<style lang="scss" scoped>
.type-list {
  // @include scrollBar;
  margin-top: 20px;
  padding-right: 20px;
  max-height: 300px;
  overflow-y: auto;
  &::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }
  &::-webkit-scrollbar {
    width: 7px;
    height: 7px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: hsla(220, 4%, 58%, .3);
  }
}
</style>
