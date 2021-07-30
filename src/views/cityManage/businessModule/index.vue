<template>
  <basic-container>
    <div class="mod-list-item">
      <div class="mod-list-item-title">
        <span>城市首页基础配置一</span>
        <el-button type="primary" size="mini" @click="toAddModule('TOP', 0)"
          >添加</el-button
        >
      </div>
      <div class="mod-box">
        <div v-for="mod in moduleFirst" :key="mod.modId" class="mod-item">
          <div class="mod-item-info">
            <el-button v-if="mod.isOpening" type="text" @click="toSort(mod)"
              >No.{{ mod.sort }}</el-button
            >
            <div class="mod-item-name">{{ mod.name }}</div>
          </div>
          <div class="mod-item-option">
            <el-button
              type="text"
              size="mini"
              @click="moduleView(mod, 'TOP')"
              >{{
                mod.editable && mod.cityId == userInfo.manageCityId
                  ? "配置修改"
                  : "配置详情"
              }}</el-button
            >
            <el-button
              v-if="mod.editable && mod.cityId == userInfo.manageCityId"
              type="text"
              size="mini"
              @click="toDelete(mod)"
              >删除</el-button
            >
            <el-button
              v-if="userType != 1"
              type="text"
              size="mini"
              @click="moduleEnable(mod)"
              >{{ mod.enable ? "停用" : "启用" }}</el-button
            >
          </div>
        </div>
      </div>
    </div>

    <div class="mod-list-item">
      <div class="mod-list-item-title">
        <span>城市首页基础配置二</span>
        <el-button type="primary" size="mini" @click="toAddModule('BAR', 1)"
          >添加</el-button
        >
      </div>
      <div class="mod-box">
        <div v-for="mod in moduleSecond" :key="mod.modId" class="mod-item">
          <div class="mod-item-info">
            <el-button v-if="mod.isOpening" type="text" @click="toSort(mod)"
              >No.{{ mod.sort }}</el-button
            >
            <div class="mod-item-name">{{ mod.name }}</div>
          </div>
          <div class="mod-item-option">
            <el-button
              type="text"
              size="mini"
              @click="moduleView(mod, 'BAR')"
              >{{
                mod.editable && mod.cityId == userInfo.manageCityId
                  ? "配置修改"
                  : "配置详情"
              }}</el-button
            >
            <el-button
              v-if="mod.editable && mod.cityId == userInfo.manageCityId"
              type="text"
              size="mini"
              @click="toDelete(mod)"
              >删除</el-button
            >
            <el-button
              v-if="userType != 1"
              type="text"
              size="mini"
              @click="moduleEnable(mod)"
              >{{ mod.enable ? "停用" : "启用" }}</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <div class="mod-list-item">
      <div class="mod-list-item-title">
        <span>生活频道配置</span>
        <el-button type="primary" size="mini" @click="toAddModule('NEWS', 2)"
          >添加</el-button
        >
      </div>
      <div class="mod-box">
        <div v-for="mod in moduleLife" :key="mod.modId" class="mod-item">
          <div class="mod-item-info">
            <el-button v-if="mod.isOpening" type="text" @click="toSort(mod)"
              >No.{{ mod.sort }}</el-button
            >
            <div class="mod-item-name">{{ mod.name }}</div>
          </div>
          <div class="mod-item-option">
            <el-button
              type="text"
              size="mini"
              @click="moduleView(mod, 'NEWS')"
              >{{
                mod.editable && mod.cityId == userInfo.manageCityId
                  ? "配置修改"
                  : "配置详情"
              }}</el-button
            >
            <el-button
              v-if="mod.editable && mod.cityId == userInfo.manageCityId"
              type="text"
              size="mini"
              @click="toDelete(mod)"
              >删除</el-button
            >
            <el-button
              v-if="userType != 1"
              type="text"
              size="mini"
              @click="moduleEnable(mod)"
              >{{ mod.enable ? "停用" : "启用" }}</el-button
            >
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="模块配置"
      :visible.sync="dialogVisible"
      append-to-body
      :before-close="beforeModDetailClose"
      width="60%"
    >
      <el-form
        ref="form"
        :model="modDetail"
        labelWidth="100px"
        :rules="formRules"
      >
        <el-form-item label="模块名称：" prop="name">
          <el-input
            v-model.trim="modDetail.name"
            :disabled="!editable"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="模块logo：" prop="icon">
          <hc-image-cropper
            v-model="modDetail.icon"
            :disabled="!editable"
            :init-data="modDetail.icon"
            :heightLimit="120"
            :widthLimit="210"
            show-image-list
            single
            :limit="1"
            bottom-tip="请上传尺寸为210*120的图片"
            accept=".jpg,.png,.JPG,.PNG"
            background-color="#F9F9F9"
            @change="$refs.form.validateField('icon')"
          ></hc-image-cropper>
        </el-form-item>
        <el-form-item label="关联类型：" prop="pathType">
          <el-select v-model="modDetail.pathType" :disabled="!editable" @change="pathTypeChange">
            <el-option :value="1" label="APP内部功能">APP内部功能</el-option>
            <el-option :value="2" label="微信小程序">微信小程序</el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="modDetail.pathType === 1"
          label="关联功能："
          prop="path"
        >
          <el-row>
            <el-col :span="8">
              <el-select
                v-model="modPath"
                :disabled="!editable"
                @change="pathChange"
              >
                <el-option
                  v-for="(item, index) in businessModules"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                  >{{ item.label }}</el-option
                >
              </el-select>
            </el-col>
            <el-col :span="16">
              <div style="padding-left: 10px">
                <el-input
                  v-if="modPath == 'others'"
                  v-model="modDetail.path"
                  :disabled="!editable"
                  maxlength="1024"
                ></el-input>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <template v-if="modDetail.pathType === 2">
          <el-form-item label="页面url：">
            <el-input :disabled="!editable" v-model="modDetail.path"></el-input>
          </el-form-item>
        </template>
        <el-form-item label="参数：" prop="parameterObj">
          <el-button size="mini" type="primary" v-show="editable" style="margin-bottom: 10px" @click="addParameter"
            >添加参数</el-button
          >
          <el-row
            v-for="(parameter, index) in parameterList"
            :key="index"

          >
            <el-col :span="8">
              <div class="item-line">
                <div class="line-title">参数名称：</div>
                <div class="line-content">
                  <el-input v-model.trim="parameter.key" :disabled="!editable" @input="noSpace($event, parameter, 'key')" @change="noSpace($event, parameter, 'key')"></el-input>
                </div>
              </div>
            </el-col>
            <el-col :span="12" style="padding-left: 20px">
              <div class="item-line">
                <div class="line-title">参数值：</div>
                <div class="line-content">
                  <el-input v-model.trim="parameter.value" :disabled="!editable" @input="noSpace($event, parameter, 'value')" @change="noSpace($event, parameter, 'value')"></el-input>
                </div>
              </div>
            </el-col>
            <el-col :span="4" style="text-align: center" v-show="editable">
              <i class="el-icon-remove" @click="removeParameter(index)"></i>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="版本要求：" prop="versionsList">
          <el-button size="mini" type="primary" v-show="editable" style="margin-bottom: 10px" @click="addVersion"
            >添加要求</el-button
          >
          <el-row
            v-for="(version, index) in versionsList"
            :key="version.symbol"
          >
            <el-col :span="8">
              <div class="item-line">
                <div class="line-title">系统：</div>
                <div class="line-content">
                  <el-select
                    v-model="version.system"
                    :disabled="!editable"
                    @change="versionSystemChange(index, version, $event)"
                  >
                    <el-option :value="1" label="IOS">IOS</el-option>
                    <el-option :value="2" label="安卓">安卓</el-option>
                  </el-select>
                </div>
              </div>
            </el-col>
            <el-col :span="12" style="padding-left: 20px">
              <div class="item-line">
                <div class="line-title">版本要求：</div>
                <div class="line-content">
                  <hc-select-more
                    :disabled="!editable"
                    :ref="'versionSelect' + index"
                    v-model="version.versionId"
                    :remoteFun="getVersionList"
                    :params="{ system: version.system }"
                  ></hc-select-more>
                </div>
              </div>
            </el-col>
            <el-col :span="4" style="text-align: center" v-show="editable">
              <i class="el-icon-remove" @click="removeVersion(index)"></i>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="所属城市：" prop="cityIds">
          <hc-city-select
            v-model="modDetail.cityIds"
            :view-only="!editable"
            noMerge
            :city-id="userInfo.manageCityId"
          ></hc-city-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="closeModDetail">返 回</el-button>
        <el-button v-if="editable" type="primary" @click="save" :loading="loading"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import { getVersionPage } from "@/api/admin/app-version";
import {
  adminCityModule,
  addCityModule,
  getCityModuleDetail,
  updateCityModule,
  enableCityModule,
  cityModuleSort,
  deleteCityModule,
} from "@/api/admin/city";
import { mapGetters } from "vuex";
import HcSingleView from "@/views/components/HcSingleView/index";
import HcImageCropper from "@/views/components/HcImageUpload/cropper";
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index";
import HcSelectMore from "@/views/components/HcForm/HcSelectMore/index";
const prefix = "http://183.131.134.242:10173/module_web/WebActivity?webUrl=";
export default {
  components: { HcSingleView, HcImageCropper, HcCitySelect, HcSelectMore },
  data() {
    return {
      formDialogVisible: false,
      moduleFirst: [],
      moduleSecond: [],
      moduleLife: [],
      dialogVisible: false,
      modDetail: {},
      modPath: "",
      modType: "",
      editable: false,
      parameterList: [],
      versionsList: [],
      formRules: {
        name: [{ required: true, message: "请输入模块名称", trigger: "blur" }],
        icon: [
          { required: true, message: "请添加模块logo", trigger: "change" },
        ],
        pathType: [
          { required: true, message: "请选择关联类型", trigger: "blur" },
        ],
        path: [
          { required: true, message: "请选择或填写关联功能", trigger: "blur" },
        ],
        cityIds: [
          { required: true, message: "请选择所属城市", trigger: "change" },
        ],
        parameterObj: [
          { validator: this.parameterObjValidator, trigger: "blur" }
        ],
        versionsList: [
          { validator: this.versionsListValidator, trigger: "blur" }
        ]
      },
      loading: false
    };
  },
  computed: {
    ...mapGetters(["userInfo", "dicList", "userType"]),
    businessModules() {
      if (this.modType) {
        return [
          ...this.dicList[`CITY_BUSINESS_MODULE_${this.modType}`],
          {
            label: "H5模块",
            value: "others",
          },
        ];
      } else {
        return [];
      }
    },
  },
  created() {
    this.init();
  },
  methods: {
    noSpace (val, targe, key) {
      targe[key] = val.replace(/\s+/g,"")
    },
    parameterObjValidator (rules, value, callback) {
      if (this.parameterList && this.parameterList.length > 0) {
        for (let i = 0; i < this.parameterList.length; i++) {
          if (!this.parameterList[i].key || !this.parameterList[i].value) {
            callback(new Error('参数名称和参数值不能为空'))
            return
          }
        }
      }
      callback()
    },
    versionsListValidator (rules, value, callback) {
      if (this.versionsList && this.versionsList.length > 0) {
        for (let i = 0; i < this.versionsList.length; i++) {
          if (!this.versionsList[i].system || !this.versionsList[i].versionId) {
            callback(new Error('系统和版本要求不能为空'))
            return
          }
        }
      }
      callback()
    },
    pathChange(val) {
      if (val !== "others") {
        this.modDetail.path = val;
      } else {
        this.modDetail.path = "";
      }
    },
    init() {
      this.moduleFirst = [];
      this.moduleSecond = [];
      this.moduleLife = [];
      const loading = this.$loading({
        target: ".mod-box",
      });
      adminCityModule({
        cityId: this.userInfo.manageCityId,
      })
        .then(({ data }) => {
          let modules = data.data.data;
          for (let i = 0; i < modules.length; i++) {
            if (modules[i].location == 0) {
              this.moduleFirst.push(modules[i]);
            } else if (modules[i].location == 1) {
              this.moduleSecond.push(modules[i]);
            } else if (modules[i].location == 2) {
              this.moduleLife.push(modules[i]);
            }
          }
        })
        .finally(() => {
          loading.close();
        });
    },
    toAddModule(type, location) {
      this.modType = type;
      this.modDetail = {
        cityId: this.userInfo.manageCityId,
        name: "",
        icon: "",
        pathType: 1,
        path: "",
        cityIds: [],
        location
      };
      this.versionsList = []
      this.parameterList = []
      this.modPath = "";
      this.editable = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    save() {
      this.loading = true
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 重组paramater
          let parameterObj = {};
          for (let i = 0; i < this.parameterList.length; i++) {
            parameterObj[this.parameterList[i].key] =
              this.parameterList[i].value;
          }

          // 获取最终path
          let path = "";
          if (this.modDetail.pathType == 1) {
            path =
              this.modPath == "others"
                ? prefix + this.modDetail.path
                : this.modDetail.path;
          } else {
            path = this.modDetail.path;
          }

          if (this.modDetail.moduleId) {
            updateCityModule({
              ...this.modDetail,
              path,
              parameterObj,
              versionsList: this.versionsList
            }).then((data) => {
              this.init();
              this.closeModDetail()
            }).finally(() => {
              this.loading = false
            });
          } else {
            addCityModule({
              ...this.modDetail,
              path,
              parameterObj,
              versionsList: this.versionsList
            }).then((data) => {
              this.init();
              this.closeModDetail()
            }).finally(() => {
              this.loading = false
            });
          }
        } else {
          this.loading = false
        }

      });
    },
    moduleView(data, type) {
      getCityModuleDetail(data.moduleId).then(({ data }) => {
        this.modDetail = {
          moduleId: data.data.data.moduleId,
          cityId: data.data.data.cityId,
          name: data.data.data.name,
          icon: data.data.data.icon,
          pathType: data.data.data.pathType || 1,
          path: data.data.data.path,
          cityIds: data.data.data.openCityIds,
          location: data.data.data.location,
        };
        this.editable =
          data.data.data.editable &&
          data.data.data.cityId == this.userInfo.manageCityId;
        this.modType = type
        this.modPath = ''
        if (this.modDetail.pathType == 1) {
          let types = this.dicList[`CITY_BUSINESS_MODULE_${this.modType}`];
          let systemPath = false;
          for (let i = 0; i < types.length; i++) {
            if (types[i].value == data.data.data.path) {
              systemPath = true;
              break;
            }
          }
          if (systemPath) {
            this.modPath = data.data.data.path;
          } else {
            this.modPath = "others";
            let path = data.data.data.path;
            if (path.startsWith(prefix)) {
              this.modDetail.path = path.substring(prefix.length);
            }
          }
        }
        let parameter = JSON.parse(data.data.data.parameter)
        let parameterObj = []
        for (let key in parameter) {
          parameterObj.push({
            key,
            value: parameter[key]
          })
        }
        this.parameterList = parameterObj
        let versions = data.data.data.versionsList || []
        let versionsList = []
        for (let i = 0; i < versions.length; i++) {
          versionsList.push({
            symbol: Symbol(),
            system: versions[i].system,
            versionId: versions[i].versionId,
            versionNo: versions[i].versionNo
          })
        }
        this.versionsList = versionsList
        this.dialogVisible = true;
        this.$nextTick(() => {
          for (let i = 0; i < this.versionsList.length; i++) {
            this.$refs["versionSelect" + i][0].setData({
              id: this.versionsList[i].versionId,
              versionNo: this.versionsList[i].versionNo + ' 及以上'
            });
          }
          this.$refs.form.clearValidate();
        });
      });
    },
    moduleEnable(mod) {
      let title = mod.enable ? "是否确认停用该模块？" : "是否确认启用该模块？";
      this.$confirm(title, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        enableCityModule({
          moduleId: mod.moduleId,
          cityId: this.userInfo.manageCityId,
          enable: !mod.enable,
        }).then(() => {
          this.$message.success("操作成功！");
          this.init();
        });
      });
    },
    toSort(mod) {
      this.$prompt("1~999的整数", "请输入排序值", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "number",
        inputValidator: (val) => {
          return (
            val.length < 4 && /^[1-9]+0*$/.test(val) && parseInt(val) <= 999
          );
        },
        inputErrorMessage: "请输入1~999的整数",
      }).then(({ value }) => {
        if (value) {
          cityModuleSort({
            moduleId: mod.moduleId,
            sort: value,
            cityId: this.userInfo.manageCityId,
          }).then(({ data }) => {
            this.$message.success("操作成功！");
            this.init();
          });
        }
      });
    },
    toDelete(mod) {
      this.$confirm("是否确认删除该模块", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteCityModule({
          moduleId: mod.moduleId,
          cityId: mod.cityId,
        }).then(() => {
          this.$message.success("操作成功！");
          this.init();
        });
      });
    },
    pathTypeChange () {
      this.modDetail.path = ''
      this.modPath = ''
    },
    addParameter() {
      this.parameterList.push({
        key: "",
        value: "",
      });
    },
    removeParameter(index) {
      this.parameterList.splice(index, 1);
    },
    addVersion() {
      this.versionsList.push({
        symbol: Symbol(),
        system: "",
        versionId: "",
      });
    },
    removeVersion(index) {
      this.versionsList.splice(index, 1);
    },
    versionSystemChange(index, version, val) {
      version.versionId = "";
      this.$nextTick(() => {
        this.$refs["versionSelect" + index][0].initOptions();
        this.$refs["versionSelect" + index][0].setData();
      });
    },
    getVersionList(params) {
      return new Promise((resolve, reject) => {
        if (params.system) {
          getVersionPage(params).then(({ data }) => {
            resolve({
              list: data.data.data.records,
              hasMore: data.data.data.pages > data.data.data.current,
            });
          });
        } else {
          resolve({
            list: [],
            hasMore: false,
          });
        }
      });
    },
    closeModDetail () {
      this.dialogVisible = false
      this.initForm()
    },
    initForm () {
      this.modDetail = {
        cityId: this.userInfo.manageCityId,
        name: "",
        icon: "",
        pathType: 1,
        path: "",
        cityIds: [],
        location,
        parameterObj: {}
      }
      this.parameterList = []
      this.versionsList = []
      this.modPath = "";
      this.loading = false
    },
    beforeModDetailClose (next) {
      this.initForm()
      next()
    }
  },
};
</script>

<style lang="scss" scoped>
.mod-list-item {
  margin-top: 24px;
  padding: 24px;
  border: 1px solid #d9d9d9;
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
      border: 1px solid #d9d9d9;
      background-color: #f9f9f9;
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

.item-line {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .line-title {
    // flex: 100px 0 0,
  }
  .line-content {
    flex: 40px 1 1;
  }
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
    background-color: #f9f9f9;
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
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        border-bottom: 1px solid #d9d9d9;
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
