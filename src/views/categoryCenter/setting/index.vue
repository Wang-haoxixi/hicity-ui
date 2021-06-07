<template>
  <basic-container>
    <hc-table-form title="标签配置">
      <hc-crud ref="hcCrud" :option="tableOption" :fetchListFun="fetchListFun" :addFun="addFun" :updateFun="updateFun">
        <template slot="menuLeft">
          <el-button
            @click="manageRecommend"
            size="mini"
            >推荐管理</el-button>
        </template>
        <template v-slot:table="scope">
          <hc-table-data-box :empty="!scope.tableData || scope.tableData.length == 0" :loading="boxLoading">
            <div class="label-box">
              <div v-for="label in scope.tableData" :key="label.id" class="label-item">
                <div class="label-item-info">
                  <div class="label-item-name">{{label.name}}</div>
                </div>
                <div class="label-item-option">
                  <div class="label-item-option-left">
                    引用：{{label.numberOfUse}}
                  </div>
                  <div class="label-item-option-right">
                    <el-button v-if="label.isRecommend == 1" type="text" size="mini" @click="toCancelRecommend(label.id)">取消推荐</el-button>
                    <el-button v-else type="text" size="mini" @click="toRecommend(label.id)">推荐</el-button>
                    <el-button type="text" size="mini" @click="handleUpdate(label)">编辑</el-button>
                    <el-button type="text" size="mini" @click="handleDel(label.id)">删除</el-button>
                  </div>
                </div>
              </div>
            </div>
          </hc-table-data-box>
        </template>
      </hc-crud>
    </hc-table-form>

    <el-dialog
      title="推荐列表"
      :visible.sync="dialogVisible"
      width="width">
      <label-recommend ref="recommend" @refresh="recommendRefresh"></label-recommend>
      <div slot="footer">
        <el-button @click="dialogVisible = false">返 回</el-button>
      </div>
    </el-dialog>

    <hc-city-box ref="recommendSelect" @save="setRecommend"></hc-city-box>

  </basic-container>
</template>

<script>
import { getLabelPage, saveLabel, deleteLabel, setLabelRecommend, cancelLabelRecommend } from "@/api/cms/news"
import { mapGetters } from 'vuex'
import HcCityBox from '@/views/components/HcCity/HcCityBox/index'
import LabelRecommend from './recommend'
import { tableOption } from './const.js'

function getCityList (tree) {
  let cityList = []
  if (tree) {
    if (tree.children) {
      for (let i = 0; i < tree.children.length; i++) {
        cityList = [...cityList, ...getCityList(tree.children[i])]
      }
    } else {
      cityList.push(tree.id)
    }
  }
  return cityList
}
export default {
  components: { HcCityBox, LabelRecommend },
  data () {
    return {
      recommendId: null,
      tableOption,
      tagList: [],
      boxLoading: false,
      dialogVisible: false,
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    isAdmin () {
      return this.userInfo.userType == 3 || this.userInfo.userType == 4
    },
  },
  methods: {
    fetchListFun (params) {
      this.boxLoading = true
      return new Promise((resolve, reject) => {
        getLabelPage(params).then(({data}) => {
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
    addFun(formData, next, loading) {
      saveLabel(formData).then(({data}) => {
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
      saveLabel(formData).then(({data}) => {
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
    handleDel (id) {
      this.$confirm("是否确认删除该标签?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteLabel(id).then(({data}) => {
          if (data.code === 0) {
            this.$message.success('删除成功')
            this.$refs.hcCrud.refresh()
          }
        })
      })
    },
    toRecommend (id) {
      this.recommendId = id
      this.$refs.recommendSelect.open(this.userInfo.manageCityId, [], false)
    },
    setRecommend (city) {
      let cityList = getCityList(city)
      setLabelRecommend({
        id: this.recommendId,
        cityList
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
    toCancelRecommend (id) {
      this.$confirm("是否确认取消推荐该标签?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        cancelLabelRecommend(id).then(({data}) => {
          if (data.code === 0) {
            this.$message.success('操作成功')
            this.$refs.hcCrud.refresh()
          }
        })
      })
    },
    manageRecommend () {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.recommend.open()
      })
    },
    recommendRefresh () {
      this.$refs.hcCrud.refresh()
    }
  }
}
</script>

<style lang="scss" scoped>
.label-box {
  display: grid;
  grid-template-columns: repeat(auto-fill, 250px);
  grid-template-rows: repeat(auto-fill, 90px);
  grid-gap: 24px;
  .label-item {
    border-radius: 2px;
    border: 1px solid #E9E9E9;
    padding: 16px 13px;
    .label-item-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 22px;
      .label-item-name {
        height: 22px;
        line-height: 22px;
        flex: 1 1 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .label-item-sort {
        flex: 50px 0 0;
        height: 22px;
        line-height: 22px;
        text-align: right;
      }
    }
    .label-item-option {
      margin-top: 16px;
      height: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .mune-item {
        font-size: 14px;

      }
      .label-item-option-left {
      }
      .label-item-option-right {

      }
    }
  }
}
</style>
