<template>
  <basic-container>
    <hc-table-form title="职位标签管理">
      <hc-crud ref="hcCrud" :fetchListFun="fetchListFun" :option="tableOption" :update-fun="updateTag" :delete-fun="deleteTag">
        <template v-slot:menuLeft>
          <el-button type="small" @click="showTagType">标签分类</el-button>
        </template>
        <template v-slot:positionLableTypeIdForm="scope">
          <hc-remote-select v-model="scope.formData.positionLableTypeId" :remote-fun="getAllTagType" :show-word="scope.formData.positionLableTypeName"></hc-remote-select>
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
          <tag-type-item v-for="(item, index) in tagTypeList" :key="index" :item-data="item" @loading="listLoading = $event"></tag-type-item>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">返 回</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import { getTagList, addTag, updateTag, deleteTag, addTagType, getAllTagType } from "@/api/admin/positionTag"
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
            prop: 'positionLable'
          },
          {
            label: '标签分类',
            prop: 'positionLableTypeId',
            formSlot: true
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
          resolve({
            records: data.data.data.records,
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
          let typeListTemp = data.data.data.records
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
        done()
      }).finally(() => {
        loading()
      })
    },
    updateTag (row, done, loading) {
      updateTag(row).then(({data}) => {
        done()
      }).finally(() => {
        loading()
      })
    },
    deleteTag (row, done) {
      deleteTag(row.positionLableId).then(({data}) => {
        done()
      })
    },
    showTagType () {
      getAllTagType().then(({data}) => {
        this.tagTypeList = data.data.data.records
        this.dialogVisible = true
      })
    },
    addTagType () {
      addTagType({positionLableType: '新建分类'}).then(({data}) => {
        this.showTagType()
      })
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
