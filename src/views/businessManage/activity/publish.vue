<template>
  <div>
    <basic-container>
      <div class="title">基本信息</div>

      <el-form
        class="elForm"
        ref="baseFormDataRef"
        :model="baseFormData"
        label-width="120px"
      >
        <!-- 所属城市 -->
        <el-form-item label="所属城市：">
          <!-- <el-cascader
            v-model="baseFormData.city"
            :options="holdAddressArr"
            :props="defaultCityTreeParams"
            @change="handleChangeCity"
          ></el-cascader> -->
          <hc-city-select v-model="baseFormData.cityIdList"></hc-city-select>
        </el-form-item>

        <!-- 活动标题 -->
        <el-form-item label="活动标题：">
          <el-input
            v-model="baseFormData.name"
            placeholder="不小于5个字，不超过40个字"
          ></el-input>
        </el-form-item>

        <!-- 举办时间 -->
        <el-form-item label="举办时间：">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            prefix-icon="el-icon-date"
            style="margin-right: 15px"
            v-model="baseFormData.startTime"
            type="datetime"
            placeholder="选择开始日期"
          >
          </el-date-picker>
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            prefix-icon="el-icon-date"
            v-model="baseFormData.endTime"
            type="datetime"
            placeholder="选择结束日期"
          >
          </el-date-picker>
        </el-form-item>

        <!-- 活动类型 -->
        <el-form-item label="活动类型：">
          <el-select v-model="baseFormData.type" placeholder="请选择">
            <el-option
              v-for="item in activityTypeArr"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 活动海报 -->
        <el-form-item label="活动海报：">
          <div class="posterInpBox">
            <!-- 点击上传按钮 -->
            <el-upload
              class="upload-demo"
              :action="uploadPicUrl"
              :on-success="handlePosterSuccess"
              :show-file-list="false"
              :headers="headersOpt"
            >
              <el-button icon="el-icon-upload">点击上传</el-button>
            </el-upload>
            <!-- 海报图库按钮 -->
            <el-button icon="el-icon-picture" @click="showPosters"
              >海报图库</el-button
            >
          </div>
          <div
            class="poster-box"
            @mouseover="mouseOver"
            @mouseleave="mouseLeave"
          >
            <!-- 删除蒙层 -->
            <div class="mengcheng" v-if="showDelete">
              <i class="el-icon-delete"></i>
            </div>
            <div v-if="!baseFormData.poster" class="noImage">
              <div style="text-align: center">
                <i class="el-icon-picture"></i>
                <p class="picSuggest">建议图片尺寸800*480，大小不超过2M</p>
              </div>
            </div>
            <img
              v-else
              :src="baseFormData.poster"
              style="width: 100%; height: 100%; border-radius: 5px"
            />
          </div>
        </el-form-item>

        <!-- 活动地址 -->
        <el-form-item label="活动地址：">
          <div class="addressbox">
            <!-- 举办地 -->
            <el-cascader
              placeholder="请选择举办地"
              v-model="baseFormData.cityId"
              :options="holdAddressArr"
              :props="defaultCityTreeParams"
              @change="handleChangeHoldAddress"
            ></el-cascader>

            <!-- 活动地址 -->
            <el-input
              style="width: 600px; margin: 0 10px"
              v-model="baseFormData.field"
              placeholder="请输入活动地址"
            ></el-input>

            <el-checkbox v-model="onLine">线上举办</el-checkbox>
          </div>
        </el-form-item>

        <!-- 活动分类 -->
        <el-form-item label="活动分类：">
          <el-cascader
            v-model="classification"
            :options="activityClassifyArr"
            :props="defaultActivityClassifyParams"
            @change="handleChangeActivityClassify"
          ></el-cascader>
        </el-form-item>

        <!-- 活动标签 -->
        <el-form-item label="活动标签：">
          <!-- 暂无标签 -->
          <em style="margin-right: 10px" v-if="baseFormData.label.length === 0"
            >暂无标签</em
          >
          <!-- 标签 -->
          <el-tag
            style="margin-right: 10px"
            size="big"
            type="danger"
            closable
            v-for="tag in baseFormData.label"
            :key="tag"
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <!-- 编辑按钮 -->
          <el-button
            size="small"
            v-if="!haveInputVal"
            @click="haveInputVal = true"
            class="el-icon-edit"
            >编辑</el-button
          >
          <!-- 填写标签 -->
          <el-autocomplete
            size="small"
            autofocus
            v-if="haveInputVal"
            v-model="actInpVal"
            :fetch-suggestions="querySearch"
            @keyup.enter.native="handleTagValFn"
            @select="handleTagValFn"
          ></el-autocomplete>
        </el-form-item>

        <!-- 活动亮点 -->
        <el-form-item label="活动亮点：">
          <el-input
            placeholder="请填写几句活动核心亮点，便于分享摘要以及百度等搜索引擎搜索（150个字）"
            type="textarea"
            v-model="baseFormData.spot"
          ></el-input>
        </el-form-item>

        <!-- 活动详情 -->
        <el-form-item label="活动详情：">
          <hc-quill v-model="quillContent"></hc-quill>
        </el-form-item>

        <!-- 活动附件 -->
        <el-form-item label="活动附件：">
          <el-upload
            class="upload-demo"
            :action="uploadPicUrl"
            :file-list="fileList"
            :headers="headersOpt"
            :on-success="handleAccessorySuccess"
          >
            <el-button size="small">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>

      <!-- 设置票种 -->
      <el-form
        ref="setTicketDataRef"
        :model="setTicketData"
        label-width="120px"
      >
        <el-form-item label="设置票种：">
          <el-button @click="addTic" type="danger" plain>新增</el-button>
          <!-- 卡片 -->
          <el-card
            v-for="(item, i) in 1"
            :key="i"
            class="box-card"
            :body-style="cardStyle"
          >
            <!-- 设置票种表单 -->
            <el-form ref="setTicketDataRef" :model="setTicketData">
              <el-form-item label="票务种类：" label-width="100">
                <el-select
                  @change="changeTicketingType"
                  v-model="setTicketData.ticketingType"
                  placeholder="请选择票务种类"
                >
                  <el-option label="免费票" value="1"></el-option>
                  <el-option label="付费票" value="2"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="票务名称：" label-width="100">
                <el-input
                  style="width: 300px"
                  v-model="setTicketData.ticketingName"
                  placeholder="如早餐票、普通票、VIP票"
                ></el-input>
              </el-form-item>

              <!-- 票种数量 -->
              <el-form-item label="票种数量：" label-width="100">
                <el-input-number
                  v-model="setTicketData.number"
                  controls-position="right"
                  :min="1"
                ></el-input-number>
              </el-form-item>
              <!-- 单次购票数量 -->
              <el-form-item label="单次购票数量：" label-width="100">
                <el-input-number
                  v-model="setTicketData.limitTicket"
                  controls-position="right"
                  :min="1"
                ></el-input-number>
              </el-form-item>
              <!-- 票种审核 -->
              <el-form-item
                v-if="setTicketData.ticketingType === '1'"
                label="票种审核："
                label-width="100"
              >
                <el-switch
                  v-model="setTicketData.needAudit"
                  active-color="#13ce66"
                  inactive-color="#cccccc"
                >
                </el-switch>
              </el-form-item>
              <!-- 允许退票 -->
              <el-form-item
                v-else-if="setTicketData.ticketingType === '2'"
                label="允许退票："
                label-width="100"
              >
                <el-switch
                  v-model="setTicketData.allowedRefund"
                  active-color="#13ce66"
                  inactive-color="#cccccc"
                >
                </el-switch>
              </el-form-item>
              <!-- 票务金额 -->
              <el-form-item label="票务金额：">
                <el-checkbox-group v-model="priceType" class="checkGroup">
                  <el-checkbox label="能贝" name="nb" class="elcheck"
                    >能贝 <el-input v-model="payWeCanPay.amount"></el-input
                  ></el-checkbox>
                  <el-checkbox label="人民币" name="rmb"
                    >人民币 <el-input v-model="payOfflinePay.amount"></el-input
                  ></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <!-- 票种备注 -->
              <el-form-item label="票种备注：" label-width="100">
                <el-input
                  type="textarea"
                  v-model="setTicketData.remarks"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-card>
        </el-form-item>
      </el-form>

      <!-- 底部按钮 -->
      <el-button @click="publish" type="danger">发布活动</el-button>
      <el-button @click="saveManuscript">保存草稿</el-button>
      <el-button @click="cancel">取消</el-button>

      <!-- 海报弹窗 -->
      <el-dialog
        title="海报图库"
        :visible.sync="dialogPostersVisible"
        width="940px"
      >
        <div class="posterBox">
          <div
            @click="selectPoster(item)"
            class="item"
            v-for="item in posterArr"
            :key="item.id"
          >
            <img :src="item.posterUrl" />
          </div>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import store from "@/store";
import HcQuill from "@/views/components/HcQuill";
import HcCitySelect from "@/views/components/HcCitySelect/index";
import {
  activityClassify,
  cityTree,
  posters,
  activityType,
  tagsPage,
  savePublish,
} from "@/api/activity/publish";
export default {
  components: { HcQuill, HcCitySelect },
  data() {
    return {
      cardStyle: {
        border: "1px solid #eff0f1",
        "border-radius": "10px",
        "margin-top": "20px",
      },
      // 请求头
      headersOpt: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      // 上传图片路径
      uploadPicUrl: "/api/admin/sys_file/oss/upload",
      // 基本信息数据
      baseFormData: {
        cityIdList: [], //所属城市
        name: "",
        startTime: "",
        endTime: "",
        type: [],
        poster: "", //海报
        cityId: [], //举办地
        field: "", //活动地址

        classification: "", //活动父类
        subClassification: "", //活动子类

        label: [], //标签
        spot: "", //亮点
        details: "", //活动详情
        fileList: [], //附件

        ticketingManagements: [], //票种设置
      },
      // 设置票种数据
      setTicketData: {
        ticketingType: "1", //票务种类
        ticketingName: "", //票务名称
        number: 1, //票种数量
        limitTicket: 1, //单次购票数量
        allowedRefund: false, //是否允许退款
        needAudit: false, //是否审核
        remarks: "",
        payMethodList: [
          // {
          //   type: "OfflinePay", //支付类型
          //   amount: 1, //金额
          //   name: "人民币",
          //   typeBoolean: false,
          // },
        ], //支付方式列表
      },
      // 票务金额类型数组
      priceType: [],
      // 能贝支付方式
      payWeCanPay: {
        type: "WeCanPay", //支付类型
        amount: 1, //金额
        // name: [],
        // typeBoolean: false,
      },
      // 人民币支付方式
      payOfflinePay: {
        type: "OfflinePay", //支付类型
        amount: 1, //金额
        // name: [],
        // typeBoolean: false,
      },
      //活动分类
      classification: [],
      // 是否有输入标签内容
      haveInputVal: false,
      // 活动标签输入框的值
      actInpVal: "",
      // 线上举办
      onLine: "",
      // 是否编辑标签
      // isEdit: true,
      quillContent: {
        content: "",
        structuredContent: "",
      },
      // 活动附件
      fileList: [],
      // 活动分类数组
      activityClassifyArr: [],
      defaultActivityClassifyParams: {
        label: "name",
        value: "number",
        children: "children",
        expandTrigger: true, //触发方式
      },
      // 城市树
      holdAddressArr: [],
      defaultCityTreeParams: {
        label: "regionName",
        value: "id",
        children: "children",
        expandTrigger: true, //触发方式
      },
      // 控制海报图库弹窗
      dialogPostersVisible: false,
      // 海报图库数据
      posterArr: [],
      // 活动类型数据
      activityTypeArr: [],
      // 所有标签数据
      allTagArr: [],
      // 控制删除
      showDelete: false,
    };
  },
  methods: {
    // 处理活动类型数据的递归函数
    handleRecurve(arr) {
      arr.forEach((item) => {
        // children为空则删除
        if (item.children.length === 0) {
          delete item.children;
          return;
        }
        // children不为空则继续调用handleRecurve
        this.handleRecurve(item.children);
      });
    },
    // 获取活动分类
    getActivityClassify() {
      activityClassify("ACTIVITY_CLASSIFICATION").then((res) => {
        // 删除活动分类树中children为空的属性
        this.handleRecurve(res.data.data.data);
        this.activityClassifyArr = res.data.data.data;
        console.log("活动分类", this.activityClassifyArr);
      });
    },
    // 获取活动类型
    getActivityType() {
      activityType("qms_activity_type").then((res) => {
        console.log("活动类型", res);
        this.activityTypeArr = res.data.data.dictItemList;
      });
    },
    // 获取城市树
    getCityTree() {
      cityTree().then((res) => {
        // 删除城市树中children为空的属性
        this.handleRecurve(res.data.data[0].children);
        this.holdAddressArr = res.data.data[0].children;
        console.log("城市树", res);
      });
    },
    // 获取海报数据
    getPosters() {
      posters().then((res) => {
        if (res.data.code !== 0) {
          this.$message.error("获取海报图库失败!");
        }
        this.posterArr = res.data.data.data;
      });
    },
    // 获取标签页
    getTagsPage() {
      tagsPage().then((res) => {
        console.log("标签页", res);
        res.data.data.records.forEach((item) => {
          this.allTagArr.push({
            label: item.tagId,
            value: item.name,
          });
        });
        // this.allTagArr = res.data.data.records;
      });
    },
    // 展示海报图库
    showPosters() {
      this.getPosters();
      this.dialogPostersVisible = true;
    },
    // 选择海报图库海报
    selectPoster(item) {
      console.log(item);
      this.baseFormData.poster = item.posterUrl;
      this.dialogPostersVisible = false;
    },
    // 海报上传成功回调
    handlePosterSuccess(res) {
      console.log("海报上传成功回调", res);
      if (res.code !== 0) {
        this.$message.error("上传海报失败!");
      }
      this.baseFormData.poster = res.data.data.url;
    },

    // 新增票种
    addTic() {},

    // 返回输入建议
    querySearch(queryString, cb) {
      console.log("输入的值:", queryString);
      let results = [];

      // 未输入
      if (!queryString) {
        results = this.allTagArr;
        console.log("无值", results);
        cb(results);
        return;
      }
      // 输入有值
      results = this.allTagArr.filter((item) => {
        // console.log(item)
        return (
          //返回 有数据的项
          item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      });
      console.log("有值", results);
      cb(results);
    },

    // 选择活动标签
    handleTagValFn() {
      console.log("enter", this.actInpVal);
      this.baseFormData.label.push(this.actInpVal);
      this.actInpVal = "";
      this.haveInputVal = false;
    },
    // 删除活动标签
    handleClose(tag) {
      console.log(tag);
    },
    // 活动附件上传成功的钩子
    handleAccessorySuccess(res) {
      console.log("活动附件上传成功", res);
      this.fileList.push({
        name: res.data.data.fileName,
        url: res.data.data.url,
      });
      this.baseFormData.fileList = this.fileList;
      console.log("fileList", this.fileList);
    },
    // 发布活动
    publish() {
      // 保存时将支付方式列表清空并重新
      this.setTicketData.payMethodList = [];
      if (this.priceType.includes("能贝")) {
        this.setTicketData.payMethodList.push(this.payWeCanPay);
      }
      if (this.priceType.includes("人民币")) {
        this.setTicketData.payMethodList.push(this.payOfflinePay);
      }

      this.baseFormData.ticketingManagements.push(this.setTicketData);
      this.baseFormData.details = this.quillContent.content;

      console.log("params", { ...this.baseFormData, ...this.setTicketData });

      savePublish(this.baseFormData).then((res) => {
        console.log("发布", res);
        if (res.data.code !== 0) {
          this.$message.error("发布活动失败！");
        }
        this.$$message.success("发布活动成功！");
      });
    },
    // 取消
    cancel() {},
    // 保存草稿
    saveManuscript() {
      console.log("payMethodList", this.setTicketData.payMethodList);
    },
    // 监听所属城市改变
    handleChangeCity(val) {
      console.log("所属城市改变", val);
    },
    // 监听举办地址改变
    handleChangeHoldAddress(val) {
      console.log("活动地址改变", val);
    },

    // 监听活动分类改变
    handleChangeActivityClassify(val) {
      console.log("活动分类改变", val);
      this.baseFormData.classification = val[0];
      this.baseFormData.subClassification = val[1];
    },
    // 移入
    mouseOver() {
      this.showDelete = true;
    },
    // 移出
    mouseLeave() {
      this.showDelete = false;
    },
    changeTicketingType(val) {},
  },

  created() {
    this.getActivityClassify();
    this.getCityTree();
    this.getActivityType();
    this.getTagsPage();
  },
};
</script>

<style lang="scss" scoped>
.title {
  padding-bottom: 5px;
  font-size: 18px;
  font-weight: 400;
}
.poster-box {
  width: 400px;
  height: 240px;
  border: 1px solid #ccc;
  margin-top: 20px;
  border-radius: 5px;
  position: relative;

  .mengcheng {
    background: rgba(244, 245, 246, 0.8);
    width: 100%;
    height: 100%;
    border-radius: 5px;
    position: absolute;
    z-index: 100;
    top: 0;
    left: 0;
    text-align: center;
    line-height: 240px;
    .el-icon-delete {
      font-size: 30px;
    }
  }
  .noImage {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f4f5f6;
    height: 100%;
    border-radius: 5px;
    color: #919397;
    .el-icon-picture {
      font-size: 40px;
    }
    .picSuggest {
      margin-top: 20px;
    }
  }
}
.addressbox {
  display: flex;
}
.posterInpBox {
  display: flex;
  .upload-demo {
    margin-right: 15px;
  }
}
::v-deep .el-dialog__body {
  overflow: hidden;
  height: 500px;
  overflow-y: auto;
}
.posterBox {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: auto;
  width: auto;
  grid-gap: 10px;
  margin: auto;
  .item {
    height: 186px;
    text-align: center;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.elcheck {
  margin-right: 60px;
}
</style>