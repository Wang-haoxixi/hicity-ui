<template>
  <basic-container>
    <hc-table-form
      :title="title"
      :formVisible="publish"
      @go-back="publish = false">
      <template>
        <hc-crud ref="hcCrud" :fetchListFun="fetchListFun" :search-query="searchQuery">
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
                  <div class="classify-item-name">{{classify.brandClassificationName}}</div>
                  <el-image class="classify-item-cover" :src="classify.brandClassificationBg"></el-image>
                  <div class="classify-item-topic-view" @click="brandView(classify.brandClassificationId)">关联品牌</div>
                  <div class="classify-item-option">
                    <template>
                      <el-button type="text" size="mini" @click="toUpdate(classify)">编辑</el-button>
                      <el-button type="text" size="mini" @click="handleDel(classify.brandClassificationId)">删除</el-button>
                    </template>
                  </div>
                </div>
              </div>
            </hc-table-data-box>
          </template>
        </hc-crud>
      </template>
      <template slot="form">
        <el-form ref="form"
          class="dialog-main-tree"
          :model="formData"
          :rules="formRule"
          label-width="180px">
          <el-form-item label="分类名称：" prop="brandClassificationName">
            <el-input v-model.trim="formData.brandClassificationName" maxlength="6"></el-input>
          </el-form-item>
          <el-form-item label="模板选择：" prop="brandClassificationBg">
            <module-bg-list v-model="formData.brandClassificationBg"></module-bg-list>
          </el-form-item>
          <el-form-item label="关联品牌：">
            <avue-crud
              :option="tableOption"
              :data="formData.relations">
              <template slot="menuLeft">
                <el-button
                  class="filter-item"
                  type="primary"
                  size="mini"
                  icon="el-icon-plus"
                  @click="toAddBrand">添加
                </el-button>
              </template>
              <template v-slot:brandName="scope">
                <hc-remote-select :key="scope.row.brandId" v-model="scope.row.brandId" :remote-fun="getAllBrand" :show-word="scope.row.brandName" :disabled-items="brandSelected" @label-change="scope.row.brandName = $event"></hc-remote-select>
              </template>
              <template v-slot:sort="scope">
                <el-input-number v-model="scope.row.sortNumber" :min="1" :max="9999"></el-input-number>
              </template>
              <template slot="menu" slot-scope="scope">
                <template>
                  <el-button type="text" size="mini" @click="toDeleteBrand(scope.row)" >删除</el-button>
                </template>
              </template>
            </avue-crud>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="formLoading" @click="handleSave">保 存</el-button>
          </el-form-item>
        </el-form>
      </template>
    </hc-table-form>
    <el-dialog
      title="关联品牌"
      :visible.sync="brandViewDialogVisible"
      :before-close="dialogBeforeClose"
      width="70%"
    >
      <template>
        <div class="brand-list" v-if="relations && relations.length > 0">
          <div v-for="relation in relations"
            :key="relation.brandId"
            class="brand-list-item">
            <el-image class="brand-list-item-logo" :src="relation.brandLogo"></el-image>
            <hc-text-line :text="relation.brandName" class="brand-list-item-name" text-align="center"></hc-text-line>
          </div>
        </div>
        <hc-empty-data v-else></hc-empty-data>
      </template>
      <div slot="footer">
        <el-button @click="brandViewDialogVisible = false">返 回</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import { getBrandClassifyList, addBrandClassify, updateBrandClassify, getBrandClassifyDetail, deleteBrandClassify } from '@/api/mms/brandClassify'
import { getAllBrand } from "@/api/mms/brand"
import { mapGetters } from 'vuex'
import HcImageUpload from '@/views/components/HcImageUpload/index'
import HcTableForm from "@/views/components/HcTableForm/index"
import HcEmptyData from "@/views/components/HcEmptyData/index"
import ModuleBgList from './ModuleBgList.vue'
import HcRemoteSelect from "@/views/components/HcForm/HcRemoteSelect/index"
import HcTextLine from "@/views/components/HcTextLine/index"
export default {
  components: { HcImageUpload, HcTableForm, HcEmptyData, ModuleBgList, HcRemoteSelect, HcTextLine },
  data () {
    return {
      formData: {
        brandClassificationName: '',
        brandClassificationBg: '',
        relations: [],
      },
      formType: 'add',
      classifyList: [],
      brandViewDialogVisible: false,
      relativeBrandList: [],
      publish: false,
      publishType: "",
      searchQuery: [
        {
          type: 'text',
          maxlength: 10,
          label: '品牌分类',
          prop: 'brandClassificationName'
        }
      ],
      tableOption: {
        border: true,
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
            label: '品牌名称',
            prop: 'brandName',
            slot: true
          },
          {
            label: '排序',
            prop: 'sort',
            slot: true
          },
        ]
      },
      formRule: {
        brandClassificationName: [{required: true, message: '分类名称不能为空'}],
        brandClassificationBg: [{required: true, message: '模板图片不能为空'}],
      },
      relations: [],
      boxLoading: false,
      brandList: [],
      brandLoading: false,
      formLoading: false
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    title () {
      if (!this.publish) {
        return '品牌分类'
      } else {
        if (this.publishType == 'add') {
          return '品牌分类-新增'
        } else if (this.publishType == 'edit') {
          return '品牌分类-编辑'
        } else if (this.publishType == 'view') {
          return '品牌分类-详情'
        } else {
          return '品牌分类'
        }
      }
    },
    brandSelected () {
      if (this.formData.relations && this.formData.relations.length > 0) {
        let relations = this.formData.relations
        let list = []
        for (let i = 0; i < relations.length; i++) {
          list.push(relations[i].brandId)
        }
        return list
      }
      return []
    }
  },
  methods: {
    getAllBrand (brandName) {
      return new Promise((resolve, reject) => {
        getAllBrand({brandName}).then(({data}) => {
          let brandListTemp = data.data.data
          let brandList = []
          for (let i = 0; i < brandListTemp.length; i++) {
            brandList.push({
              label: brandListTemp[i].brandName,
              value: brandListTemp[i].brandId
            })
          }
          resolve(brandList)
        }, () => {
          reject(new Error("数据获取失败！"))
        })
      })
    },
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        this.boxLoading = true
        getBrandClassifyList(params).then(({data}) => {
          resolve({
            records: data.data.data.records,
            page: {
              total: data.data.data.total
            }
          })
        }, error => {
          reject(error)
        }).finally(() => {
          this.boxLoading = false
        })
      })
    },
    toCreate () {
      this.formData = {
        brandClassificationName: '',
        brandClassificationBg: '',
        relations: [],
      };
      this.publish = true;
      this.publishType = "add";
    },
    toUpdate ({brandClassificationId}) {
      getBrandClassifyDetail({
        brandClassificationId
      }).then(({data}) => {
        let brandDetail = data.data.data
        let relationsTemp = brandDetail.relations || []
        let relations = []
        for (let i = 0; i < relationsTemp.length; i++) {
          relations.push({
            brandId: relationsTemp[i].brandId,
            sortNumber: relationsTemp[i].sort,
            brandName: relationsTemp[i].brandName
          })
        }
        this.formData = {
          ...brandDetail,
          relations
        }
        this.publish = true;
        this.publishType = "edit";
      })
    },
    handleSave() {
      this.formLoading = true
      this.$refs.form.validate(validate => {
        if (validate) {
          let relations = []
          let relationsTemp = this.formData.relations || []
          for (let i = 0; i < relationsTemp.length; i++) {
            relations.push({
              brandId: relationsTemp[i].brandId,
              sort: relationsTemp[i].sortNumber
            })
          }
          let formData = {...this.formData, relations}
          if (this.publishType == 'edit') {
            updateBrandClassify(formData).then(({data}) => {
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
            addBrandClassify(formData).then(({data}) => {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              this.publish = false
              this.$refs.hcCrud.refresh({currentPage: 1})
            }).finally(() => {
              this.formLoading = false
            })
          }
        } else {
          this.formLoading = false
        }
      })
    },
    brandView(brandClassificationId) {
      getBrandClassifyDetail({
        brandClassificationId
      }).then(({data}) => {
        let brandDetail = data.data.data
        let relationsTemp = brandDetail.relations || []
        let relations = []
        for (let i = 0; i < relationsTemp.length; i++) {
          relations.push({
            brandId: relationsTemp[i].brandId,
            brandLogo: relationsTemp[i].brandLogo,
            brandName: relationsTemp[i].brandName
          })
        }
        this.relations = relations
        this.brandViewDialogVisible = true;
      })
    },
    handleDel (brandClassificationId) {
      this.$confirm("是否确认删除该品牌分类?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        deleteBrandClassify({brandClassificationIds: [brandClassificationId]}).then(({data}) => {
          if (data.code === 0) {
            this.$message.success('删除成功')
            this.$refs.hcCrud.refresh()
          }
        })
      })
      .catch(function () {});
    },
    toAddBrand () {
      this.formData.relations.push({
        brandId: '',
        sortNumber: '',
        brandName: '',
      })
    },
    toDeleteBrand (row) {
      console.log(row)
      console.log(this.formData.relations)
      // return
      this.$confirm("是否确认删除该品牌?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        this.formData.relations.splice(row.$index, 1)
      }).catch(function () {});
    },
    dialogBeforeClose (next) {
      next()
    },
  }
}
</script>

<style lang="scss" scoped>
.classify-box {
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

.pagination-box {
  padding: 10px 20px;
  margin: 15px 0 10px;
  text-align: right;
}

.form-title {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  .form-title-name {
    height: 60px;
    line-height: 60px;
    font-size: 20px;
  }
}

.brand-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  .brand-list-item {
    margin: 20px 20px 0 0;
    padding: 20px;
    height: 150px;
    width: 150px;
    text-align: center;
    border: 1px solid #D9D9D9;
    background-color: #FDFBF9;
    .brand-list-item-logo {
      margin: 0 auto;
      height: 80px;
      width: 80px;
      border-radius: 40px;
    }
    .brand-list-item-name {
      margin-top: 20px;
      line-height: 30px;
      text-align: center;
    }
  }
}
</style>
