<template>
  <div>
    <div class="mod-list-item">
      <div class="mod-list-item-title">城市首页基础配置一</div>
      <div class="mod-box">
        <div v-for="mod in moduleFirst" :key="mod.modId" class="mod-item">
          <div class="mod-item-info">
            <div class="mod-item-name">{{mod.name}}</div>
          </div>
          <div class="mod-item-option">
            <el-button type="text" size="mini" @click="moduleView(mod)">查看配置</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="mod-list-item">
      <div class="mod-list-item-title">城市首页基础配置二</div>
      <div class="mod-box">
        <div v-for="mod in moduleSecond" :key="mod.modId" class="mod-item">
          <div class="mod-item-info">
            <div class="mod-item-name">{{mod.name}}</div>
          </div>
          <div class="mod-item-option">
            <el-button type="text" size="mini" @click="moduleView(mod)">查看配置</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="mod-list-item">
      <div class="mod-list-item-title">生活频道配置</div>
      <div class="mod-box">
        <div v-for="mod in moduleLife" :key="mod.modId" class="mod-item">
          <div class="mod-item-info">
            <div class="mod-item-name">{{mod.name}}</div>
          </div>
          <div class="mod-item-option">
            <el-button type="text" size="mini" @click="moduleView(mod)">查看配置</el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="模块配置"
      :visible.sync="dialogVisible"
      width="">
      <div class="mod-detail">
        <div class="mod-icon">
          <el-image class="mod-icon-image" :src="modDetail.icon"></el-image>
        </div>
        <div class="mod-info">
          <div class="mod-info-item">
            <div class="mod-info-item-label">模块名称：</div>
            <div class="mod-info-item-content">{{modDetail.name}}</div>
          </div>
          <div class="mod-info-item">
            <div class="mod-info-item-label">跳转编码：</div>
            <div class="mod-info-item-content">{{modDetail.path}}</div>
          </div>
          <div class="mod-info-item">
            <div class="mod-info-item-label">当前状态：</div>
            <div class="mod-info-item-content">{{modDetail.isOpening ? '已配置' : '已关闭'}}</div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { adminCityModule } from '@/api/admin/city'
import { mapGetters } from 'vuex'
export default {
  props: {
    cityId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      formDialogVisible: false,
      moduleFirst: [],
      moduleSecond: [],
      moduleLife: [],
      dialogVisible: false,
      modDetail: {},
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      const loading = this.$loading({
        target: '.mod-box',
      });
      adminCityModule({
        cityId: this.cityId,
      }).then(({data}) => {
        let modules = data.data.data
        for (let i = 0; i < modules.length; i++) {
          if (modules[i].location == 0) {
            this.moduleFirst.push(modules[i])
          } else if (modules[i].location == 1) {
            this.moduleSecond.push(modules[i])
          } else if (modules[i].location == 2) {
            this.moduleLife.push(modules[i])
          }
        }
      }).finally(() => {
        loading.close()
      })
    },
    moduleView (data) {
      console.log(data)
      this.modDetail = data
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.mod-list-item {
  margin-top: 24px;
  padding: 24px;
  border: 1px solid #D9D9D9;
  border-radius: 2px;
  .mod-list-item-title {
    height: 20px;
    line-height: 20px;
    color: #333333;
    font-size: 14px;
  }
}

.mod-box {
  margin-top: 29px;
  padding-bottom: 7px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 114px);
  grid-template-rows: repeat(auto-fill, 96px);
  grid-gap: 16px;
  .mod-item {
    .mod-item-info {
      height: 58px;
      width: 112px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #D9D9D9;
      background-color: #F9F9F9;
      .mod-item-name {
        height: 20px;
        line-height: 20px;
      }
    }
    .mod-item-option {
      margin-top: 16px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      .mune-item {
        font-size: 14px;
      }
    }
  }
}
.pagination-box {
  padding: 10px 20px;
  margin: 15px 0 10px;
  text-align: right;
}
/deep/.mod-item-option .el-button {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 0;
  height: 20px;
}

.mod-detail {
  display: flex;
  justify-self: start;
  align-items: center;
  height: 150px;
  .mod-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 150px;
    width: 150px;
    flex: 150px 0 0;
    background-color: #F9F9F9;
    .mod-icon-image {
      height: 120px;
      width: 120px;
    }
  }
  .mod-info {
    flex: 150px 1 1;
    height: 150px;
    margin-left: 24px;
    .mod-info-item {
      position: relative;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      color: #666666;
      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        border-bottom: 1px solid #D9D9D9;
      }
      .mod-info-item-label {
        height: 50px;
        line-height: 50px;
        flex: 70px 0 0;
      }
      .mod-info-item-content {
        height: 50px;
        line-height: 50px;
        flex: 70px 1 1;
        margin-left: 8px;
      }
    }
  }
}
</style>
