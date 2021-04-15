<template>
  <basic-container class="container">
    <hc-table-form
      :title="title"
      :formVisible="formShow"
      @go-back="formShow = false">
      <el-tabs v-model="couponStatus">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="上架中" name="1"></el-tab-pane>
        <el-tab-pane label="待上架" name="0"></el-tab-pane>
        <el-tab-pane label="已售罄" name="2"></el-tab-pane>
        <el-tab-pane label="已下架" name="3"></el-tab-pane>
        <el-tab-pane label="仓库中" name="4"></el-tab-pane>
      </el-tabs>
      <hc-crud ref="hcCrud" :fetchListFun="fetchListFun" :option="tableOption">
        <template slot="menuLeft">
          <el-button
            class="filter-item"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="toCreate"
            >新增券</el-button>
        </template>
        <template v-slot:scopeOfUseCity="scope">
          <el-button type="text" size="mini" @click="cityView(scope.row)">查看</el-button>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-button type="text" size="mini" @click="toView(scope.row)">查看</el-button>
          <template v-if="scope.row.status == 0 && scope.row.releaseCity == userInfo.manageCityId">
            <el-button type="text" size="mini" @click="toUpdate(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" @click="toDelete(scope.row)">删除</el-button>
          </template>
          <template v-if="scope.row.status == 1">
            <el-button type="text" size="mini" @click="toShelfOff(scope.row)">下架</el-button>
          </template>
          <template v-if="scope.row.status == 2 && scope.row.releaseCity == userInfo.manageCityId">
            <el-button type="text" size="mini" @click="toUpdate(scope.row)">编辑</el-button>
          </template>
          <template v-if="scope.row.status == 3 && scope.row.releaseCity == userInfo.manageCityId">
            <el-button type="text" size="mini" @click="toUpdate(scope.row)">编辑</el-button>
          </template>
          <template v-if="scope.row.status == 4 && scope.row.releaseCity == userInfo.manageCityId">
            <el-button type="text" size="mini" @click="toUpdate(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" @click="toDelete(scope.row)">删除</el-button>
          </template>
        </template>
      </hc-crud>
      <template slot="form">
        <coupons-form v-if="formType == 'add' || formType == 'edit'" ref="form" is-platform @save="handleSave"></coupons-form>
        <coupons-detail v-if="formType == 'view'" :detail="couponsDetail"></coupons-detail>
      </template>
    </hc-table-form>
    <hc-city-box ref="hcCityBox"></hc-city-box>
  </basic-container>
</template>

<script>
import { tableOption } from "./const";
import { mapGetters } from "vuex";
import { getPlatformCouponsPage, getCityCouponsPage, createCoupons, getCouponsDetail, updateCoupons, deleteCouponsBatch, couponsDown } from "@/api/merchantSystem/coupons"
import HcImageUpload from "@/views/components/HcImageUpload/index";
import HcTableForm from "@/views/components/HcTableForm/index";
import HcInput from "@/views/components/HcForm/HcInput/index"
import CouponsDetail from "@/views/components/BusinessComponents/CouponsDetail/index"
import CouponsForm from "@/views/components/BusinessComponents/CouponsForm/index"
import HcCityBox from '@/views/components/HcCity/HcCityBox/index'
export default {
  components: { HcImageUpload, HcTableForm, HcInput, CouponsDetail, CouponsForm, HcCityBox },
  data() {
    return {
      couponStatus: 'all',
      formShow: false,
      formType: "",
      couponsDetail: {}
    };
  },
  computed: {
    ...mapGetters(["permissions", "userInfo", "dicList", "userType"]),
    tableOption() {
      return tableOption(this.userType == 1 || this.userType == 2);
    },
    getCouponsPage () {
      if (this.userType == 1) {
        return getPlatformCouponsPage
      } else if (this.userType == 2 || this.userType == 3) {
        return getCityCouponsPage
      }
    },
    title () {
      if (!this.formShow) {
        return '平台券'
      } else {
        if (this.formType == 'add') {
          return '平台券-新增'
        } else if (this.formType == 'edit') {
          return '平台券-编辑'
        } else if (this.formType == 'view') {
          return '平台券-详情'
        } else {
          return ''
        }
      }
    }
  },
  watch: {
    couponStatus (val) {
      let status = val != 'all' ? val : undefined
      let params = {
        status
      }
      if (status == '0') {
        params.isDepository = '0'
      } else if (status == '4') {
        params = {
          status: '0',
          isDepository: '1'
        }
      } else {
        params.isDepository = undefined
      }
      this.$refs.hcCrud.refresh({}, params)
    }
  },
  methods: {
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        this.getCouponsPage({
          ...params,
          type: '1',
        }).then(({ data }) => {
          resolve({
            records: data.data.data.records,
            page: {
              total: data.data.data.total
            }
          })
        }, error => {
          reject(error)
        })
      })
    },
    toCreate() {
      this.formShow = true;
      this.formType = "add";
      this.$nextTick(() => {
        this.$refs.form.open()
      })
    },
    handleSave(formData) {
      formData.type = '1'
      if (this.formType == 'add') {
        createCoupons(formData).then(({ data }) => {
          this.formShow = false
          this.$message.success('新增成功')
          this.$refs.hcCrud.refresh()
        })
      } else if (this.formType == 'edit') {
        updateCoupons(formData).then(({ data }) => {
          this.formShow = false
          this.$message.success('修改成功')
          this.$refs.hcCrud.refresh()
        })
      }
    },
    toView ({id}) {
      getCouponsDetail(id).then(({ data }) => {
        let couponsDetail = data.data.data
        this.couponsDetail = couponsDetail
        this.formType = 'view'
        this.formShow = true
      });
    },
    toUpdate({ id }) {
      getCouponsDetail(id).then(({ data }) => {
        let formData = data.data.data
        let initForm = {
          id: formData.id,
          availableEndTime: formData.availableEndTime,
          availableStartTime: formData.availableStartTime,
          conditionPrice: formData.conditionPrice,
          deductionPrice: formData.deductionPrice,
          downTime: formData.downTime,
          instructions: formData.instructions,
          isPermanent: formData.isPermanent,
          limitNum: formData.limitNum,
          isCopyLogo: false,
          logo: formData.logo,
          name: formData.name,
          supply: formData.supply,
          surplus: formData.surplus,
          upTime: formData.upTime,
          updateTime: formData.updateTime,
          scopeOfUseCity: formData.scopeOfUseCity || '',
          status: formData.status,
          category: formData.category,
        }
        this.formShow = true;
        this.formType = "edit";
        this.$nextTick(() => {
          this.$refs.form.open(initForm)
        })
      });
    },
    toDelete({ id }) {
      this.$confirm("是否确认删除该优惠券?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteCouponsBatch([id]).then(({ data }) => {
          this.formShow = false;
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000,
          });
          this.$refs.hcCrud.refresh()
        });
      }).catch(function () {});
    },
    toShelfOff ({ id }) {
      this.$confirm("是否确认下架该优惠券?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        couponsDown(id).then(({ data }) => {
          this.$notify({
            title: "成功",
            message: "下架成功",
            type: "success",
            duration: 2000,
          });
          this.$refs.hcCrud.refresh()
        });
      }).catch(function () {});
    },
    cityView({scopeOfUseCity}) {
      let cityIds = scopeOfUseCity ? scopeOfUseCity.split(",") : []
      for (let i = 0; i < cityIds.length; i++) {
        cityIds[i] = parseInt(cityIds[i])
      }
      this.$refs.hcCityBox.open(this.userInfo.manageCityId, cityIds, true)
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  /deep/.el-input-number__increase {
    right: 1px !important;
    border-left: 1px solid #dcdfe6 !important;
  }
  .form-title {
    padding: 0 20px;
    height: 40px;
  }
}

</style>

