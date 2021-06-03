<template>
  <basic-container class="container">
    <hc-table-form
      :formVisible="formShow"
      :title="title"
      @go-back="goBack">
      <hc-crud ref="hcCrud" :fetchListFun="fetchListFun" :option="tableOption">
        <template v-slot:scopeOfUseCity="scope">
          <el-button type="text" size="mini" @click="cityView(scope.row)">查看</el-button>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-button type="text" size="mini" @click="toView(scope.row)">查看</el-button>
          <el-button type="text" size="mini" @click="toPriority(scope.row)">设置优先级</el-button>
          <el-button v-if="scope.row.isChoice == '1'" type="text" size="mini" @click="toRecommend(scope.row, '0')">取消精选推荐位</el-button>
          <el-button v-else type="text" size="mini" @click="toRecommend(scope.row, '1')">设为精选推荐位</el-button>
        </template>
      </hc-crud>
      <template slot="form">
        <coupons-detail :detail="couponsDetail"></coupons-detail>
      </template>
    </hc-table-form>
  </basic-container>
</template>

<script>
import { tableOption } from "./const";
import { mapGetters } from "vuex";
import { getRecommendPage, getCouponsDetail, setPriority, setRecommend } from "@/api/merchantSystem/coupons"
import CouponsDetail from "@/views/components/BusinessComponents/CouponsDetail/index"
export default {
  components: { CouponsDetail },
  data() {
    return {
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
    title () {
      if (!this.formShow) {
        return '推荐管理'
      } else {
        return '券详情'
      }
    }
  },
  methods: {
    fetchListFun (params) {
      if (params.type == '2') {
        params.type = '0'
        params.deductionType = '1'
      } else if (params.type == '0') {
        params.deductionType = '-1'
      }
      return new Promise((resolve, reject) => {
        getRecommendPage({
          ...params,
          status: '4',
          // type: '1',
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
    toView ({couponsId}) {
      getCouponsDetail(couponsId).then(({ data }) => {
        let couponsDetail = data.data.data
        this.couponsDetail = couponsDetail
        this.formShow = true
      });
    },
    toPriority ({couponsId}) {
      this.$prompt('1~100的整数', '请输入优先级', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'number',
        inputValidator: (val) => {
          return val.length < 3 && /^[1-9]+0*$/.test(val) && parseInt(val) < 100
        },
        inputErrorMessage: '请输入1~100的整数'
      }).then(({ value }) => {
        if (value) {
          setPriority({
            couponsId,
            orderNum: parseInt(value),
          }).then(({data}) => {
            if (data.code === 0) {
              this.$message.success('操作成功')
              this.$refs.hcCrud.refresh()
            }
          })
        }
      })
    },
    toRecommend ({couponsId}, isChoice) {
      let tip = isChoice == '1' ? '是否确认将该券设为精选推荐位展示？' : '是否确认将该券取消精选推荐位展示？'
      this.$confirm(tip, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        setRecommend({
          couponsId,
          isChoice
        }).then(({data}) => {
          if (data.code === 0) {
            this.$message.success('操作成功')
            this.$refs.hcCrud.refresh()
          }
        }).catch(function() {
        })
      });
    },
    goBack () {
      this.formShow = false
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

