<template>
  <basic-container>
    <hc-table-form
      :title="title"
      :formVisible="publish"
      @go-back="goBack">
      <hc-crud ref="hcCrud" :option="tableOption" :fetchListFun="fetchListFun">
        <template slot="menuLeft">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="toCreate"
            >新建</el-button>
        </template>
        <template v-slot:qrcode="scope">
          <merchant-qr-code :id="scope.row.merchantId"></merchant-qr-code>
        </template>
        <template slot="menu" slot-scope="scope">
          <template v-if="scope.row.state === 0">
            <el-button type="text" size="mini" @click="toView(scope.row)"
              >详情</el-button
            >
            <el-button type="text" size="mini" @click="toUpdate(scope.row)"
              >编辑</el-button
            >
            <el-button type="text" size="mini" @click="toSetUp(scope.row)"
              >上架</el-button
            >
            <el-button type="text" size="mini" @click="toDelete(scope.row)"
              >删除</el-button
            >
          </template>
          <template v-else-if="scope.row.state === 1">
            <el-button type="text" size="mini" @click="toView(scope.row)"
              >详情</el-button
            >
            <el-button type="text" size="mini" @click="toSetDown(scope.row)"
              >下架</el-button
            >
          </template>
          <template v-else-if="scope.row.state === 2">
            <el-button type="text" size="mini" @click="toView(scope.row)"
              >详情</el-button
            >
          </template>
        </template>
      </hc-crud>
  
      <template slot="form">
        <el-form
          :disabled="publishType == 'view'"
          ref="form"
          class="dialog-main-tree"
          :model="formData"
          label-width="180px"
          :rules="formRule"
        >
          <el-form-item label="商品名称：" prop="name">
            <el-input v-model="formData.name" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：" prop="type">
            <el-select v-model="formData.type">
              <el-option :value="1" label="研究报告">研究报告</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品图：" prop="images">
            <hc-file-upload-image ref="images" :init-data="images" :disabled="publishType == 'view'"></hc-file-upload-image>
          </el-form-item>
          <el-form-item label="商品介绍：" prop="description">
            <el-input type="textarea" v-model="formData.description" :autosize="{minRows: 5, maxRows: 10}" maxlength="1000"></el-input>
          </el-form-item>
          <el-form-item label="商品价格：" prop="price">
            <hc-input style="width: 250px;" v-model="formData.price" :decimal="0" maxlength="9" :min="1" :max="99999999">
              <div slot="append">积分</div>
            </hc-input>
          </el-form-item>
          <el-form-item label="附件：" prop="annex">
            <el-upload
              :limit="1"
              :action="uploadPicUrl"
              :file-list="annex"
              :headers="headersOpt"
              :on-success="handleAccessorySuccess"
              :on-remove="handleAccessoryRemove">
              <el-button size="small">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button v-if="publishType != 'view'" type="primary" :loading="formLoading" @click="handleSave">保 存</el-button>
          </el-form-item>
        </el-form>
      </template>
    </hc-table-form>
  </basic-container>
</template>

<script>
import { tableOption } from "./const";
import { mapGetters } from "vuex";
import { getGoodsList, saveGoods, getGoodsDetail, deleteGoods, setGoodsState } from "@/api/cityCurrency/goods"
import HcInput from "@/views/components/HcForm/HcInput/index"
import HcFileUploadImage from "@/views/components/HcFileUpload/image"
import HcFileUpload from "@/views/components/HcFileUpload/index"
export default {
  components: { HcInput, HcFileUpload, HcFileUploadImage },
  data() {
    return {
      formData: {},
      images: [],
      publish: false,
      publishType: "",
      formRule: {
        name: {required: true, message: "请输入商品名称", trigger: "blur"},
        type: {required: true, message: "请选择商品分类", trigger: "blur"},
        price: {required: true, message: "请输入商品价格", trigger: "blur"},
        description: {required: true, message: "请输入商品介绍", trigger: "blur"},
        images: {required: true, validator: this.imagesValidator, trigger: "blur"},
        annex: {required: true, validator: this.annexValidator, trigger: "blur"},
      },
      formLoading: false,
      annex: [],
      headersOpt: {
        Authorization: "Bearer " + this.$store.getters.access_token,
      },
      uploadPicUrl: "/api/admin/sys_file/oss/upload",
    };
  },
  computed: {
    ...mapGetters(["permissions", "userInfo", "dicList", "userType", "allCityTree"]),
    tableOption() {
      return tableOption(this.userType == 1 || this.userType == 2);
    },
    percentageLabel () {
      if (this.formData.percentageType == 2) {
        return '抽成百分比'
      } else if (this.formData.percentageType == 3) {
        return '抽成金额'
      } else {
        return ''
      }
    },
    title () {
      if (!this.publish) {
        return '商品管理'
      } else {
        if (this.publishType == 'add') {
          return '商品信息-新增'
        } else if (this.publishType == 'eidit') {
          return '商品信息-编辑'
        } else {
          return '商品信息'
        }
      }
    }
  },
  methods: {
    imagesValidator (rules, value, callback) {
      let fileList = this.$refs.images.fileList
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].type == 'formal') {
          callback()
        }
      }
      callback(new Error('请添加商品图'))
    },
    annexValidator (rules, value, callback) {
      if (this.annex && this.annex.length > 0) {
        callback()
      } else {
        callback(new Error('请添加附件'))
      }
    },
    goBack () {
      this.brandList = []
      this.publish = false
    },
    brandSelect (data) {
      this.formData.brandId = data
    },
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        getGoodsList(params)
        .then(({ data }) => {
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
      this.publish = true;
      this.publishType = "add";
      this.images = []
      this.annex = []
      this.formData = {}
    },
    handleSave() {
      this.formLoading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          this.save()
        } else {
          this.formLoading = false
        }
      })
    },
    save () {
      let formData = { 
        ...this.formData,
      }
      let fileList = this.$refs.images.fileList
      let images = []
      let hasMaster = false
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].type == 'formal') {
          if (fileList[i].ifMaster === 1) {
            hasMaster = true
          }
          images.push({
            imageUrl: fileList[i].url,
            ifMaster: fileList[i].ifMaster || 0
          })
        }
      }
      if (!hasMaster) {
        images[0].ifMaster = 1
      }
      formData.images = images
      formData.annexName = this.annex[0].name
      formData.annexAddresses = this.annex[0].url
      saveGoods(formData).then(({ data }) => {
        this.publish = false;
        if (this.publishType == "add") {
          this.$notify({
            title: "成功",
            message: "添加成功",
            type: "success",
            duration: 2000,
          });
        } else {
          this.$notify({
            title: "成功",
            message: "保存成功！",
            type: "success",
            duration: 2000,
          });
        }
        this.$refs.hcCrud.refresh()
      }).finally(() => {
        this.formLoading = false
      });
    },
    toView ({ id }) {
      getGoodsDetail(id).then(({ data }) => {
        this.formData = data.data.data;
        this.formData.id = this.formData.cowryGoodsId
        this.images = []
        let images = this.formData.images
        for (let i = 0; i < images.length; i++) {
          this.images.push({
            type: 'formal',
            url: images[i].imageUrl,
            ifMaster: images[i].ifMaster
          })
        }
        this.annex = [{
          name: this.formData.annexName,
          url: this.formData.annexAddresses
        }]
        this.publish = true;
        this.publishType = "view";
      });
    },
    toUpdate({ id }) {
      getGoodsDetail(id).then(({ data }) => {
        this.formData = data.data.data;
        this.formData.id = this.formData.cowryGoodsId
        this.images = []
        let images = this.formData.images
        for (let i = 0; i < images.length; i++) {
          this.images.push({
            type: 'formal',
            url: images[i].imageUrl,
            ifMaster: images[i].ifMaster
          })
        }
        this.annex = [{
          name: this.formData.annexName,
          url: this.formData.annexAddresses
        }]
        this.publish = true;
        this.publishType = "edit";
      });
    },
    toDelete({ id }) {
      this.$confirm("是否确认删除该商品?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteGoods(id).then(({ data }) => {
            this.publish = false;
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000,
            });
            this.$refs.hcCrud.refresh()
          });
        })
        .catch(function () {});
    },
    toSetUp ({id}) {
      this.$confirm("是否确认上架该商品?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          setGoodsState({
            id: id,
            state: 1
          }).then(({ data }) => {
            this.publish = false;
            this.$notify({
              title: "成功",
              message: "上架成功",
              type: "success",
              duration: 2000,
            });
            this.$refs.hcCrud.refresh()
          });
        })
        .catch(function () {});
    },
    toSetDown ({id}) {
      this.$confirm("是否确认下架该商品?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          setGoodsState({
            id: id,
            state: 2
          }).then(({ data }) => {
            this.publish = false;
            this.$notify({
              title: "成功",
              message: "下架成功",
              type: "success",
              duration: 2000,
            });
            this.$refs.hcCrud.refresh()
          });
        })
        .catch(function () {});
    },
    // 活动附件上传成功的钩子
    handleAccessorySuccess(res, file) {
      this.annex = [{
        name: file.name,
        url: file.response.data.data.url,
      }]
    },
    // 活动附件移除
    handleAccessoryRemove(file, fileList) {
      this.annex = []
    }
  },
};
</script>
<style lang="scss" scope>
.user {
  height: 100%;

  &__tree {
    padding-top: 3px;
    padding-right: 20px;
  }

  &__main {
    .el-card__body {
      padding-top: 0;
    }
  }
}
</style>

