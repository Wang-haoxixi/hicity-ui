<template>
  <el-dialog
    title="推荐管理"
    :visible.sync="dialogVisible"
    width="width"
    :before-close="dialogBeforeClose">
    <el-table :data="recommendList">
      <el-table-column label="券名称" prop="name"></el-table-column>
      <el-table-column label="排序" prop="orderNum">
        <template v-slot="scope">
          <el-input-number :min="0" :max="10" v-model="scope.row.orderNum"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template v-slot="scope">
          <el-button type="text" @click="cancelRecommend(scope.$index)">取消推荐</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveRecommend">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getRecommendList, recommendBatch } from "@/api/merchantSystem/coupons"
export default {
  data () {
    return {
      recommendList: [],
      dialogVisible: false,
    }
  },
  methods: {
    open () {
      getRecommendList().then(({data}) => {
        this.recommendList = data.data.data
        this.dialogVisible = true
      })
    },
    cancelRecommend (index) {
      this.recommendList.splice(index, 1)
    },
    saveRecommend () {
      let recommendList = []
      for (let i = 0; i < this.recommendList.length; i++) {
        recommendList.push({
          id: this.recommendList[i].id,
          orderNum: this.recommendList[i].orderNum,
        })
      }
      recommendBatch(recommendList).then(({data}) => {
        if (data.code === 0 && data.data.data) {
          this.$message.success('操作成功')
          this.$emit('refresh')
          this.dialogVisible = false
        } 
      })
    },
    dialogBeforeClose (next) {
      next()
    }
  }
}
</script>

<style lang="" scoped>
</style>
