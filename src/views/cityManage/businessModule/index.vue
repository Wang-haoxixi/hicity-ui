<template>
  <basic-container>
    <div class="mod-list-item">
      <div class="mod-list-item-title">
        <span>城市首页基础配置一</span>
        <el-button type="primary" size="mini" @click="toAddModule('TOP', 0)">添加</el-button>
      </div>
      <div class="mod-box">
        <div v-for="mod in moduleFirst" :key="mod.modId" class="mod-item">
          <div class="mod-item-info">
            <el-button v-if="mod.isOpening" type="text" @click="toSort(mod)">No.{{mod.sort}}</el-button>
            <div class="mod-item-name">{{mod.name}}</div>
          </div>
          <div class="mod-item-option">
            <el-button type="text" size="mini" @click="moduleView(mod, 'TOP')">{{mod.editable && mod.cityId == userInfo.manageCityId ? '配置修改' : '配置详情'}}</el-button>
            <el-button v-if="mod.editable && mod.cityId == userInfo.manageCityId" type="text" size="mini" @click="toDelete(mod)">删除</el-button>
            <el-button v-if="userType != 1 && mod.enable" type="text" size="mini" @click="moduleEnable(mod)">{{mod.enable ? '停用' : '启用'}}</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="mod-list-item">
      <div class="mod-list-item-title">
        <span>城市首页基础配置二</span>
        <el-button type="primary" size="mini" @click="toAddModule('BAR', 1)">添加</el-button>
      </div>
      <div class="mod-box">
        <div v-for="mod in moduleSecond" :key="mod.modId" class="mod-item">
          <div class="mod-item-info">
            <el-button v-if="mod.isOpening" type="text" @click="toSort(mod)">No.{{mod.sort}}</el-button>
            <div class="mod-item-name">{{mod.name}}</div>
          </div>
          <div class="mod-item-option">
            <el-button type="text" size="mini" @click="moduleView(mod, 'BAR')">{{mod.editable && mod.cityId == userInfo.manageCityId ? '配置修改' : '配置详情'}}</el-button>
            <el-button v-if="mod.editable && mod.cityId == userInfo.manageCityId" type="text" size="mini" @click="toDelete(mod)">删除</el-button>
            <el-button v-if="userType != 1 && mod.enable" type="text" size="mini" @click="moduleEnable(mod)">{{mod.enable ? '停用' : '启用'}}</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="mod-list-item">
      <div class="mod-list-item-title">
        <span>生活频道配置</span>
        <el-button type="primary" size="mini" @click="toAddModule('NEWS', 2)">添加</el-button>
      </div>
      <div class="mod-box">
        <div v-for="mod in moduleLife" :key="mod.modId" class="mod-item">
          <div class="mod-item-info">
            <el-button v-if="mod.isOpening" type="text" @click="toSort(mod)">No.{{mod.sort}}</el-button>
            <div class="mod-item-name">{{mod.name}}</div>
          </div>
          <div class="mod-item-option">
            <el-button type="text" size="mini" @click="moduleView(mod, 'NEWS')">{{mod.editable && mod.cityId == userInfo.manageCityId ? '配置修改' : '配置详情'}}</el-button>
            <el-button v-if="mod.editable && mod.cityId == userInfo.manageCityId" type="text" size="mini" @click="toDelete(mod)">删除</el-button>
            <el-button v-if="userType != 1 && mod.enable" type="text" size="mini" @click="moduleEnable(mod)">{{mod.enable ? '停用' : '启用'}}</el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="模块配置"
      :visible.sync="dialogVisible"
      append-to-body
      width="60%">
      <el-form ref="form" :model="modDetail" labelWidth="100px" :rules="formRules">
        <el-form-item label="模块名称：" prop="name">
          <el-input v-model.trim="modDetail.name" :disabled="!editable" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="模块logo：" prop="icon">
          <hc-image-cropper v-model="modDetail.icon" :disabled="!editable" :init-data="modDetail.icon" :heightLimit="120" :widthLimit="210" show-image-list single :limit="1" bottom-tip="请上传尺寸为210*120的图片" accept=".jpg,.png,.JPG,.PNG" background-color="#F9F9F9" @change="$refs.form.validateField('icon')"></hc-image-cropper>
        </el-form-item>
        <el-form-item label="关联功能：" prop="path">
          <el-row>
            <el-col :span="8">
              <el-select v-model="modPath" :disabled="!editable" @change="pathChange">
                <el-option v-for="(item, index) in businessModules" :key="index" :value="item.value" :label="item.label">{{item.label}}</el-option>
              </el-select>
            </el-col>
            <el-col :span="16">
              <div style="padding-left: 10px;">
                <el-input v-if="modPath == 'others'" v-model="modDetail.path" maxlength="1024"></el-input>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="所属城市：" prop="cityIds">
          <hc-city-select v-model="modDetail.cityIds" :view-only="!editable" noMerge :city-id="userInfo.manageCityId"></hc-city-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">返 回</el-button>
        <el-button v-if="editable" type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import { adminCityModule, addCityModule, getCityModuleDetail, updateCityModule, enableCityModule, cityModuleSort, deleteCityModule } from '@/api/admin/city'
import { mapGetters } from 'vuex'
import HcSingleView from '@/views/components/HcSingleView/index'
import HcImageCropper from '@/views/components/HcImageUpload/cropper'
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index";
const prefix = 'http://183.131.134.242:10173/module_web/WebActivity?webUrl='
export default {
  components: { HcSingleView, HcImageCropper, HcCitySelect },
  data () {
    return {
      formDialogVisible: false,
      moduleFirst: [],
      moduleSecond: [],
      moduleLife: [],
      dialogVisible: false,
      modDetail: {},
      modPath: '',
      modType: '',
      editable: false,
      formRules: {
        name: [{required: true, message: '请输入模块名称', trigger: 'blur'}],
        icon: [{required: true, message: '请添加模块logo', trigger: 'change'}],
        path: [{required: true, message: '请选择或填写关联功能', trigger: 'blur'}],
        cityIds: [{required: true, message: '请选择所属城市', trigger: 'change'}],
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'dicList', 'userType']),
    businessModules () {
      if (this.modType) {
        return [
          ...this.dicList[`CITY_BUSINESS_MODULE_${this.modType}`],
          {
            label: 'H5模块',
            value: 'others'
          }
        ]
      } else {
        return []
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    pathChange (val) {
      if (val !== 'others') {
        this.modDetail.path = val
      } else {
        this.modDetail.path = ''
      }
    },
    init () {
      this.moduleFirst = []
      this.moduleSecond = []
      this.moduleLife = []
      const loading = this.$loading({
        target: '.mod-box',
      });
      adminCityModule({
        cityId: this.userInfo.manageCityId,
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
    toAddModule (type, location) {
      this.modType = type
      this.modDetail = {
        cityId: this.userInfo.manageCityId,
        name: '',
        icon: '',
        path: '',
        cityIds: [],
        location
      }
      this.modPath = ''
      this.editable = true
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let path = this.modPath == 'others' ? prefix + this.modDetail.path : this.modDetail.path
          if (this.modDetail.moduleId) {
            updateCityModule({
              ...this.modDetail,
              path
            }).then((data) => {
              this.init()
              this.dialogVisible = false
            })
          } else {
            addCityModule({
              ...this.modDetail,
              path
            }).then((data) => {
              this.init()
              this.dialogVisible = false
            })
          }
        }
      })

    },
    moduleView (data, type) {
      getCityModuleDetail(data.moduleId).then(({data}) => {
        this.modDetail = {
          moduleId: data.data.data.moduleId,
          cityId: data.data.data.cityId,
          name: data.data.data.name,
          icon: data.data.data.icon,
          path: data.data.data.path,
          cityIds: data.data.data.openCityIds,
          location: data.data.data.location
        }
        this.editable = data.data.data.editable && data.data.data.cityId == this.userInfo.manageCityId
        this.modType = type
        let types = this.dicList[`CITY_BUSINESS_MODULE_${this.modType}`]
        let systemPath = false
        for (let i = 0; i < types.length; i++) {
          if (types[i].value == data.data.data.path) {
            systemPath = true
            break
          }
        }
        if (systemPath) {
          this.modPath = data.data.data.path
        } else {
          this.modPath = 'others'
          let path = data.data.data.path
          if (path.startsWith(prefix)) {
            this.modDetail.path = path.substring(prefix.length)
          }
        }
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.form.clearValidate()
        })
      })
    },
    moduleEnable (mod) {
      let title = mod.enable ? '是否确认停用该模块？' : '是否确认启用该模块？'
      this.$confirm(title, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        enableCityModule({
          moduleId: mod.moduleId,
          cityId: this.userInfo.manageCityId,
          enable: !mod.enable
        }).then(() => {
          this.$message.success('操作成功！')
          this.init()
        })
      });
    },
    toSort (mod) {
      this.$prompt('1~999的整数', '请输入排序值', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'number',
        inputValidator: (val) => {
          return val.length < 4 && /^[1-9]+0*$/.test(val) && parseInt(val) <= 999
        },
        inputErrorMessage: '请输入1~999的整数'
      }).then(({ value }) => {
        if (value) {
          cityModuleSort({
            moduleId: mod.moduleId,
            sort: value,
            cityId: this.userInfo.manageCityId,
          }).then(({data}) => {
            this.$message.success('操作成功！')
            this.init()
          })
        }
      })
    },
    toDelete (mod) {
      this.$confirm('是否确认删除该模块', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteCityModule({
          moduleId: mod.moduleId,
          cityId: mod.cityId,
        }).then(() => {
          this.$message.success('操作成功！')
          this.init()
        })
      });
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
    display: flex;
    align-items: center;
    justify-content: space-between;
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
      flex-direction: column;
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
  overflow: hidden;
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
      display: grid;
      grid-template-columns: 70px auto;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      width: 100%;
      color: #666666;
      overflow: hidden;
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
      .mod-path {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        overflow: hidden;
      }
    }
  }
}
</style>
