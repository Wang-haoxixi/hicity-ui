<template>
  <basic-container>
    <hc-table-form title="广告管理">
      <hc-crud ref="hcCrud" :option="tableOption" :fetchListFun="fetchListFun">
        <template v-slot:menuLeft>
          <el-button
            @click="handleAdd"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            >新增</el-button
          >
        </template>
        <template v-slot:imageUrl="scope">
          <div class="picbox">
            <img :src="scope.row.imageUrl" class="pic" />
          </div>
        </template>

        <template v-slot:menu="scope">
          <template v-if="scope.row.authority">
            <el-button size="mini" type="text" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button size="mini" type="text" @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </template>
      </hc-crud>
    </hc-table-form>
    <!-- 广告新增 -->
    <el-dialog
      title="广告新增"
      :visible.sync="dialogFormVisible"
      @close="dialogFormVisibleClose"
    >
      <el-form :model="form" ref="ruleAddForm" :rules="ruleForm">
        <!-- 城市 -->
        <el-form-item
          required
          label="城市 :"
          prop="cityId"
          :label-width="formLabelWidth"
        >
          <hc-city-select
            :single="true"
            v-model="form.cityId"
            :city-id="userInfo.manageCityId"
          ></hc-city-select>
        </el-form-item>
        <!-- 广告位 -->
        <el-form-item
          label="广告位 :"
          prop="adslotId"
          :label-width="formLabelWidth"
        >
          <el-select v-model="form.adslotId" placeholder="请选择广告位">
            <el-option
              v-for="(item, index) in adslotGroup"
              :key="index"
              :label="item.adslotName"
              :value="item.adslotId"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 广告名称 -->
        <el-form-item
          label="广告名称 :"
          prop="adName"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.adName" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 开始时间 -->
        <el-form-item
          label="开始时间 :"
          prop="beginDate"
          :label-width="formLabelWidth"
        >
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="form.beginDate"
            type="datetime"
            placeholder="选择日期时间"
            :picker-options="pickerOptionsBeginDate"
          >
          </el-date-picker>
        </el-form-item>

        <!-- 结束时间 -->
        <el-form-item
          label="结束时间 :"
          prop="endDate"
          :label-width="formLabelWidth"
        >
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="form.endDate"
            type="datetime"
            placeholder="选择日期时间"
            :picker-options="pickerOptionsEndDate"
          >
          </el-date-picker>
        </el-form-item>

        <!-- 广告类型 -->
        <el-form-item
          label="广告类型 :"
          prop="type"
          :label-width="formLabelWidth"
        >
          <el-select
            @change="typeChange"
            v-model="form.type"
            placeholder="请选择广告类型"
          >
            <el-option
              v-for="(item, index) in adType"
              :key="index"
              :label="item.description"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="form.type  && form.type!='false'"
          label="跳转对象 :"
          prop="jumpType"
          :label-width="formLabelWidth"
          class="jump-item"
        >
          <div class="jump-name" v-if="jumpName !== ''">{{ jumpName }}</div>
          <el-button
            class="jump-btn"
            type="primary"
            size="mini"
            round
            plain
            @click="handleSelectJump()"
            >选择跳转对象</el-button
          >
        </el-form-item>

        <!-- 广告文字 -->
        <el-form-item
          label="广告文字 :"
          prop="text"
          :label-width="formLabelWidth"
        >
          <el-input type="textarea" v-model="form.text"></el-input>
        </el-form-item>

        <!-- 广告图片 -->
        <el-form-item label="广告图片 :" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            :action="baseUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :headers="headersOpt"
            :before-upload="onBeforeUpload"
            accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PNG,.GIF,.BMP"
          >
            <img v-if="imageUrl" :src="form.imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <!-- 排序 -->
        <el-form-item label="排序 :" prop="seq" :label-width="formLabelWidth">
          <el-input-number
            v-model="form.seq"
            controls-position="right"
            :min="1"
            :max="100"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="formLoading" @click="submit"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 广告编辑 -->
    <el-dialog
      title="广告编辑"
      :visible.sync="dialogEditFormVisible"
      @close="dialogEditFormVisibleClose"
    >
      <el-form :model="editForm" ref="ruleEditForm" :rules="ruleForm">
        <!-- 城市 -->
        <el-form-item
          required
          prop="cityId"
          label="城市 :"
          :label-width="formLabelWidth"
        >
          <hc-city-select
            :single="true"
            v-model="editForm.cityId"
            :city-id="userInfo.manageCityId"
          ></hc-city-select>
        </el-form-item>
        <!-- 广告位 -->
        <el-form-item
          label="广告位 :"
          prop="adslotId"
          :label-width="formLabelWidth"
        >
          <el-select v-model="editForm.adslotId" placeholder="请选择广告位">
            <el-option
              v-for="(item, index) in adslotGroup"
              :key="index"
              :label="item.adslotName"
              :value="item.adslotId"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 广告名称 -->
        <el-form-item
          label="广告名称 :"
          prop="adName"
          :label-width="formLabelWidth"
        >
          <el-input v-model="editForm.adName" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 开始时间 -->
        <el-form-item
          label="开始时间 :"
          prop="beginDate"
          :label-width="formLabelWidth"
        >
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="editForm.beginDate"
            type="datetime"
            placeholder="选择日期时间"
            :picker-options="pickerOptionsEditBeginDate"
          >
          </el-date-picker>
        </el-form-item>

        <!-- 结束时间 -->
        <el-form-item
          label="结束时间 :"
          prop="endDate"
          :label-width="formLabelWidth"
        >
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="editForm.endDate"
            type="datetime"
            placeholder="选择日期时间"
            :picker-options="pickerOptionsEditEndDate"
          >
          </el-date-picker>
        </el-form-item>

        <!-- 广告类型 -->
        <el-form-item
          label="广告类型 :"
          prop="type"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="editForm.type"
            placeholder="请选择广告类型"
          >
            <el-option
              v-for="(item, index) in adType"
              :key="index"
              :label="item.description"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 跳转对象 -->
        <el-form-item
          v-if="editForm.type && editForm.type!='false'"
          label="跳转对象 :"
          prop="adslotName"
          :label-width="formLabelWidth"
          class="jump-item"
        >
          <div class="jump-name" v-if="jumpName">{{ jumpName }}</div>
          <el-button
            type="primary"
            size="mini"
            round
            plain
            @click="handleEditSelectJump()"
            >选择跳转对象</el-button
          >
        </el-form-item>

        <!-- 广告文字 -->
        <el-form-item
          label="广告文字 :"
          prop="text"
          :label-width="formLabelWidth"
        >
          <el-input type="textarea" v-model="editForm.text"></el-input>
        </el-form-item>

        <!-- 广告图片 -->
        <el-form-item
          label="广告图片 :"
          prop="imageUrl"
          :label-width="formLabelWidth"
        >
          <el-upload
            class="avatar-uploader"
            :action="baseUrl"
            :show-file-list="false"
            :on-success="handleEditPicSuccess"
            :headers="headersOpt"
          >
            <img v-if="imageUrl" :src="editForm.imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <!-- 排序 -->
        <el-form-item label="排序 :" prop="seq" :label-width="formLabelWidth">
          <el-input-number
            v-model="editForm.seq"
            controls-position="right"
            :min="1"
            :max="100"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="formLoading" @click="editSubmit"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 新增选择跳转对象 -->
    <el-dialog title="跳转对象" :visible.sync="jumpDialogVisible" width="50%" @closed='closeDialogAddJumpVisible'>
      <el-table
        v-if="form.type === 'activity'"
        :data="jumpObjArr"
        style="width: 100%"
        v-loading='jumpLoading'
      >
        <el-table-column prop="id" label="id" width="80"> </el-table-column>
        <el-table-column prop="name" label="跳转名称"> </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleSelectJumpName(scope.row)"
              >选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-else-if="form.type === 'travel'"
        :data="jumpObjArr"
        style="width: 100%"
        v-loading='jumpLoading'
      >
        <el-table-column prop="id" label="id" width="80"> </el-table-column>
        <el-table-column prop="travelName" label="跳转名称"> </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleSelectJumpName(scope.row)"
              >选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-else-if="form.type === 'heated_debate'"
        :data="jumpObjArr"
        style="width: 100%"
        v-loading='jumpLoading'
      >
        <el-table-column prop="heatedDebateId" label="id" width="80">
        </el-table-column>
        <el-table-column prop="title" label="跳转名称"> </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleSelectJumpName(scope.row)"
              >选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-else-if="form.type === 'news'"
        :data="jumpObjArr"
        style="width: 100%"
        v-loading='jumpLoading'
      >
        <el-table-column prop="officialColumnId" label="id" width="80">
        </el-table-column>
        <el-table-column prop="officialColumnName" label="跳转名称">
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleSelectJumpName(scope.row)"
              >选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-else-if="form.type === 'official_column'"
        :data="jumpObjArr"
        style="width: 100%"
        v-loading='jumpLoading'
      >
        <el-table-column prop="officialColumnId" label="id" width="80">
        </el-table-column>
        <el-table-column prop="officialColumnName" label="跳转名称">
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleSelectJumpName(scope.row)"
              >选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        style="text-align:right;padding-right:30px;margin-top:15px"
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
        :current-page="current1"
        :page-sizes="[10,20,30,40,50,100]"
        :page-size="size1"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total1">
      </el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="jumpDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="jumpDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 编辑选择跳转对象 -->
    <el-dialog title="跳转对象" :visible.sync="editJumpDialogVisible" width="50%">
      <el-table
        v-if="editForm.type === 'activity'"
        :data="jumpObjArr"
        style="width: 100%"
        v-loading='jumpLoading'
      >
        <el-table-column prop="id" label="id" width="80"> </el-table-column>
        <el-table-column prop="name" label="跳转名称"> </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEditSelectJumpName(scope.row)"
              >选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-else-if="editForm.type === 'travel'"
        :data="jumpObjArr"
        style="width: 100%"
        v-loading='jumpLoading'
      >
        <el-table-column prop="id" label="id" width="80"> </el-table-column>
        <el-table-column prop="travelName" label="跳转名称"> </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEditSelectJumpName(scope.row)"
              >选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-else-if="editForm.type === 'heated_debate'"
        :data="jumpObjArr"
        style="width: 100%"
        v-loading='jumpLoading'
      >
        <el-table-column prop="heatedDebateId" label="id" width="80">
        </el-table-column>
        <el-table-column prop="title" label="跳转名称"> </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEditSelectJumpName(scope.row)"
              >选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-else-if="editForm.type === 'news'"
        :data="jumpObjArr"
        style="width: 100%"
        v-loading='jumpLoading'
      >
        <el-table-column prop="officialColumnId" label="id" width="80">
        </el-table-column>
        <el-table-column prop="officialColumnName" label="跳转名称">
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEditSelectJumpName(scope.row)"
              >选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-else-if="editForm.type === 'official_column'"
        :data="jumpObjArr"
        style="width: 100%"
        v-loading='jumpLoading'
      >
        <el-table-column prop="officialColumnId" label="id" width="80">
        </el-table-column>
        <el-table-column prop="officialColumnName" label="跳转名称">
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEditSelectJumpName(scope.row)"
              >选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        style="text-align:right;padding-right:30px;margin-top:15px"
        @size-change="handleSizeChange2"
        @current-change="handleCurrentChange2"
        :current-page="current1"
        :page-sizes="[10,20,30,40,50,100]"
        :page-size="size1"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total1">
      </el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editJumpDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editJumpDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  ads,
  delAd,
  adDetails,
  getDictByType,
  activitiePage,
  travelPage,
  heated_debatePage,
  newsPage,
  official_columnPage,
  adCheckDetail,
  addAd,
  updateAd,
} from "@/api/content/ad";
import { tableOption } from "./const.js";
import { adPosition } from "@/api/content/ad-position";
import store from "@/store";
import HcEmptyData from "@/views/components/HcEmptyData/index";
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index";
import { getFileMimeType } from "@/util/file";
import { mapGetters } from "vuex";
export default {
  components: { HcEmptyData, HcCitySelect },
  computed: {
    ...mapGetters(["userType", "userInfo"]),
  },
  data() {
    return {
      tableOption: tableOption,
      imageUrl: "",
      baseUrl: "/api/admin/sys_file/oss/upload", //oss上传文件
      headersOpt: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      dialogFormVisible: false, //新增广告弹窗
      dialogEditFormVisible: false, //编辑广告弹窗
      jumpDialogVisible: false, //跳转对象弹窗
      editJumpDialogVisible: false,//编辑跳转对象弹窗
      pickerOptionsBeginDate: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      pickerOptionsEndDate: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.form.beginDate).getTime();
        },
      },

      pickerOptionsEditBeginDate: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      pickerOptionsEditEndDate: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.editForm.beginDate).getTime();
        },
      },
      // 新增广告表单
      form: {
        cityName: "", //城市名称
        cityIdList: [],

        cityId: "", //城市id

        adslotId: "", //广告位id
        adName: "", //广告名称
        beginDate: "", //开始时间
        endDate: "", //结束时间
        type: "", //广告类型
        // jumpType: "", //跳转类型
        relationId: "", //跳转对象
        text: "", //广告文字
        imageUrl: "", //广告图片
        seq: "1", //广告排序
      },
      jumpName: "",
      editForm: {}, // 编辑广告表单
      adslotGroup: [], //广告位数据
      adType: [], //广告类型数据
      jumpObjArr: [], //跳转对象数据
      editJumpObjArr: [],

      formLabelWidth: "120px",

      ruleForm: {
        cityName: [{ required: true, message: "请选择广告位" }],
        adslotId: [{ required: true, message: "请选择", trigger: "change" }],
        adName: [
          { required: true, message: "请输入广告名称", trigger: "blur" },
          { min: 2, message: "长度大于 1 个字符", trigger: "blur" },
        ],
        beginDate: [
          { required: true, message: "请选择开始时间", trigger: "change" },
        ],
        endDate: [
          { required: true, message: "请选择结束时间", trigger: "change" },
        ],
        type: [
          { required: true, message: "请选择广告类型", trigger: "change" },
        ],
        text: [{ required: true, message: "请输入广告文字", trigger: "blur" }],
      },

      formLoading: false,
      current1: 1,
      size1: 10,
      total1: 0,
      jumpLoading: false
    };
  },
  methods: {
    onBeforeUpload(file) {
      return new Promise((resolve, reject) => {
        getFileMimeType(file).then((res) => {
          if (res) {
            const isLt1M = file.size / 1024 / 1024 < 50;
            if (!isLt1M) {
              this.$message.warning("上传文件大小不能超过 50MB!");
              reject();
            } else {
              resolve(true);
            }
          } else {
            this.$message.warning("暂不支持该文件类型！");
            reject();
          }
        });
      });
    },
    // 重置新增表单
    dialogFormVisibleClose() {
      this.$refs.ruleAddForm.resetFields();
      this.imageUrl = "";
      this.form.imageUrl = "";
      this.form.seq = "1";
      this.form.cityId = "";
      this.jumpName = ''
    },
    // 重置编辑表单
    dialogEditFormVisibleClose() {
      this.$refs.ruleEditForm.resetFields();
      this.imageUrl = "";
      this.editForm.imageUrl = "";
      this.editForm.seq = "1";
      this.jumpName = ''
    },
    closeDialogAddJumpVisible(){
      this.size1 = 10
      this.current1 = 1
      this.total1 = 0
    },
    handleSizeChange1(val){
      this.size1 = val
      if (this.form.type === "activity") {
        this.getActivitiePageFn(this.form.cityId); //活动
      } else if (this.form.type === "travel") {
        this.getTravelPageFn(this.form.cityId); //城市打卡
      } else if (this.form.type === "heated_debate") {
        this.getHeated_debatePageFn(this.form.cityId); //城市热议
      } else if (this.form.type === "news") {
        this.getNewsPageFn(this.form.cityId); //城市新闻
      } else if (this.form.type === "official_column") {
        this.getOfficial_columnPageFn(this.form.cityId); //官方发布
      }
    },
    handleCurrentChange1(val){
      this.current1 = val
      if (this.form.type === "activity") {
        this.getActivitiePageFn(this.form.cityId); //活动
      } else if (this.form.type === "travel") {
        this.getTravelPageFn(this.form.cityId); //城市打卡
      } else if (this.form.type === "heated_debate") {
        this.getHeated_debatePageFn(this.form.cityId); //城市热议
      } else if (this.form.type === "news") {
        this.getNewsPageFn(this.form.cityId); //城市新闻
      } else if (this.form.type === "official_column") {
        this.getOfficial_columnPageFn(this.form.cityId); //官方发布
      }
    },
    handleSizeChange2(val){
      this.size1 = val
      if (this.editForm.type === "activity") {
        this.getActivitiePageFn(this.editForm.cityId); //活动
      } else if (this.editForm.type === "travel") {
        this.getTravelPageFn(this.editForm.cityId); //城市打卡
      } else if (this.editForm.type === "heated_debate") {
        this.getHeated_debatePageFn(this.editForm.cityId); //城市热议
      } else if (this.editForm.type === "news") {
        this.getNewsPageFn(this.editForm.cityId); //城市新闻
      } else if (this.editForm.type === "official_column") {
        this.getOfficial_columnPageFn(this.editForm.cityId); //官方发布
      }
    },
    handleCurrentChange2(val){
      this.current1 = val
      if (this.editForm.type === "activity") {
        this.getActivitiePageFn(this.editForm.cityId); //活动
      } else if (this.editForm.type === "travel") {
        this.getTravelPageFn(this.editForm.cityId); //城市打卡
      } else if (this.editForm.type === "heated_debate") {
        this.getHeated_debatePageFn(this.editForm.cityId); //城市热议
      } else if (this.editForm.type === "news") {
        this.getNewsPageFn(this.editForm.cityId); //城市新闻
      } else if (this.editForm.type === "official_column") {
        this.getOfficial_columnPageFn(this.editForm.cityId); //官方发布
      }
    },
    // 获取广告位分页
    getAdPosition() {
      adPosition().then((res) => {
        console.log('adslotName',res)
        // this.adslotGroup = res.data.data.data.records.filter((item) => {
        //   return item.authority == true;
        // });
        this.adslotGroup = res.data.data.data.records
      });
    },
    fetchListFun(params) {
      return new Promise((resolve, reject) => {
        ads(params).then((res) => {
          resolve({
            records: res.data.data.data.records,
            page: {
              total: res.data.data.data.total,
            },
          });
        });
      });
    },
    // 获取广告类型数据
    getDictByTypeFn() {
      getDictByType("ad_type").then((res) => {
        this.adType = res.data.data.data.dictItemList;
      });
    },
    // 获取活动数据
    getActivitiePageFn(cityId) {
      activitiePage({cityId: cityId,current: this.current1,
         size: this.size1}).then((res) => {
        this.jumpObjArr = res.data.data.data.records;
        this.total1 = res.data.data.data.total
        this.jumpLoading = false
      });
    },
    getTravelPageFn(cityId) {
      travelPage({ cityId: cityId,current: this.current1,
         size: this.size1,queryType: 0 }).then((res) => {
        this.jumpObjArr = res.data.data.data.records;
        this.total1 = res.data.data.data.total
        this.jumpLoading = false
      });
    },
    getHeated_debatePageFn(cityId) {
      heated_debatePage({ cityId: cityId,current: this.current1,
         size: this.size1 }).then((res) => {
        this.jumpObjArr = res.data.data.data.records;
        this.total1 = res.data.data.data.total
        this.jumpLoading = false
      });
    },
    getNewsPageFn(cityId) {
      newsPage({ cityId: cityId,current: this.current1,
         size: this.size1 }).then((res) => {
        this.jumpObjArr = res.data.data.data.records;
        this.total1 = res.data.data.data.total
        this.jumpLoading = false
      });
    },
    getOfficial_columnPageFn(cityId) {
      official_columnPage({ cityId: cityId,current: this.current1,
         size: this.size1 }).then((res) => {
        this.jumpObjArr = res.data.data.data.records;
        this.total1 = res.data.data.data.total
        this.jumpLoading = false
      });
    },
    // 新增广告
    addAdFn() {
      addAd(this.form)
        .then((res) => {
          if (res.data.code !== 0) {
            return this.$message.error("新增广告失败！");
          }
          this.$message({
            message: "新增广告成功！",
            type: "success",
          });
          this.dialogFormVisible = false;
          this.$refs.hcCrud.refresh();
        })
        .finally(() => {
          this.formLoading = false;
        });
    },
    // 编辑按钮
    handleEdit(row) {
      adCheckDetail(row.adId).then(res=>{
        this.editForm = res.data.data.data
        this.imageUrl = this.editForm.imageUrl;
        this.jumpName = this.editForm.relationName;
        this.dialogEditFormVisible = true;
      })
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.form.cityId = this.userInfo.manageCityId;
    },
    // 监听广告类型变化
    typeChange(val) {
      if (val === "activity") {
        this.getActivitiePageFn(this.form.cityId); //活动
      } else if (val === "travel") {
        this.getTravelPageFn(this.form.cityId); //城市打卡
      } else if (val === "heated_debate") {
        this.getHeated_debatePageFn(this.form.cityId); //城市热议
      } else if (val === "news") {
        this.getNewsPageFn(this.form.cityId); //城市新闻
      } else if (val === "official_column") {
        this.getOfficial_columnPageFn(this.form.cityId); //官方发布
      }else if(val === false){

      }
    },
    // 展示跳转对象dialog
    handleSelectJump() {
      this.jumpDialogVisible = true;
      this.jumpLoading = true
      if (this.form.type === "activity") {
        this.getActivitiePageFn(this.form.cityId); //活动
      } else if (this.form.type === "travel") {
        this.getTravelPageFn(this.form.cityId); //城市打卡
      } else if (this.form.type === "heated_debate") {
        this.getHeated_debatePageFn(this.form.cityId); //城市热议
      } else if (this.form.type === "news") {
        this.getNewsPageFn(this.form.cityId); //城市新闻
      } else if (this.form.type === "official_column") {
        this.getOfficial_columnPageFn(this.form.cityId); //官方发布
      }
    },
    handleEditSelectJump() {
      this.editJumpDialogVisible = true;
      this.jumpLoading = true
      if (this.editForm.type === "activity") {
        this.getActivitiePageFn(this.editForm.cityId); //活动
      } else if (this.editForm.type === "travel") {
        this.getTravelPageFn(this.editForm.cityId); //城市打卡
      } else if (this.editForm.type === "heated_debate") {
        this.getHeated_debatePageFn(this.editForm.cityId); //城市热议
      } else if (this.editForm.type === "news") {
        this.getNewsPageFn(this.editForm.cityId); //城市新闻
      } else if (this.editForm.type === "official_column") {
        this.getOfficial_columnPageFn(this.editForm.cityId); //官方发布
      }
    },
    handleSelectJumpName(row) {
      if (this.form.type === "activity") {
        this.jumpName = row.name;
        this.form.relationId = row.id;
        this.jumpDialogVisible = false;
      } else if (this.form.type === "travel") {
        this.jumpName = row.travelName;
        this.form.relationId = row.id;
        this.jumpDialogVisible = false;
      } else if (this.form.type === "heated_debate") {
        this.jumpName = row.title;
        this.form.relationId = row.heatedDebateId;
        this.jumpDialogVisible = false;
      } else if (this.form.type === "news") {
        this.jumpName = row.officialColumnName;
        this.form.relationId = row.officialColumnId;
        this.jumpDialogVisible = false;
      } else if (this.form.type === "official_column") {
        this.jumpName = row.officialColumnName;
        this.form.relationId = row.officialColumnId;
        this.jumpDialogVisible = false;
      }
    },
    handleEditSelectJumpName(row){
      if (this.editForm.type === "activity") {
        this.jumpName = row.name;
        this.editForm.relationId = row.id;
        this.editJumpDialogVisible = false;
      } else if (this.editForm.type === "travel") {
        this.jumpName = row.travelName;
        this.editForm.relationId = row.id;
        this.editJumpDialogVisible = false;
      } else if (this.editForm.type === "heated_debate") {
        this.jumpName = row.title;
        this.editForm.relationId = row.heatedDebateId;
        this.editJumpDialogVisible = false;
      } else if (this.editForm.type === "news") {
        this.jumpName = row.officialColumnName;
        this.editForm.relationId = row.officialColumnId;
        this.editJumpDialogVisible = false;
      } else if (this.editForm.type === "official_column") {
        this.jumpName = row.officialColumnName;
        this.editForm.relationId = row.officialColumnId;
        this.editJumpDialogVisible = false;
      }
    },
    // 广告编辑 提交
    editSubmit() {
      this.formLoading = true;
      this.$refs.ruleEditForm.validate((valid) => {
        if (valid) {
          updateAd(this.editForm)
            .then((res) => {
              if (res.data.code !== 0) {
                return this.$message.error("广告编辑失败！");
              }
              this.$message({
                message: "广告编辑成功！",
                type: "success",
              });
              this.dialogEditFormVisible = false;
              this.$refs.hcCrud.refresh();
            })
            .finally(() => {
              this.formLoading = false;
            });
        } else {
          this.formLoading = false;
          return this.$message.error("请填写必填信息！");
        }
      });
    },
    // 删除
    handleDelete(row) {
      this.$confirm("确定删除该广告?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delAd(row.adId).then((res) => {
            if (res.data.code !== 0) {
              return this.$message.error("广告删除失败！");
            }
            this.$message({
              message: "广告删除成功！",
              type: "success",
            });
            this.$refs.hcCrud.refresh();
          });
        })
        .catch(() => {
          this.$message("您已取消删除该广告！");
        });
    },
    // 广告新增 提交
    submit() {
      this.formLoading = true
      this.$refs.ruleAddForm.validate((valid) => {
        // 校验未通过
        if (!valid) {
          this.formLoading = false
          return this.$message.error("请填写必填信息！");
        }
        this.addAdFn();
      });
    },
    // 图片上传成功时的钩子
    handleAvatarSuccess(res) {
      this.imageUrl = res.data.data.url;
      this.form.imageUrl = res.data.data.url;
    },
    //编辑图片上传成功时的钩子
    handleEditPicSuccess(res) {
      this.imageUrl = res.data.data.url;
      this.editForm.imageUrl = res.data.data.url;
    },
  },
  created() {
    this.getAdPosition();
    this.getDictByTypeFn();
  },
};
</script>

<style lang="scss" scoped>
.title {
  padding-bottom: 5px;
  font-size: 18px;
  font-weight: 400;
}
.add-inp-more {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .inp-more {
    display: flex;
    .inp {
      width: 272px;
    }
    .more {
      padding: 0 12px;
      margin-left: 8px;
      height: 28px;
    }
  }
}
.paging {
  margin-top: 20px;
  text-align: right;
}
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.picbox {
  width: 180px;
  height: 40px;
  .pic {
    max-width: 100%;
    width: auto;
    height: 40px;
  }
}
.jump-name {
  display: inline-block;
  margin-right: 15px;
  max-width: 388px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.jump-item{
  ::v-deep .el-form-item__content{
    display: flex;
  }
}
</style>
