<template>
  <basic-container>
    <hc-table-form
      :title="title"
      :formVisible="publish"
      @go-back="publish = false">
      <hc-crud ref="hcCrud" :option="{header: true}" :fetchListFun="fetchListFun">
        <el-button
          slot="menuLeft"
          class="filter-item"
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="toCreate">新建
        </el-button>
        <template v-slot:table="scope">
          <hc-table-data-box :empty="!scope.tableData || scope.tableData.length == 0" :loading="boxLoading">
            <div class="classify-box">
              <div v-for="classify in scope.tableData" :key="classify.id" class="classify-item">
                <div class="classify-item-name">{{classify.classifyName}}</div>
                <el-image class="classify-item-cover" :src="classify.imageUrl"></el-image>
                <div class="classify-item-topic-view" @click="topicView(classify.id)">关联话题</div>
                <div class="classify-item-option">
                  <template v-if="classify.operationAuthority == 1">
                    <el-button type="text" size="mini" @click="toUpdate(classify)">编辑</el-button>
                    <el-button type="text" size="mini" @click="handleDel(classify.id)">删除</el-button>
                  </template>
                  <template v-if="classify.confAuthority == 1">
                    <el-button type="text" size="mini" @click="enableChange(classify)">{{classify.openOrClose ? '停用' : '启用'}}</el-button>
                  </template>
                </div>
              </div>
            </div>
          </hc-table-data-box>
        </template>
      </hc-crud>

      <template slot="form">
        <el-form ref="form"
          class="dialog-main-tree"
          :model="formData"
          :rules="formRule"
          label-width="180px">
          <el-form-item label="分类名称：" prop="classifyName">
            <el-input v-model="formData.classifyName"></el-input>
          </el-form-item>
          <el-form-item label="图片：">
            <hc-image-upload :limit="1" v-model="formData.imageUrl"></hc-image-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="formLoading" @click="handleSave">保 存</el-button>
          </el-form-item>
        </el-form>
        <avue-crud
          :option="tableOption"
          :data="tableData">
          <template slot="menuLeft">
            关联话题
          </template>
          <template slot="menuRight">
            <el-button
              class="filter-item"
              type="primary"
              size="mini"
              icon="el-icon-plus"
              @click="toAddTopic">添加
            </el-button>
          </template>
          <template slot="menu" slot-scope="scope">
            <template>
              <el-button type="text" size="mini" @click="toDeleteTopic(scope.row)" >删除</el-button>
            </template>
          </template>
        </avue-crud>
        <el-dialog
          title="新增关联"
          :visible.sync="topicDialogVisible"
          width="70%">
          <el-form :model="formData" labelWidth="150px">
            <el-form-item label="选择话题：">
              <el-select v-model="topicAdd" multiple value-key="id">
                <el-option v-for="item in topicSelectList" :key="item.id" :value="item" :label="item.topicsName">{{item.topicsName}}</el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button v-show="formType == 'add'" type="primary" :loading="formLoading" @click="addTopic">保 存</el-button>
            <el-button @click="topicDialogVisible = false">取 消</el-button>
          </div>
        </el-dialog>
      </template>
    </hc-table-form>
    <el-dialog
      title="关联话题"
      :visible.sync="topicViewDialogVisible"
      width="70%"
    >
      <template>
        <div class="classify-list" v-if="relativeTopicList && relativeTopicList.length > 0">
          <div v-for="topic in relativeTopicList"
            :key="topic.id"
            class="classify-list-item">
            {{ topic.topicsName }}
          </div>
        </div>
        <hc-empty-data v-else></hc-empty-data>
      </template>
      <div slot="footer">
        <el-button @click="topicViewDialogVisible = false">返 回</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import { getClassifyList, addClassify, getTopicList, updateClassify, deleteClassify, deleteRelation, setEnableState } from '@/api/cms/travel'
import { mapGetters } from 'vuex'
import HcImageUpload from '@/views/components/HcImageUpload/index'
import HcTableForm from "@/views/components/HcTableForm/index"
import HcEmptyData from "@/views/components/HcEmptyData/index"
export default {
  components: { HcImageUpload, HcTableForm, HcEmptyData },
  data () {
    return {
      formData: {
        classifyName: '',
        imageUrl: '',
      },
      formType: 'add',
      classifyList: [],
      topicViewDialogVisible: false,
      relativeTopicList: [],
      publish: false,
      publishType: "",
      tableData: [],
      tableOption: {
        border: true,
        index: true,
        indexLabel: '序号', 
        stripe: true,
        menuAlign: 'center',
        editBtn: false,
        delBtn: false,
        align: 'center',
        addBtn: false,
        refreshBtn: false,
        columnBtn: false,
        labelWidth: 160,
        menuWidth: 150,
        column: [
          {
            label: '话题名称',
            prop: 'topicsName',
          },
          {
            label: '被应用次数',
            prop: 'numberOfTimesUsed',
          },
        ]
      },
      topicDialogVisible: false,
      topicAdd: [],
      topicSelectList: [],
      formRule: {
        classifyName: [{required: true, message: '分类名称不能为空'}]
      },
      boxLoading: false,
      formLoading: false
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    isAdmin () {
      return this.userInfo.userType == 3 || this.userInfo.userType == 4
    },
    title () {
      if (!this.publish) {
        return '游记话题'
      } else {
        if (this.publishType == 'add') {
          return '游记话题-新增'
        } else {
          return '游记话题-编辑'
        }
      }
    }
  },
  methods: {
    enableChange (classify) {
      setEnableState({
        classifyId: classify.id,
        type: 0,
        state: classify.openOrClose ? 1 : 0
      }).then(({data}) => {
        this.$notify({
          title: "成功",
          message: "操作成功",
          type: "success",
          duration: 2000,
        });
        this.$refs.hcCrud.refresh()
      })
    },
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        this.boxLoading = true
        getClassifyList(params).then(({data}) => {
          resolve({
            records: data.data.data.records,
            page: {
              total: data.data.data.total
            }
          })
        }).finally(() => {
          this.boxLoading = false
        })
      })
      
    },
    toCreate () {
      this.formData = {
        classifyName: '',
        imageUrl: '',
      };
      this.tableData = []
      this.publish = true;
      this.publishType = "add";
    },
    toUpdate (row) {
      getTopicList({
        queryType: 1,
        classifyId: row.id
      }).then(({data}) => {
        this.formData = {
          id: row.id,
          classifyName: row.classifyName,
          imageUrl: row.imageUrl,
        };
        this.tableData = data.data.data.records
        this.publish = true;
        this.publishType = "edit";
      })
    },
    handleSave() {
      this.formLoading = true
      this.$refs.form.validate(validate => {
        if (validate) {
          if (this.publishType == 'edit') {
            updateClassify(this.formData).then(({data}) => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.publish = false
              this.$refs.hcCrud.refresh()
            }).finally(() => {
              this.formLoading = false
            })
          } else if (this.publishType == 'add') {
            let form = {...this.formData}
            let topicsBankIds = []
            for (let i = 0; i < this.tableData.length; i++) {
              topicsBankIds.push(this.tableData[i].id)
            }
            form.topicsBankIds = topicsBankIds
            addClassify(form).then(({data}) => {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              this.publish = false
              this.$refs.hcCrud.refresh()
            }).finally(() => {
              this.formLoading = false
            })
          }
        } else {
          this.formLoading = false
        }
      })
    },
    topicView(classifyId) {
      getTopicList({
        queryType: 1,
        classifyId
      }).then(({data}) => {
        this.relativeTopicList = data.data.data.records
        this.topicViewDialogVisible = true;
      })
    },
    handleDel (id) {
      this.$confirm("是否确认删除该话题分类?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        deleteClassify(id).then(({data}) => {
          if (data.code === 0) {
            this.$message.success('删除成功')
            this.$refs.hcCrud.refresh()
          }
        })
      })
      .catch(function () {});
    },
    toAddTopic () {
      this.topicAdd = []
      getTopicList({queryType: 2}).then(({data}) => {
        this.topicSelectList = data.data.data.records
        this.topicDialogVisible = true
      })
    },
    addTopic () {
      if (this.topicAdd.length > 0) {
        this.formLoading = true
        if (this.publishType == 'edit') {
          let topicsBankIds = []
          let topicAdd = this.topicAdd
          for (let i = 0; i < topicAdd.length; i++) {
            topicsBankIds.push(topicAdd[i].id)
          }
          updateClassify({
            id: this.formData.id,
            classifyName: this.formData.classifyName,
            imageUrl: this.formData.imageUrl,
            topicsBankIds
          }).then(({data}) => {
            this.$notify({
              title: "成功",
              message: "添加成功",
              type: "success",
              duration: 2000,
            });
            this.topicDialogVisible = false
            getTopicList({
              queryType: 1,
              classifyId: this.formData.id
            }).then(({data}) => {
              this.tableData = data.data.data.records
            })
          }).finally(() => {
            this.formLoading = false
          })
        } else if (this.publishType == 'add') {
          this.tableData = [...this.tableData, ...this.topicAdd]
          this.topicDialogVisible = false
          this.formLoading = false
        }
      }
    },
    toDeleteTopic (row) {
      this.$confirm("是否确认删除该话题?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        if (this.publishType == 'edit') {
          deleteRelation(row.id).then(({data}) => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000,
            });
            getTopicList({
              queryType: 1,
              classifyId: this.formData.id
            }).then(({data}) => {
              this.tableData = data.data.data.records
            })
          })
        } else if (this.publishType == 'add') {
          let tableData = this.tableData
          for (let i = 0; i < tableData.length; i++) {
            if (tableData[i].id === row.id) {
              this.tableData.splice(i, 1)
              return
            }
          }
        }
      })
      .catch(function () {});
    }
  }
}
</script>

<style lang="scss" scoped>
.classify-box {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 250px);
  grid-template-rows: repeat(auto-fill, 292px);
  grid-gap: 24px;
  .classify-item {
    border-radius: 2px;
    border: 1px solid #E9E9E9;
    padding: 16px;
    .classify-item-name {
      height: 22px;
      line-height: 22px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-align: center;
    }
    .classify-item-cover {
      margin-top: 16px;
      height: 138px;
      width: 218px;
    }
    .classify-item-topic-view {
      margin-top: 12px;
      height: 34px;
      line-height: 34px;
      border: 1px solid #D9D9D9;
      border-radius: 5px;
      color: #666666;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
    }
    .classify-item-option {
      margin-top: 16px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      .mune-item {
        font-size: 14px;
      }
    }
  }
}

.classify-list {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  .classify-list-item {
    margin-bottom: 10px;
    height: 30px;
    line-height: 30px;
    padding: 0 15px;
    border: 1px solid #e9e9e9;
    border-radius: 4px;
    margin-right: 20px;
  }
}
</style>
