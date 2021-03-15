<template>
  <basic-container>
    <hc-table-form title="广告位管理">
      <hc-crud ref="hcCrud" :fetchListFun="fetchListFun" :addFun="addFun" :updateFun="updateFun" :deleteFun="deleteFun" :option="tableOption">
        <template v-slot:cityIdForm="scope">
          <hc-city-select v-model="scope.formData.cityId" :city-id="userInfo.manageCityId" single></hc-city-select>
        </template>
        <template v-slot:typeForm="scope">
          <el-radio-group v-model="scope.formData.type">
            <el-radio :label="1">文字</el-radio>
            <el-radio :label="2">图片</el-radio>
          </el-radio-group>
        </template>
      </hc-crud>
    </hc-table-form>
  </basic-container>
</template>

<script>
import {
  citys,
  addAdPosition,
  adPosition,
  editPlace,
  delAdP,
} from "@/api/content/ad-position";
import HcEmptyData from "@/views/components/HcEmptyData/index"
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index"
import { tableOption } from './const'
import { mapGetters } from 'vuex'
export default {
  components: { HcEmptyData, HcCitySelect },
  computed: {
    ...mapGetters(['userInfo', 'userType']),
    tableOption () {
      return tableOption(this.userType == 1 || this.userType == 2)
    }
  },
  methods: {
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        adPosition(params).then((res) => {
          resolve({
            records: res.data.data.data.records,
            page: {
              total: res.data.data.data.total
            }
          })
        }, error => reject(error))
      })
    },
    // 广告位新增 提交
    addFun(formData, next, loading) {
      addAdPosition(formData).then((res) => {
        if (res.data.code === 0) {
          next()
        }
      }).finally(() => {
        loading()
      });
    },
    // 广告位编辑 提交编辑
    updateFun(formData, next, loading) {
      editPlace(formData).then((res) => {
        if (res.data.code === 0) {
          this.dialogEditFormVisible = false;
          this.$message({
            message: "编辑广告位成功！",
            type: "success",
          });
          next()
        } else {
          this.$message.error("编辑广告位失败！");
        }
      }).finally(() => {
        loading()
      });
    },
    deleteFun(row) {
      this.$confirm("确定删除广告位?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delAdP(row.adslotId).then((res) => {
            if (res.data.code !== 0) {
              return this.$message.error("广告位删除失败！");
            }
            this.$message({
              message: "广告位删除成功！",
              type: "success",
            });
            this.$refs.hcCrud.refresh()
          });
        })
        .catch(() => {
          this.$message("您已取消删除该广告位！");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
