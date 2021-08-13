<template>
  <basic-container>
    <hc-table-form
      :formVisible="viewDetail"
      :title="title"
      @go-back="viewDetail = false">
      <hc-crud ref="hcCrud" :fetchListFun="fetchListFun" :option="tableOption">
        <template v-slot:nameSearchItem="scope">
          <el-input v-model="scope.searchForm.name" placeholder="请输入职位名称" clearable></el-input>
        </template>
        <template v-slot:cityIdSearchItem="scope">
          <hc-city-select v-model="scope.searchForm.cityId" :city-id="userInfo.manageCityId" single></hc-city-select>
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
          <el-button v-if="scope.row.certificationStatus == 0" type="text" size="mini" @click="toAudit(scope.row)">去审核</el-button>
          <el-button v-if="scope.row.certificationStatus != 0" type="text" size="mini" @click="toAudit(scope.row)">查看资质</el-button>
          <el-button v-if="scope.row.certificationStatus == 1" type="text" size="mini" @click="toView(scope.row)">公司主页</el-button>
        </template>
      </hc-crud>
      <template v-slot:form>
        <audit-detail v-if="formType == 'audit'" :details="auditDetail" @refresh="refresh"></audit-detail>
        <company-detail v-if="formType == 'company'" :detail="companyDetail"></company-detail>
      </template>
    </hc-table-form>
  </basic-container>
</template>

<script>
import { getPositionDetail, offShelf, audit } from "@/api/recruit/position"
import { getCompanyPage, getAuditDetail, getCompanyDetail } from "@/api/recruit/company"
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index"
import AuditDetail from "./AuditDetail"
import CompanyDetail from "./CompanyDetail"
import { mapGetters } from "vuex"
export default {
  components: { AuditDetail, CompanyDetail, HcCitySelect },
  data () {
    return {
      tableOption: {
        index: false,
        search: true,
        labelWidth: '100px',
        columns: [
          {
            label: '公司ID',
            prop: 'id',
            width: 100,
          },
          {
            label: '公司名称',
            prop: 'companyName',
            maxlength: 50,
            search: true,
          },
          {
            label: '提交人',
            prop: 'createByName',
          },
          {
            label: '提交时间',
            prop: 'createTime',
            width: 160,
          },
          {
            label: '职位状态',
            prop: 'certificationStatus',
            width: 100,
            type: 'select',
            dicData: [
              {
                label: '待审核',
                value: 0
              },
              {
                label: '认证成功',
                value: 1
              },
              {
                label: '认证失败',
                value: 2
              }
            ],
            search: true,
          },
        ],
        menu: true,
        menuWidth: 140
      },
      viewDetail: false,
      formType: "",
      auditDetail: {},
      companyDetail: {}
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    title () {
      if (this.viewDetail) {
        if (this.formType == 'audit') {
          return '资质审核'
        } else if (this.formType == 'company') {
          return '公司主页'
        } else {
          return ''
        }
      } else {
        return '资质认证'
      }
    }
  },
  methods: {
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        getCompanyPage({
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
    toAudit ({ id }) {
      getAuditDetail({ companyId: id }).then(({ data}) => {
        this.viewDetail = true
        this.formType = 'audit'
        this.auditDetail = data.data.data
      })
    },
    toView ({ id }) {
      getCompanyDetail({ companyId: id }).then(({data}) => {
        this.viewDetail = true
        this.formType = 'company'
        this.companyDetail = data.data.data
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
