<template>
  <basic-container>
    <hc-table-form
      title="城市模块配置"
      :formVisible="setModule"
      @go-back="setModule = false">
      <hc-crud ref="hcCrud" :option="{search: true}" :fetchListFun="fetchListFun">
        <template v-slot:search>
          <el-form class="search-box" inline :model="tempSearch">
            <div class="serach-box-left">
              <el-form-item label="城市搜索：">
                <el-input v-model="tempSearch.cityName" placeholder="请输入城市名称" clearable=""></el-input>
              </el-form-item>
              <el-form-item>
              <el-button
                class="search-item"
                type="primary"
                icon="el-icon-search"
                @click="toSearch"
                >搜 索</el-button
              >
              <el-button
                class="search-item"
                icon="el-icon-refresh"
                @click="resetSearch"
                >重 置</el-button
              >
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
          </el-form>
        </template>
        <template v-slot:table="scope">
          <hc-table-data-box :empty="!scope.tableData || scope.tableData.length == 0" :loading="boxLoading">
            <div class="city-box">
              <div v-for="city in scope.tableData" :key="city.cityId" class="city-item">
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
          </hc-table-data-box>
        </template>
      </hc-crud>
    
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
      tempSearch: {},
      formData: {},
      formType: 'add',
      formDialogVisible: false,
      cityList: [],
      allCity: [],
      cityViewDialogVisible: false,
      cityStatus: 'all',
      setModule: false,
      handleCityId: '',
      boxLoading: false,
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
          this.$refs.hcCrud.refresh({currentPage: 1}, {state: undefined, isOpening: undefined})
          break
        case '1':
          this.$refs.hcCrud.refresh({currentPage: 1}, {state: '0', isOpening: true})
          break
        case '2':
          this.$refs.hcCrud.refresh({currentPage: 1}, {state: '9', isOpening: true})
          break
        case '3':
          this.$refs.hcCrud.refresh({currentPage: 1}, {state: undefined, isOpening: false})
          break
        default:
          this.$refs.hcCrud.refresh({currentPage: 1}, {state: undefined, isOpening: undefined})
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    fetchListFun (params) {
      this.boxLoading = true
      return new Promise((resolve, reject) => {
        adminCityOpenList(params).then(({data}) => {
          if (data.code === 0) {
            resolve({
              records: data.data.data.records,
              page: {
                total: data.data.data.total
              }
            })
          }
        }, (error) => {
          reject(error)
        }).finally(() => {
          this.boxLoading = false
        })
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
      this.$refs.hcCrud.refresh({currentPage: 1}, this.tempSearch)
    },
    resetSearch () {
      this.tempSearch = {
        cityName: undefined,
      }
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
</style>
