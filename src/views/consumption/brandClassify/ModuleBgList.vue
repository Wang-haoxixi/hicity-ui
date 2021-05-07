<template>
  <div class="module-bg-container">
    <div class="module-bg-box">
      <div v-if="value" class="module-bg-img">
        <div class="bg-img-mantle">
          <i class="el-icon-refresh" @click="toSelectModule"></i>
        </div>
        <el-image :src="value"></el-image>
      </div>
      <div v-else class="module-bg-empty" @click="toSelectModule">
        <i class="el-icon-plus"></i>
      </div>
    </div>
    <el-dialog
      title="模板选择"
      :visible.sync="dialogVisible"
      append-to-body
      width="70%"
      :before-close="dialogBeforeClose">
      <div class="module-list-outter">
        <div class="module-list-box">
          <div v-for="item in moduleList" :key="item.brandClassificationBgId" class="module-list-item" @click="handleSelectModule(item)">
            <el-image :src="item.brandClassificationBgUrl"></el-image>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBrandClassifyBgList } from '@/api/mms/brandClassify'
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      moduleList: [],
      dialogVisible: false
    }
  },
  created () {
    getBrandClassifyBgList().then(({data}) => {
      this.moduleList = data.data.data
      console.log(data.data.data)
    })
  },
  methods: {
    toSelectModule () {
      this.dialogVisible = true
    },
    handleSelectModule (moduleBg) {
      this.$emit('input', moduleBg.brandClassificationBgUrl)
      this.dialogVisible = false
    },
    dialogBeforeClose (next) {
      next()
    }
  }
}
</script>

<style lang="scss" scoped>
.module-bg-box {
  position: relative;
  height: 148px;
  width: 148px;
  border-radius: 6px;
  overflow: hidden;
  .module-bg-img {
    position: absolute;
    height: 148px;
    width: 148px;
    display: flex;
    justify-content: center;
    align-items: center;
    .bg-img-mantle {
      display: none;
      position: absolute;
      height: 100%;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1;
      justify-content: center;
      align-items: center;
      i {
        color: #ffffff;
        font-size: 28px;
        cursor: pointer;
      }
    }
    &:hover {
      .bg-img-mantle {
        display: flex;
      }
    }
  }
  .module-bg-empty {
    position: absolute;
    height: 148px;
    width: 148px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    i {
      color: #8c939d;
      font-size: 28px;
    }
    &::after {
      content: '';
      position: absolute;
      display: block;
      height: 146px;
      width: 146px;
      border-radius: 6px;
      border: 1px dashed #c0ccda;
    }
    &:hover {
      &::after {
        content: '';
        border: 1px dashed #409eff;
      }
    }
  }
}

.module-list-outter {
  max-height: 500px;
  overflow: auto;
}
.module-list-box {
  padding: 0 20px;
  .module-list-item {
    &:not(:first-child) {
      margin-top: 20px;
    }
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
