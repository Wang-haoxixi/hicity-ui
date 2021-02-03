<template>
  <basic-container>
    <hc-table-form
      title="城市模块配置"
      :formVisible="setModule"
      @go-back="setModule = false">
      <template>
        <el-form inline :model="tempSearch">
          <div class="search-box">
            <div class="serach-box-left">
              <el-form-item label="城市搜索：">
                <el-select v-model="tempSearch.cityId" placeholder="请选择城市" clearable="">
                  <el-option v-for="city in allCity" :key="city.id" :label="city.regionName" :value="city.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="toSearch()">查询</el-button>
              </el-form-item>
            </div>
            <div class="serach-box-right">
              <el-form-item>
                <el-radio-group v-model="cityStatus" style="margin-bottom: 30px;">
                  <el-radio-button plain label="all">全部</el-radio-button>
                  <el-radio-button plain label="1">已开通</el-radio-button>
                  <el-radio-button plain label="2">已锁定</el-radio-button>
                  <el-radio-button plain label="3">未开通</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
          
        </el-form>
        <div class="city-box">
          <div v-for="city in cityList" :key="city.cityId" class="city-item">
            <div class="city-item-info">
              <div class="city-item-name">{{city.cityName}}</div>
            </div>
            <div class="city-item-option">
              <city-state :state="city.state || ''" :is-opening="city.isOpening"></city-state>
              <div class="city-item-option-right">
                <template v-if="isAdmin || !city.isPlatform">
                  <el-button type="text" size="mini" @click="handleModule(city)">配置</el-button>
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
      </template>

      <template slot="form">
        <module-list module-list :city-id="handleCityId"></module-list>

      </template>
    </hc-table-form>
  </basic-container>
  
</template>

<script>
import { adminCityList, adminCityOpenList } from '@/api/admin/city'
import { mapGetters } from 'vuex'
import CityState from '../CityState.vue'
import ModuleList from './moduleList/index'
import HcTableForm from "@/views/components/HcTableForm/index";
export default {
  components: { CityState, ModuleList, HcTableForm },
  data () {
    return {
      tempSearch: {
        name: ''
      },
      searchForm: {},
      formData: {},
      formType: 'add',
      formDialogVisible: false,
      cityList: [],
      page: {
        currentPage: 1,
        pageSize: 20,
        total: 0,
      },
      allCity: [],
      cityViewDialogVisible: false,
      cityStatus: 'all',
      setModule: false
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    isAdmin () {
      return this.userInfo.userType == 3 || this.userInfo.userType == 4
    },
  },
  watch: {
    cityStatus (val) {
      switch (val) {
        case 'all':
          delete this.searchForm.isOpening
          delete this.searchForm.state
          this.getList()
          break
        case '1':
          this.searchForm.isOpening = true
          this.searchForm.state = '0'
          this.getList()
          break
        case '2':
          this.searchForm.isOpening = true
          this.searchForm.state = '9'
          this.getList()
          break
        case '3':
          this.searchForm.isOpening = false
          delete this.searchForm.state
          this.getList()
          break
        default:
          delete this.searchForm.isOpening
          delete this.searchForm.state
          this.getList()
      }
    }
  },
  created () {
    this.init()
  },
  mounted () {
    this.getList()
  },
  destroyed () {
    console.log('destroyed')
  },
  methods: {
    getList (page = this.page, form = this.searchForm) {
      const loading = this.$loading({
        target: '.city-box',
      });
      adminCityOpenList({
        current: page.currentPage,
        size: page.pageSize,
        ...form,
      }).then(({data}) => {
        if (data.code === 0) {
          this.cityList = data.data.data.records
          this.page = {
            ...page,
            total: data.data.data.total
          }
        }
      }).finally(() => {
        loading.close()
      })
    },
    init () {
      adminCityList().then(({data}) => {
        this.allCity = data.data.data
      })
    },
    handleModule (row) {
      this.handleCityId = row.cityId
      this.setModule = true
    },
    toSearch () {
      this.searchForm = {
        ...this.searchForm,
        ...this.tempSearch
      }
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
.search-box {
  display: flex;
  justify-content: space-between;
}
.city-box {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 250px);
  grid-template-rows: repeat(auto-fill, 90px);
  grid-gap: 24px;
  .city-item {
    border-radius: 2px;
    border: 1px solid #E9E9E9;
    padding: 16px 13px;
    .city-item-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 22px;
      .city-item-name {
        height: 22px;
        line-height: 22px;
        flex: 1 1 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .city-item-sort {
        flex: 50px 0 0;
        height: 22px;
        line-height: 22px;
        text-align: right;
      }
    }
    .city-item-option {
      margin-top: 16px;
      height: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .mune-item {
        font-size: 14px;
        
      }
      .city-item-option-left {
      }
      .city-item-option-right {

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
