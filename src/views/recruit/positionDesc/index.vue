<template>
  <basic-container>
    <hc-table-form title="职位描述模板管理">
      <hc-crud ref="hcCrud" :fetchListFun="fetchListFun" :option="tableOption" :add-fun="addDesc" :update-fun="updateDesc" :delete-fun="deleteDesc">
      </hc-crud>
    </hc-table-form>
  </basic-container>
</template>

<script>
import { getDescList, addDesc, updateDesc, deleteDesc } from "@/api/recruit/positionDesc"
export default {
  data () {
    return {
      tableOption: {
        labelWidth: '100px',
        columns: [
          {
            label: 'ID',
            prop: 'describeTemplateId',
            width: 120,
            formHidden: true,
          },
          {
            label: '职位描述',
            prop: 'content',
            search: true,
            trim: true,
            maxlength: 100,
            rules: [{required: true, message: '请输入职位描述', trigger: 'blur'}]
          },
          {
            label: '类型',
            prop: 'type',
            type: 'select',
            search: true,
            dicData: [
              {
                label: '岗位职责',
                value: 'duty'
              },
              {
                label: '岗位要求',
                value: 'requirement'
              },
            ],
            rules: [{required: true, message: '请选择类型', trigger: 'blur'}]
          },
        ],
        addBtn: true,
        menu: ['edit', 'delete'],
        menuWidth: 100
      },
    }
  },
  methods: {
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        getDescList(params).then(({data}) => {
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
    addDesc (row, done, loading) {
      addDesc(row).then(({data}) => {
        this.$message.success('添加成功')
        done()
      }).finally(() => {
        loading()
      })
    },
    updateDesc (row, done, loading) {
      let {describeTemplateId, type, content} = row
      updateDesc({
        describeTemplateId,
        type,
        content
      }).then(({data}) => {
        this.$message.success('修改成功')
        done()
      }).finally(() => {
        loading()
      })
    },
    deleteDesc (row, done) {
      this.$confirm("是否确认删除该职位描述?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteDesc([row.describeTemplateId]).then(({data}) => {
          this.$message.success('删除成功')
          done()
        })
      });
    },
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
