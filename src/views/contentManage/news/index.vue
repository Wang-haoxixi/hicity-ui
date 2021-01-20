<template>
  <div class="user">
    <basic-container>
      <avue-crud
        v-show="!publish"
        ref="crud"
        :option="tableOption"
        :page="page"
        :table-loading="tableLoading"
        :data="tableData"
        @on-load="getList"
        @refresh-change="handleRefreshChange" >
        <template slot="menuLeft">
          <el-button
            class="filter-item"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="toCreate">添加
          </el-button>
        </template>
        <template slot="tagList" slot-scope="scope">
          <el-button type="text" size="mini" @click="tagView(scope.row.newsId)">查看</el-button>
        </template>
        <template slot="cityList" slot-scope="scope">
          <el-button type="text" size="mini" @click="cityView(scope.row.newsId)">查看</el-button>
        </template>
        <template
          slot="menu"
          slot-scope="scope">
          <el-button
            v-if="!isAdmin && scope.row.closeAllowed == '0'"
            type="text" size="mini"
            @click="handleStart(scope.row)">{{scope.row.havEnable ? '启用' : '停用'}}</el-button>
          <template v-if="isAdmin || !isAdmin && scope.row.source == 2">
            <el-button
              type="text" size="mini"
              @click="toUpdate(scope.row)">编辑</el-button>
            <el-button
              type="text" size="mini"
              @click="toDelete(scope.row)">删除</el-button>
          </template>
        </template>
      </avue-crud>

      <div v-if="publish">
        <div class="form-title">城市新闻-</div>
        <el-form ref="form" class="dialog-main-tree" :model="formData" label-width="180px">
          <el-form-item label="名称：">
            <el-input v-model="formData.title"></el-input>
          </el-form-item>
          <el-form-item label="标签：">
            <el-select style="width: 100%" v-model="formData.lableIdList" multiple filterable placeholder="请选择">
              <el-option
                v-for="tag in tagList"
                :key="tag.tagId"
                :label="tag.name"
                :value="tag.tagId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布城市：">
            <!-- <el-select style="width: 100%" v-model="formData.cityIdList" multiple filterable  placeholder="请选择城市" @change="cityChange">
              <el-option v-for="city in allCity" :key="city.id" :label="city.regionName" :value="city.id"></el-option>
            </el-select> -->
            <hc-city-select v-model="formData.cityIdList"></hc-city-select>
          </el-form-item>
          <el-form-item label="标题图：">
            <el-input v-model="formData.password"></el-input>
          </el-form-item>
          <el-form-item label="详情：">
            <!-- <el-input type="textarea" v-model="quillContent.content"></el-input>
            <el-input type="textarea" v-model="quillContent.structuredContent"></el-input> -->
            <hc-quill v-model="quillContent"></hc-quill>
          </el-form-item>
          <el-form-item v-if="isAdmin" label="是否允许城市停用：">
            <el-switch v-model="formData.closeAllowed" active-value="0" active-text="允许" inactive-text="不允许" inactive-value="1"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button @click="preview">预览</el-button>
            <el-button @click="handleDraft">保存草稿</el-button>
            <el-button @click="handleCreate">直接发布</el-button>
          </el-form-item>
        </el-form>
      </div>
    </basic-container>

    <el-dialog
      title="展示城市"
      :visible.sync="cityViewDialogVisible"
      width="70%">
      <hc-city-box view-only :init-city-list="initCityList" :all-city-list="allCityList"></hc-city-box>
      <div slot="footer">
        <el-button @click="cityViewDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    

  </div>

</template>

<script>
import { tableOption } from './const'
import { mapGetters } from 'vuex'
import { getNewsList, addNews, getNewsDetail, updateNews, newsOpenList } from '@/api/cms/news'
import { getAllTagList } from '@/api/tms/city'
import { adminCityList } from '@/api/admin/city'
import HcQuill from '@/views/components/HcQuill'
import HcCityBox from '@/views/components/HcCityBox/index'
import HcCitySelect from '@/views/components/HcCitySelect/index'

export default {
  name: 'SysUser',
  components: { HcQuill, HcCityBox, HcCitySelect },
  data() {
    return {
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false// 是否倒序
      },
      tableLoading: false,
      tableData: [],
      formData: {},
      tagList: [],
      allCity: [],
      publish: false,
      publishType: '',
      cityList: [],
      allCityList: [],
      initCityList: [],
      cityViewDialogVisible: false,
      quillContent: {
        content: '',
        structuredContent: ''
      },
      cityChooseDialogVisible: false,
    }
  },
  computed: {
    ...mapGetters(['permissions', 'userInfo']),
    tableOption() {
      return tableOption(this.isAdmin)
    },
    isAdmin () {
      return this.userInfo.userType == 3 || this.userInfo.userType == 4
    },
  },
  watch: {
  },
  created() {
    this.init()
    console.log(this.userInfo)
  },
  methods: {
    // cityChange (data) {
    //   if (data[data.length - 1] == 1) {
    //     console.log(123)
    //     this.formData.cityIdList = [1]
    //   } else if (data.includes(1)) {
    //     this.formData.cityIdList.splice(data.indexOf(1), 1)
    //   }
    //   console.log(data)
    // },
    init () {
      getAllTagList({cityId: this.userInfo.manageCityId}).then(({data}) => {
        this.tagList = data.data.data
      })
      adminCityList().then(({data}) => {
        this.allCity = data.data.data
        this.allCity.unshift({
          id: 1,
          regionName: '全国'
        })
      })
    },
    getList(page = this.page, params) {
      this.tableLoading = true
      getNewsList({
        current: page.currentPage,
        size: page.pageSize,
      }).then(({data}) => {
        console.log(data)
        this.tableData = data.data.data.records
        this.page.total = data.data.data.total
      }).finally(() => {
        this.tableLoading = false
      })
    },
    toCreate () {
      this.formData = {
        cityIdList: [1]
      }
      this.publish = true
      this.publishType = 'add'
    },
    handleCreate() {
      console.log(this.quillContent)
      let formData = this.formData
      formData.content = this.quillContent.content
      formData.structuredContent = this.quillContent.structuredContent
      if (this.publishType == 'add') {
        addNews({...formData, state: 1}).then(({data}) => {
          this.publish = false
          this.$notify({
            title: '成功',
            message: '发布成功',
            type: 'success',
            duration: 2000
          })
        })
      } else {
        updateNews({...formData, state: 1}).then(({data}) => {
          this.publish = false
          this.$notify({
            title: '成功',
            message: '发布成功',
            type: 'success',
            duration: 2000
          })
        })
      }
    },
    toUpdate ({newsId}) {
      getNewsDetail({newsId}).then(({data}) => {
        console.log(data)
        this.formData = data.data.data
        this.quillContent = {
          content: data.data.data.content,
          structuredContent: data.data.data.structuredContent
        }
        this.publish = true
        this.publishType = 'edit'
      })
    },
    handleUpdate () {
      
    },
    handleDraft () {

    },
    preview () {

    },
    handleRefreshChange() {
      this.getList(this.page)
    },
    cityView (newsId) {
      newsOpenList({newsId}).then(({data}) => {
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
  }
}
</script>
<style lang="scss">
  .user {
    height: 100%;

    &__tree {
      padding-top: 3px;
      padding-right: 20px;
    }

    &__main {
      .el-card__body {
        padding-top: 0;
      }
    }
  }
</style>

