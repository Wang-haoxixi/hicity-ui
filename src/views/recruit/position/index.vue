<template>
  <basic-container>
    <hc-table-form
      :formVisible="viewDetail"
      :title="title"
      @go-back="viewDetail = false">
      <hc-crud ref="hcCrud" :fetchListFun="fetchListFun" :option="tableOption" :auto-load="false" @reset-search="afterResetSearch">
        <template v-slot:nameSearchItem="scope">
          <el-input v-model="scope.searchForm.name" placeholder="请输入职位名称" clearable></el-input>
        </template>
        <template v-slot:cityIdSearchItem="scope">
          <hc-city-select v-model="scope.searchForm.cityId" :city-id="userInfo.manageCityId" single></hc-city-select>
        </template>
        <template v-slot:companyIdSearchItem="scope">
          <hc-remote-select ref="companySearch" style="width: 100%" v-model="scope.searchForm.companyId" :remote-fun="getAllCompany"></hc-remote-select>
          <!-- <hc-city-select v-model="scope.searchForm.cityId" :city-id="userInfo.manageCityId" single></hc-city-select> -->
        </template>
        <template v-slot:statusFlagSearchItem="scope">
          <el-select v-model="scope.searchForm.statusFlag" style="width: 100%;" clearable>
            <el-option label="招聘中" value="valid">招聘中</el-option>
            <el-option label="已关闭" value="close">已关闭</el-option>
            <el-option label="已下架" value="off_shelf">已下架</el-option>
            <el-option label="待审核" value="wait_audit">待审核</el-option>
          </el-select>
        </template>
        <!-- <template v-slot:searchItem="scope">
          <div class="search-item">
            <el-input v-model="scope.searchForm.name" placeholder="请输入职位名称" clearable></el-input>
            <div style="white-space: nowrap;">职位名称：</div>
          </div>
          <div class="search-item">
            <div style="white-space: nowrap;">工作城市：</div>
            <hc-city-select v-model="scope.searchForm.cityId" :city-id="userInfo.manageCityId" single></hc-city-select>
          </div>
          <div class="search-item">
            <div style="white-space: nowrap;">职位状态：</div>
            <el-select v-model="scope.searchForm.statusFlag" clearable>
              <el-option label="招聘中" value="valid">招聘中</el-option>
              <el-option label="已关闭" value="close">已关闭</el-option>
              <el-option label="已下架" value="off_shelf">已下架</el-option>
              <el-option label="待审核" value="wait_audit">待审核</el-option>
            </el-select>
          </div>
        </template> -->
        <template v-slot:menu="scope">
          <el-button type="text" size="mini" @click="toView(scope.row)">详情</el-button>
          <template v-if="scope.row.status == '3' && scope.row.auditStatus == '1'">
            <el-button type="text" size="mini" @click="audit(scope.row, 'pass')">上架</el-button>
            <el-button type="text" size="mini" @click="audit(scope.row, 'reject')">拒绝</el-button>
          </template>
          <el-button v-if="scope.row.status == '1'" type="text" size="mini" @click="offShelf(scope.row)">下架</el-button>
        </template>
      </hc-crud>
      <position-detail slot="form" :position-detail="positionDetail" @refresh="refresh"></position-detail>
    </hc-table-form>
  </basic-container>
</template>

<script>
import { getPositionList, getPositionDetail, offShelf, audit } from "@/api/recruit/position"
import { getCompanyListByName } from "@/api/recruit/company"
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index"
import PositionDetail from "./PositionDetail"
import HcRemoteSelect from "@/views/components/HcForm/HcRemoteSelect/index"
import { mapGetters } from "vuex"
export default {
  components: { PositionDetail, HcCitySelect, HcRemoteSelect },
  data () {
    return {
      viewDetail: false,
      tableOption: {
        search: true,
        labelWidth: '100px',
        columns: [
          {
            label: '职位ID',
            prop: 'recruitPositionId',
            width: 100,
          },
          {
            label: '职位名称',
            prop: 'name',
            maxlength: 50,
            search: true,
          },
          {
            label: '工作城市',
            prop: 'cityId',
            search: true,
            hidden: true,
          },
          {
            label: '职位状态',
            prop: 'statusFlag',
            width: 100,
            type: 'select',
            dicData: [
              {
                label: '招聘中',
                value: 'valid'
              },
              {
                label: '已关闭',
                value: 'close'
              },
              {
                label: '已下架',
                value: 'off_shelf'
              },
              {
                label: '待审核',
                value: 'wait_audit'
              }
            ],
            search: true,
            hidden: true,
          },
          {
            label: '所属公司',
            prop: 'companyId',
            width: 120,
            formatter: (row) => {
              return row.companyName
            },
            search: true,
          },
          {
            label: '发布人',
            prop: 'createByName',
            width: 120,
          },
          {
            label: '发布时间',
            prop: 'createTime',
            width: 160,
          },
          {
            label: '职位状态',
            prop: 'status',
            width: 100,
            formatter: function (row) {
              if (row.status == '1') {
                return '招聘中'
              } else if (row.status == '2') {
                return '已关闭'
              } else if (row.status == '3') {
                if (row.auditStatus == '1') {
                  return '待审核'
                } else if (row.auditStatus == '3') {
                  return '审核未通过'
                } else if (row.auditStatus === '0') {
                  return '已下架'
                }
              }
              return ''
            },
          },
          {
            label: '工作城市',
            prop: 'city',
            width: 120,
          }
        ],
        menu: true,
        menuWidth: 120
      },
      positionDetail: {}
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'recruitCompanyId']),
    title () {
      if (this.viewDetail) {
        return '职位详情'
      } else {
        return '职位管理'
      }
    }
  },
  mounted () {
    let companyId = this.recruitCompanyId
    setTimeout(() => {
      this.$store.commit('SET_RECRUIT_COMPANY_ID', undefined)
    })
    this.$refs.hcCrud.refresh({}, {
      companyId
    })
  },
  methods: {
    afterResetSearch (type) {
      if (type == 'senior') {
        this.$refs.companySearch.initData()
      }
    },
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        getPositionList({
          cityId: this.userInfo.manageCityId,
          ...params
        }).then(({data}) => {
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
    toView ({recruitPositionId}) {
      getPositionDetail({recruitPositionId}).then(({data}) => {
        this.positionDetail = data.data.data
        this.viewDetail = true
      })
    },
    audit ({recruitPositionId}, sign) {
      let text = sign == 'pass' ? '上架' : '拒绝'
      this.$prompt(`${text}理由：`, text, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: `请输入${text}理由`,
        inputValidator: function (value) {
          if (value && value.length < 51) {
            return true
          } else if (!value) {
            return `${text}理由不能为空`
          } else {
            return `${text}理由不能超过50字`
          }
        },
      }).then(({ value }) => {
        audit({
          recruitPositionId,
          remarks: value,
          sign
        }).then(({ data }) => {
          this.$message.success(`${text}成功`)
          this.$refs.hcCrud.refresh()
        })
      }).catch(() => {
      });
    },
    offShelf ({recruitPositionId}) {
      this.$prompt('下架理由：', '下架', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '请输入下架理由',
        inputValidator: function (value) {
          if (value && value.length < 51) {
            return true
          } else if (!value) {
            return '下架理由不能为空'
          } else {
            return '下架理由不能超过50字'
          }
        },
      }).then(({ value }) => {
        offShelf({
          recruitPositionId,
          remarks: value
        }).then(({ data }) => {
          this.$message.success('下架成功')
          this.$refs.hcCrud.refresh()
        })
      }).catch(() => {
      });
    },
    refresh () {
      this.viewDetail = false
      this.$refs.hcCrud.refresh()
    },
    getAllCompany (companyName) {
      return new Promise((resolve, reject) => {
        getCompanyListByName({companyName}).then(({data}) => {
          let companyListTemp = data.data.data
          let companyList = []
          for (let i = 0; i < companyListTemp.length; i++) {
            companyList.push({
              label: companyListTemp[i].companyName,
              value: companyListTemp[i].id
            })
          }
          resolve(companyList)
        }, () => {
          reject(new Error("数据获取失败！"))
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.search-item {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin: 10px 20px 0 0;
}
</style>
