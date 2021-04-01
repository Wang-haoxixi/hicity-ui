<template>
  <div>
    <basic-container>
      <div class="title">
        <div>基本信息</div>
        <el-button @click="backClick">返回</el-button>
      </div>
      <el-form
        class="elForm"
        ref="baseFormDataRef"
        :model="baseFormData"
        :rules="baseFormDataRules"
        label-width="120px"
      >
        <!-- 所属城市 -->
        <el-form-item
          prop="cityIdList"
          v-if="
            baseFormData.source
              ? userType != 3 && userType == baseFormData.source
              : userType == 1 || userType == 2
          "
          label="所属城市："
        >
          <el-row>
            <el-col :span="20">
              <hc-city-select
                v-model="baseFormData.cityIdList"
                :city-id="userInfo.manageCityId"
              ></hc-city-select>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 活动标题 -->
        <el-form-item prop="name" label="活动标题：">
          <el-row>
            <el-col :span="20">
              <el-input
                v-model="baseFormData.name"
                placeholder="不小于5个字，不超过40个字"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 举办时间 -->
        <el-form-item label="举办时间：" required>
          <el-col :span="6">
            <el-form-item prop="startTime">
              <el-date-picker
                value-format="yyyy-MM-dd HH:mm:ss"
                prefix-icon="el-icon-date"
                style="width: 100%"
                v-model="baseFormData.startTime"
                type="datetime"
                placeholder="选择开始日期"
                :picker-options="pickerOptionsBeginDate"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" style="text-align: center" :span="1">-</el-col>
          <el-col :span="6">
            <el-form-item prop="endTime">
              <el-date-picker
                value-format="yyyy-MM-dd HH:mm:ss"
                prefix-icon="el-icon-date"
                style="width: 100%"
                v-model="baseFormData.endTime"
                type="datetime"
                placeholder="选择结束日期"
                :picker-options="pickerOptionsEndDate"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <!-- 活动类型 -->
        <el-form-item prop="type" label="活动类型：">
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
        <el-form-item prop="poster" label="活动海报：">
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
            <div style="margin-left: 15px">
              <el-popover
                popper-class="popperName"
                ref="popoverPoster"
                placement="top"
                width="300"
                trigger="hover"
                content="精致的海报让活动锦上添花，更便于传播与吸引报名，也将提升在超能平台的推荐机会。"
              >
              </el-popover>
              <i class="el-icon-info" v-popover:popoverPoster></i>
            </div>
          </div>
          <div
            class="poster-box"
            @mouseover="mouseOver"
            @mouseleave="mouseLeave"
          >
            <!-- 删除蒙层 -->
            <div class="mengcheng" v-if="showDelete">
              <i class="el-icon-delete" @click="deletePoster"></i>
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
        <!-- <el-form-item prop="cityId" label="活动地址："> -->
        <el-form-item label="活动地址：" required>
          <div class="addressbox">
            <div v-if="!baseFormData.onLine" class="addressItem">
              <el-form-item prop="cityId">
                <!-- 举办地 -->
                <el-cascader
                  placeholder="请选择举办地"
                  v-model="baseFormData.cityId"
                  :options="holdAddressArr"
                  :props="defaultCityTreeParams"
                ></el-cascader>
              </el-form-item>
              <el-form-item prop="field">
                <!-- 活动地址 -->
                <el-input
                  style="width: 600px; margin: 0 10px"
                  v-model="baseFormData.field"
                  placeholder="请输入活动地址"
                ></el-input>
              </el-form-item>
            </div>
            <el-checkbox v-model="baseFormData.onLine" class="checkbox">线上举办</el-checkbox>
          </div>
        </el-form-item>
        <!-- 活动分类 -->
        <el-form-item prop="classification" label="活动分类：">
          <el-cascader
            @change="changeClassification"
            v-model="classification"
            :options="activityClassifyArr"
            :props="defaultActivityClassifyParams"
          ></el-cascader>
        </el-form-item>
        <!-- 活动标签 -->
        <el-form-item prop="label" label="活动标签：">
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
            @click="editTag"
            class="el-icon-edit"
            >编辑</el-button
          >
          <!-- 填写标签 -->
          <el-autocomplete
            ref="autocompleteRef"
            @keyup.enter.native="handleTagValFn"
            size="small"
            v-if="haveInputVal"
            v-model="actInpVal"
            :fetch-suggestions="querySearch"
            @select="handleTagValFn"
            @blur="handleBlur"
          ></el-autocomplete>
        </el-form-item>
        <!-- 活动亮点 -->
        <el-form-item prop="spot" label="活动亮点：">
          <el-row>
            <el-col :span="20">
              <el-input
                :rows="4"
                placeholder="请填写几句活动核心亮点，便于分享摘要以及百度等搜索引擎搜索（150个字）"
                type="textarea"
                v-model="baseFormData.spot"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 活动详情 -->
        <el-form-item prop="details" label="活动详情：">
          <hc-quill
            v-model="quillContent"
            v-if="!$route.query.id || contentShow"
          ></hc-quill>
        </el-form-item>
        <!-- 活动附件 -->
        <el-form-item label="活动附件：">
          <el-upload
            class="upload-demo"
            :limit="3"
            :action="uploadPicUrl"
            :file-list="fileList"
            :headers="headersOpt"
            :on-success="handleAccessorySuccess"
            :on-remove="handleAccessoryRemove"
          >
            <el-button size="small">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 设置票种 -->
      <el-form v-if="!$route.query.id || statusFlag == '0'" label-width="120px">
        <el-form-item label="设置票种：">
          <el-button @click="addTic" type="danger" plain>新增</el-button>
          <el-card
            v-for="(item, i) in baseFormData.ticketingManagements"
            :key="i"
            class="box-card"
            :body-style="cardStyle"
          >
            <div style="position: relative;">
              <!-- 设置票种表单 -->
              <el-form
                ref="setTicketDataRef"
                :model="item"
                :rules="setTicketDataRules"
              >
                <el-row>
                  <el-col :span="8">
                    <!-- 票务种类 -->
                    <el-form-item
                      label="票务种类："
                      label-width="100"
                      prop="ticketingType"
                    >
                      <el-select
                        v-model="item.ticketingType"
                        placeholder="请选择票务种类"
                      >
                        <el-option label="免费票" value="1"></el-option>
                        <el-option label="付费票" value="2"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item
                      label="票务名称："
                      label-width="100"
                      prop="ticketingName"
                    >
                      <el-input
                        style="width: 300px"
                        v-model="item.ticketingName"
                        placeholder="如早餐票、普通票、VIP票"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row style="margin: 15px 0">
                  <el-col :span="8">
                    <el-form-item
                      label="票种数量："
                      label-width="100"
                      prop="number"
                    >
                      <el-input-number
                        v-model="item.number"
                        :min="1"
                      ></el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      label="单次购票数量："
                      label-width="100"
                      prop="limitTicket"
                    >
                      <el-input-number
                        v-model="item.limitTicket"
                        :min="1"
                      ></el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <!-- <el-form-item
                      v-if="item.ticketingType === '1'"
                      label="票种审核："
                      label-width="100"
                    >
                      <el-switch
                        v-model="item.needAudit"
                        active-color="#13ce66"
                        inactive-color="#cccccc"
                      >
                      </el-switch>
                    </el-form-item> -->
                    <el-form-item
                      v-if="item.ticketingType === '2'"
                      label="允许退票："
                      label-width="100"
                    >
                      <el-switch
                        v-model="item.allowedRefund"
                        active-color="#13ce66"
                        inactive-color="#cccccc"
                      >
                      </el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- 票务金额 付费票时显示 ticketingType:1不显示2显示  -->
                <el-form-item
                  style="margin-bottom: 15px"
                  required
                  label="票务金额："
                  v-if="item.ticketingType === '2'"
                >
                  <!-- <el-checkbox-group v-model="item.priceType" class="checkGroup"> -->
                    <!-- priceType是否包含已选类目且长度为1 -->
                    <!-- <el-checkbox
                      label="能贝"
                      name="nb"
                      class="elcheck"
                      :disabled="
                        item.priceType.includes('能贝') &&
                        item.priceType.length == 1
                          ? true
                          : false
                      "
                    >
                      能贝：
                      <el-input
                        v-model="item.payWeCanPay.amount"
                        :disabled="
                          item.priceType.includes('能贝') &&
                          item.priceType.length == 1
                            ? true
                            : false
                        "
                      ></el-input>
                    </el-checkbox> -->
                    <!-- <el-checkbox
                      label="人民币"
                      name="rmb"
                      :disabled="
                        item.priceType.includes('人民币') &&
                        item.priceType.length == 1
                          ? true
                          : false
                      "
                    >
                      人民币：
                      <el-input
                        v-model="item.payOfflinePay.amount"
                        :disabled="
                          item.priceType.includes('人民币') &&
                          item.priceType.length == 1
                            ? true
                            : false
                        "
                      ></el-input>
                    </el-checkbox>
                  </el-checkbox-group> -->
                  <el-input style="width: 200px;" v-model="item.payOfflinePay.amount" @blur="priceChange(item.payOfflinePay)">
                    <div slot="append">元</div>
                  </el-input>
                </el-form-item>
                <el-row style="padding-left:10px">
                  <el-col>
                    <el-form-item
                      label="票种备注："
                      label-width="200"
                    >
                      <el-input
                        style="width: 650px"
                        placeholder="请输入备注内容"
                        maxlength="100"
                        show-word-limit
                        type="textarea"
                        v-model="item.remarks"
                        :rows="4"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <div class="more-options">其他内容</div>
                <div class="option-box">
                  <el-button @click="handleAddTicketOption(item,itemBtn)" v-for="(itemBtn,indexBtn) in item.ticketCustomForm" :key="indexBtn" type="danger" plain :title="'添加'+ itemBtn.typename">{{itemBtn.typename}}</el-button>
                </div>
                <div class="custom-box">
                  <div v-for="(itemP,indexP) in item.conferenceFormDTOList" :key="indexP">
                    <div class="item">
                      <el-checkbox v-model="itemP.must">必填</el-checkbox>
                      <el-input :placeholder="itemP.typename" v-model="itemP.label"></el-input>
                      <i class="el-icon-remove" title="删除" @click="handleDeleteItem(item,indexP)"></i>
                    </div>
                    <div class="option-list">
                      <div>选项列表</div>
                      <div class="list" v-for="(itemO,indexO) in itemP.optionsList" :key="indexO">
                        <div style="display:flex;align-items: center;">
                          <el-input v-model="itemO.label" placeholder="请输入选项名称" style="width:400px"></el-input>
                          <el-button v-if="!itemO.value" type="primary" round plain @click="showJumpDialog(itemO)" style="margin-left:10px;">选择跳转对象</el-button>
                          <div style="flex:1;text-overflow: ellipsis;white-space:nowrap;overflow:hidden;margin-top: 10px;margin-left:10px">{{itemO.offcialName}}</div>
                          <i v-if="itemO.value" class="el-icon-edit-outline" style="margin-top:10px;" title="修改跳转对象" @click="editJump(itemO)"></i>
                          <i class="el-icon-remove" style="margin-top:10px;" title="删除该选项" @click="handleDeteleItemO(itemP,indexO)"></i>
                        </div>
                      </div>
                      <el-button icon="el-icon-plus" size="mini" @click="handleAddOption(itemP)" style="margin-top:10px"></el-button>
                    </div>
                  </div>
                </div>
              </el-form>
              <i class="icon-ticket-remove el-icon-delete" @click="removeTicket(i)"></i>
            </div>
          </el-card>
        </el-form-item>
      </el-form>
      <div class="form-collect">报名表单收集：</div>
      <div class="tips" @click="toFormCollect" v-if="!showFormCollect">
        <i class="el-icon-plus"></i>
        如果您需要收集参与者的必要信息，请添加；若没有则跳过
      </div>
      <div class="form-card" v-else>
        <!-- 默认选项 -->
        <div class="default-options">
          <div>
            <div class="item" v-for="(item, index) in systemopt" :key="index">
              <el-checkbox v-model="item.must" :disabled="item.isDisabled"
                >必填</el-checkbox
              >
              {{ item.label }}
            </div>
            <div class="item" v-for="(item, i) in defaultList" :key="'item2'+i">
              <el-checkbox v-model="item.must"
                >必填</el-checkbox
              >
              {{ item.label }}
            </div>
          </div>
          <div class="general-box">
            <div>常规项</div>
            <div class="choose-box">
              <el-button
                @click="handleSwitch(item)"
                type="danger"
                plain
                v-for="(item, index) in defaultOptions.slice(2)"
                :key="index"
                >{{ item.label }}</el-button
              >
            </div>
          </div>
        </div>
        <div class="more-options">更多选项</div>
        <div class="option-box">
          <el-button @click="handleAdd(item)" v-for="(item,index) in customForm" :key="index" type="danger" plain :title="'添加'+ item.typename">{{item.typename}}</el-button>
        </div>
        <div class="custom-box">
          <div v-for="(item,index) in customList" :key="index">
            <div class="item" >
              <el-checkbox v-model="item.must">必填</el-checkbox>
              <el-input :placeholder="item.typename" v-model="item.label"></el-input>
              <i class="el-icon-remove" title="删除" @click="handleDelete(index)"></i>
            </div>
            <div class="option-list" v-if="item.optionsList == [] || item.optionsList">
              <div>选项列表</div>
              <div class="list">
                <el-tag class="tagitem" closable v-for="(tag,i) in item.optionsList" :key="i" @close="handleCloseOption(item,tag,i)">{{tag.label}}</el-tag>
                <el-input ref="saveTagInput" @keyup.enter.native="handleSaveTag(item,index)" @blur="handleSaveTag(item,index)" v-if="item.isInput" v-model="item.inputValue" style="width:150px" size="mini"></el-input>
                <el-button v-else icon="el-icon-plus" size="mini" @click="showInput(item,index)"></el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-btn">
        <!-- this.$route.query.id是否有参数传递过来,没有参数说明走新建,否则走编辑   -->
        <el-button v-if="!this.$route.query.id" :loading="formLoading" @click="publish" type="danger"
          >发布活动</el-button
        >
        <el-button v-else @click="editSave" :loading="formLoading" type="danger">发布活动</el-button>
        <el-button v-if="!this.$route.query.id" :loading="formLoading" @click="saveManuscript"
          >保存草稿</el-button
        >
        <el-button v-else-if="statusFlag != '1'" :loading="formLoading" @click="saveManuscriptUpdate">保存草稿</el-button>
        <el-button @click="backClick">取消</el-button>
      </div>
      <!-- 海报弹窗 -->
      <el-dialog
        class="dialogPostersVisible"
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
      <!-- 选择跳转对象 -->
      <el-dialog
        :visible.sync="dialogJumpVisible"
        width="70%"
        class="jump"
        @close='closeDialogJumpVisible'
      >
        <el-form ref="jumpTypeFormRef" :model="jumpTypeForm" label-width="100px">
          <el-form-item label="跳转类型：">
            <el-select v-model="jumpTypeForm.type" placeholder="请选择跳转类型" style="width:250px">
              <el-option label="官方发布" value="officialRelease"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="跳转对象：">
            <div style="display:flex;justify-content: space-between;">
              <div style="width:600px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{jumpTypeForm.officialNewsName}}</div>
              <el-input
                placeholder="查询跳转对象"
                clearable
                style="width:200px"
                v-model="officialTitleValue"
                @input='officialTitleValueChange'
                @clear='clearOfficialTitleValue'
                >
              </el-input>
            </div>
            <el-table :data="officialReleaseData" style="margin-top:20px" stripe :header-cell-style="{ background: '#F5F7FA' }">
              <el-table-column property="officialNewsName" label="标题" width="800px"></el-table-column>
              <el-table-column label="操作" width="80px">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    @click="selectJumpTitle(scope.row)"
                  >选择</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <!-- 分页 -->
          <el-pagination
            background
            style="text-align:right;padding-right:30px"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryOfficial.current"
            :page-sizes="[10,20,30,40,50,100]"
            :page-size="queryOfficial.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogJumpVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSaveSelect">确 定</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>
<script>
import store from "@/store";
import {dateFormat} from "@/util/date.js";
import HcQuill from "@/views/components/HcQuill";
import HcCitySelect from "@/views/components/HcCity/HcCitySelect/index";
import { mapGetters } from "vuex";
import {
  activityClassify,
  cityTree,
  posters,
  activityType,
  tagsPage,
  savePublish,
  activityInfo,
  editSaveActivity,
  officialReleaseList
} from "@/api/activity/publish";
import { Loading } from "element-ui";
export default {
  components: { HcQuill, HcCitySelect },
  data() {
    return {
      formLoading: false,
      isInput:false,
      showFormCollect:false,
      defaultList: [],
      jumpTypeForm:{
        type:'officialRelease',
        officialNewsName:'',
        officialNewsId:''
      },
      officialTitleValue:'',
      queryOfficial:{
        size:10,
        current:1,
        searchName:''
      },
      total:0,
      officialReleaseData:[],
      // 系统预置项
      systemopt:[
        {
          label: "姓名",
          must: true,
          type: "input",
          placeholder: "请输入姓名",
          fixedItem: true,
          code: "user_name",
          isDisabled: true,
        },
        {
          label: "手机号",
          must: true,
          type: "input",
          placeholder: "请输入手机号",
          fixedItem: true,
          code: "phone_number",
          isDisabled: true,
        },
      ],
      defaultOptions: [
        {
          label: "姓名",
          must: true,
          type: "input",
          placeholder: "请输入姓名",
          fixedItem: true,
          code: "user_name",
          isDisabled: true,
        },
        {
          label: "手机号",
          must: true,
          type: "input",
          placeholder: "请输入手机号",
          fixedItem: true,
          code: "phone_number",
          isDisabled: true,
        },
        {
          label: "邮箱",
          must: false,
          type: "input",
          placeholder: "请输入邮箱",
          fixedItem: true,
          code: "email",
        },
        {
          label: "单位",
          must: false,
          type: "input",
          placeholder: "请输入单位",
          fixedItem: true,
          code: "company",
        },
        {
          label: "职务",
          must: false,
          type: "input",
          placeholder: "请输入职务",
          fixedItem: true,
          code: "position",
        },
        {
          label: "备注",
          must: false,
          type: "textarea",
          placeholder: "请输入备注",
          fixedItem: true,
          code: "remark",
        },
      ],
      
      customList:[],
      customForm:[
        {
          "typename": '单行文本',
          "label": "",
          "value": "",
          "type": "input",
          "must": false,
          "fixedItem": false,
          "placeholder": "",
        },
        {
          "typename": '单选按钮框',
          "label": "",
          "value": "",
          "type": "radio",
          "must": false,
          "fixedItem": false,
          "placeholder": "",
          "optionsList": [],
          "isInput":false,
          "inputValue": ""
        },
        {
          "typename": '多选按钮框',
          "label": "",
          "value": "",
          "type": "checkbox",
          "must": false,
          "fixedItem": false,
          "placeholder": "",
          "optionsList": [],
          "isInput":false,
          "inputValue": ""
        },
        {
          "typename": '多行文本',
          "label": "",
          "value": "",
          "type": "textarea",
          "must": false,
          "fixedItem": false,
          "placeholder": "",
        }
      ],
      checkedList: false,

      cardStyle: {
        border: "1px solid #eff0f1",
        "border-radius": "10px",
        "margin-top": "20px",
      },
      // 控制富文本显示隐藏
      contentShow: false,
      headersOpt: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      // 上传图片路径
      uploadPicUrl: "/api/admin/sys_file/oss/upload",
      // 活动状态
      statusFlag: "",
      baseFormDataRules: {
        cityIdList: [
          { required: true, message: "请输入城市", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入活动标题", trigger: "blur" }],
        startTime: [
          { required: true, message: "请选择开始日期", trigger: "change" },
        ],
        endTime: [
          { required: true, message: "请选择结束日期", trigger: "change" },
        ],
        type: [
          { required: true, message: "请选择活动类型", trigger: "change" },
        ],
        poster: [
          {
            validator: this.validatorPoster,
            required: true,
            trigger: "change",
          },
        ],
        cityId: [
          { required: true, message: "请选择举办地", trigger: "change" },
        ],
        field:[
          {required: true,message: '请输入活动地址',trigger: 'blur'}
        ],
        classification: [
          { required: true, message: "请选择活动分类", trigger: "change" },
        ],
        label: [
          {
            validator: this.validatorLabel,
            required: true,
            message: "请选择活动标签",
            trigger: "change",
          },
        ],
        spot: [{ required: true, message: "请输入活动亮点", trigger: "blur" }],
        details: [
          { required: true, message: "请输入活动详情", trigger: "blur" },
        ],
        // fileList: [
        //   {
        //     validator: this.validatorFileList,
        //     required: true,
        //     trigger: "change",
        //   },
        // ],
      },
      setTicketDataRules: {
        ticketingType: [
          { required: true, message: "请选择票务种类", trigger: "change" },
        ],
        ticketingName: [
          { required: true, message: "请输入票务名称", trigger: "blur" },
        ],
        number: [
          { required: true, message: "请输入票种数量", trigger: "blur" },
        ],
        limitTicket: [
          { required: true, message: "请输入购票数量", trigger: "blur" },
        ],
        // remarks: [
        //   { required: true, message: "请输入票种备注", trigger: "blur" },
        // ],
      },

      // 选择今天之后的日期
      pickerOptionsBeginDate: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      // 选择大于开始时间的日期
      pickerOptionsEndDate: {
        disabledDate: (time) => {
          return (
            time.getTime() < new Date(this.baseFormData.startTime).getTime()
          );
        },
      },
      // 基本信息数据
      baseFormData: {
        conferenceFormList:[],
        cityIdList: [], //所属城市
        name: "",
        startTime: "",
        endTime: "",
        type: "",
        poster: "", //海报
        cityId: [], //举办地
        field: "", //活动地址
        onLine:false,//是否线上
        classification: "", //活动父类
        subClassification: "", //活动子类
        label: [], //标签
        spot: "", //亮点
        details: "", //活动详情
        fileList: [], //附件
        //票种设置
        ticketingManagements: [
          {
            ticketingType: "1", //票务种类
            ticketingName: "免费票", //票务名称
            number: 1, //票种数量
            limitTicket: 1, //单次购票数量
            allowedRefund: false, //是否允许退款
            needAudit: false, //是否审核
            remarks: "",
            //支付方式列表
            payMethodList: [],
            // 票务金额类型数组
            priceType: ["能贝", "人民币"],
            // 能贝支付方式
            payWeCanPay: {
              type: "WeCanPay", //支付类型
              amount: 0.01, //金额
            },
            // 人民币支付方式
            payOfflinePay: {
              type: "OfflinePay", //支付类型
              amount: 0.01, //金额
            },
            conferenceFormDTOList:[],
            ticketCustomForm:[
              {
                "typename": '多选按钮框',
                "label": "",
                "value": "",
                "type": "checkbox",
                "must": false,
                "fixedItem": false,
                "placeholder": "",
                "optionsList": [],
                "isInput":false,
                "inputValue": ""
              },
            ],
          },
        ],
      },
      //活动分类
      classification: [],
      // 是否有输入标签内容
      haveInputVal: false,
      // 活动标签输入框的值
      actInpVal: "",
      // 是否编辑标签
      // isEdit: true,
      quillContent: {
        content: "",
        structuredContent: "",
      },
      // 预览活动附件
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
      dialogJumpVisible:false,//跳转链接
      // 海报图库数据
      posterArr: [],
      // 活动类型数据
      activityTypeArr: [],
      // 所有标签数据
      allTagArr: [],
      // 控制删除
      showDelete: false,
      validRst: [],
      handleItem: {
        offcialName:''
      }
    };
  },
  computed: {
    ...mapGetters(["userType", "userInfo"]),
  },
  methods: {
    priceChange (item) {
      let val = item.amount
      try {
        let price = parseFloat(val)
        if (price == 0 || isNaN(price)) {
          price = 0.01
        } else {
          price = price.toFixed(2)
        }
        item.amount = price
      } catch (e) {
        item.amount = 0.01
      }
    },
    // 返回
    backClick() {
      this.$confirm(
        "此操作将不会保存您所编辑的活动内容, 是否确认退出?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.fileList = [];
          this.baseFormData.fileList = [];
          this.$router.go(-1);
        })
        .catch(() => {});
    },
    validatorPoster(rule, value, callback) {
      if (value) {
        callback();
      } else {
        callback(new Error("请选择活动海报"));
      }
    },
    validatorLabel(rule, value, callback) {
      if (value.length != 0) {
        callback();
      } else {
        callback(new Error("请选择活动标签"));
      }
    },
    // validatorFileList(rule, value, callback) {
    //   if (value.length != 0) {
    //     callback();
    //   } else {
    //     callback(new Error("请上传活动附件"));
    //   }
    // },

    // 活动分类改变触发
    changeClassification(e) {
      this.baseFormData.classification = this.classification[0];
      this.baseFormData.subClassification = this.classification[1];
    },
    // 处理数据的递归函数
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
      });
    },
    // 获取官方发布列表
    getOfficialReleaseList(){
      officialReleaseList(this.queryOfficial).then(res=>{
        this.officialReleaseData = res.data.data.data.records
        this.total = res.data.data.data.total
      })
    },
    // 获取活动详情
    getActivityInfo(id) {
      if (!id) {
        this.baseFormData.cityIdList = [this.userInfo.manageCityId];
      } else {
        Loading.service();
        activityInfo(id)
          .then((res) => {
            if (res.data.code !== 0) {
              return this.$message.error("获取活动详情失败！");
            }
            let data = res.data.data.data;
            this.statusFlag = data.statusFlag;
            this.baseFormData.cityIdList = data.cityIdList;
            this.baseFormData.name = data.name;
            this.baseFormData.startTime = data.startTime;
            this.baseFormData.endTime = data.endTime;
            this.baseFormData.type = data.type;
            this.baseFormData.poster = data.poster;
            this.baseFormData.cityId = data.cityId;
            this.baseFormData.field = data.field;
            this.baseFormData.onLine = data.onLine;
            this.baseFormData.source = data.source;
            this.classification = [data.classification, data.subClassification];
            this.baseFormData.classification = this.classification[0];
            this.baseFormData.subClassification = this.classification[1];
            this.baseFormData.label = data.label;
            this.baseFormData.spot = data.spot;
            this.quillContent.content = data.details;
            this.contentShow = true;

            this.baseFormData.conferenceFormList = data.conferenceFormList

            this.defaultList = data.conferenceFormList.filter(item=>{
              return item.code||item.label=='备注'
            }).slice(2)
            this.customList = data.conferenceFormList.filter(item=>{
              return !item.code && item.label!=='备注'
            })
            this.customList.forEach(item=>{
              if(item.type == 'checkbox' || item.type == 'radio'){
                // item.isInput = false
                this.$set(item,'isInput',false)
                this.$set(item,'inputValue','')
              }
            })
            this.showFormCollect = true
            data.fileList.forEach((item) => {
              this.fileList.push({
                name: item.original,
                url: item.attachFile,
              });
              this.baseFormData.fileList.push({
                original: item.original,
                attachFile: item.attachFile,
              });
            });

            if (this.statusFlag == "0") {
              data.ticketingManagements.forEach((obj) => {
                obj.priceType = ["能贝", "人民币"];

                if (obj.ticketingType == "2") {
                  obj.payMethodList.forEach((payItem) => {
                    if (payItem.type == "WeCanPay") {
                      obj.payWeCanPay = {
                        type: "WeCanPay",
                        amount: payItem.amount,
                      };
                    } else if (payItem.type == "OfflinePay") {
                      obj.payOfflinePay = {
                        type: "OfflinePay",
                        amount: payItem.amount,
                      };
                    }
                  });
                  obj.payMethodList = [];
                } else {
                  obj.payWeCanPay = {
                    type: "WeCanPay",
                    amount: 0.01,
                  };
                  obj.payOfflinePay = {
                    type: "OfflinePay",
                    amount: 0.01,
                  };
                }
              });
              this.baseFormData.ticketingManagements = data.ticketingManagements;
              this.baseFormData.ticketingManagements.forEach(item=>{
                item.ticketCustomForm = [
                  {
                    "typename": '多选按钮框',
                    "label": "",
                    "value": "",
                    "type": "checkbox",
                    "must": false,
                    "fixedItem": false,
                    "placeholder": "",
                    "optionsList": [],
                    "isInput":false,
                    "inputValue": ""
                  },
                ]
                if(item.ticketingconfigList && item.ticketingconfigList.optionsList){
                  item.ticketingconfigList.optionsList.forEach(obj=>{
                    obj.offcialName = obj.name
                  })
                }
                this.$set(item,'conferenceFormDTOList', item.ticketingconfigList ? [item.ticketingconfigList] : [])
              })
            }else{
              let ticketingManagements = data.ticketingManagements
              for (let i = 0; i < ticketingManagements.length; i++) {
                ticketingManagements[i].conferenceFormDTOList = ticketingManagements[i].ticketingconfigList ? [ticketingManagements[i].ticketingconfigList] : []
              }
              this.baseFormData.ticketingManagements = data.ticketingManagements;
            }
          })
          .finally(() => {
            this.$nextTick(() => {
              Loading.service(this.options).close();
            });
          });
      }
    },
    // 获取活动类型
    getActivityType() {
      activityType("qms_activity_type").then((res) => {
        this.activityTypeArr = res.data.data.data.dictItemList;
      });
    },
    // 获取城市树
    getCityTree() {
      cityTree().then((res) => {
        // 删除城市树中children为空的属性
        this.handleRecurve(res.data.data.data[0].children);
        this.holdAddressArr = res.data.data.data[0].children;
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
        res.data.data.data.records.forEach((item) => {
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
      this.baseFormData.poster = item.posterUrl;
      this.dialogPostersVisible = false;
      this.$refs.baseFormDataRef.validateField("poster");
    },
    // 海报上传成功回调
    handlePosterSuccess(res) {
      if (res.code !== 0) {
        this.$message.error("上传海报失败!");
      }
      this.baseFormData.poster = res.data.data.url;
      this.$refs.baseFormDataRef.validateField("poster");
    },
    // 移除海报
    deletePoster() {
      this.baseFormData.poster = "";
      this.$refs.baseFormDataRef.validateField("poster");
    },

    // 新增票种
    addTic() {
      let setTicketData = {
        ticketingType: "1", //票务种类
        ticketingName: "免费票", //票务名称
        number: 1, //票种数量
        limitTicket: 1, //单次购票数量
        allowedRefund: false, //是否允许退款
        needAudit: false, //是否审核
        remarks: "",
        //支付方式列表
        payMethodList: [],
        // 票务金额类型数组
        priceType: ["能贝", "人民币"],
        // 能贝支付方式
        payWeCanPay: {
          type: "WeCanPay", //支付类型
          amount: 0.01, //金额
        },
        // 人民币支付方式
        payOfflinePay: {
          type: "OfflinePay", //支付类型
          amount: 0.01, //金额
        },

        conferenceFormDTOList:[],
        ticketCustomForm:[
          {
            "typename": '多选按钮框',
            "label": "",
            "value": "",
            "type": "checkbox",
            "must": false,
            "fixedItem": false,
            "placeholder": "",
            "optionsList": [],
            "isInput":false,
            "inputValue": ""
          },
        ],
      };
      this.baseFormData.ticketingManagements.push(setTicketData);
    },

    // 删除票务
    removeTicket (index) {
      if (this.baseFormData.ticketingManagements.length > 1) {
        this.baseFormData.ticketingManagements.splice(index, 1);
      } else {
        this.$message.info('至少需保留一张票')
      }
    },

    // 返回输入建议
    querySearch(queryString, cb) {
      let results = [];

      // 未输入
      if (!queryString) {
        results = this.allTagArr;
        cb(results);
        return;
      }
      // 输入有值
      results = this.allTagArr.filter((item) => {
        return (
          //返回 有数据的项
          item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      });
      cb(results);
    },
    handleBlur(){
      // this.actInpVal = ''
      // this.haveInputVal = false
    },
    // 选择活动标签
    handleTagValFn() {
      if(this.actInpVal==''){
        this.haveInputVal = false;
        return
      }
      this.baseFormData.label.push(this.actInpVal);
      this.actInpVal = "";
      this.haveInputVal = false;
      this.$refs.baseFormDataRef.validateField("label");
    },
    // 删除活动标签
    handleClose(tag) {
      this.baseFormData.label.splice(this.baseFormData.label.indexOf(tag), 1);
      this.$refs.baseFormDataRef.validateField("label");
    },
    editTag(){
      this.haveInputVal = true
      this.$nextTick(_=>{
        this.$refs.autocompleteRef.focus()
      })
    },
    // 活动附件上传成功的钩子
    handleAccessorySuccess(res, file) {
      this.baseFormData.fileList.push({
        original: file.name,
        attachFile: file.response.data.data.url,
      });
      // this.$refs.baseFormDataRef.validateField("fileList");
    },
    // 活动附件移除
    handleAccessoryRemove(file, fileList) {
      this.fileList.forEach((item, i) => {
        if (file.name === item.name) {
          this.fileList.splice(i, 1);
        }
      });
      this.baseFormData.fileList.forEach((item, i) => {
        if (file.name === item.original) {
          this.baseFormData.fileList.splice(i, 1);
        }
      });
      // this.$refs.baseFormDataRef.validateField("fileList");
    },
    onChange(res) {},
    toFormCollect(){
      this.showFormCollect = true
      // this.defaultList = this.systemopt
    },
    handleSwitch(item) {
      let i = this.defaultList.findIndex(m=> item.label == m.label && item.type == m.type)
      if(i == -1){
        this.defaultList.push(item)
      }else{
        this.defaultList.splice(i,1)
      }
    },
    handleAdd(item){
      if (this.customList.length>=10) {
        this.$message.warning("自定义项最多可以添加10条");
        return;
      }
      this.customList.push(JSON.parse(JSON.stringify(item)));
    },
    handleDelete(index){
      this.customList.splice(index, 1);
    },
    // 删除标签
    handleCloseOption(item,tag,i){
      item.optionsList.splice(i,1)
    },
    showInput(item,index){
      if(item.optionsList && item.optionsList.length>=30){
        return this.$message.warning('子项最多可以添加30条')
      }
      this.customList.forEach((m,i)=>{
        if(i==index){
          m.isInput = true
        }
      })
      this.$nextTick(_ => this.$refs.saveTagInput[0].focus());
    },
    // 添加标签
    handleSaveTag(item,index){
      if(item.inputValue==''){
        item.isInput = false
        return
      }
      // 此处判断标签数组中是否与输入值一致，若一致返回true
      let rst =  item.optionsList.some(tagItem=>{
        return tagItem.label == item.inputValue
      })
      if(rst){
        return this.$message.warning('选项已存在')
      }
      let num = item.optionsList.length
      let opt = {
        label: item.inputValue,
        select: false,
        value: num + 1
      }
      item.optionsList.push(opt)
      item.inputValue = ''
      item.isInput = false
    },
    handleAddTicketOption(item,itemBtn){
      if(item.conferenceFormDTOList.length>=1){
        return this.$message.warning('只能添加一条')
      }
      item.conferenceFormDTOList.push(JSON.parse(JSON.stringify(itemBtn)))
    },
    handleAddOption(item){
      if(item.optionsList&&item.optionsList.length>=10){
        return this.$message.warning('子项最多可以添加10条')
      }
      item.optionsList.push({
        label:'',
        type:'',
        offcialName:'',
        value:'',
        link:false,
      })
    },
    handleDeleteItem(item,index){//父项删除
      // item.conferenceFormDTOList.splice(index, 1);
      item.conferenceFormDTOList = []
    },
    handleDeteleItemO(item,indexO){//子项删除
      item.optionsList.splice(indexO,1)
    },
    showJumpDialog(item){
      this.getOfficialReleaseList()
      this.handleItem = item
      this.dialogJumpVisible = true
    },
    editJump(item){
      this.handleItem = item
      this.dialogJumpVisible = true
      this.getOfficialReleaseList()
      this.jumpTypeForm.type = item.type
      this.jumpTypeForm.officialNewsName = item.offcialName
      this.jumpTypeForm.officialNewsId = item.value
    },
    handleSaveSelect(){
      this.handleItem.type = this.jumpTypeForm.type
      this.handleItem.offcialName = this.jumpTypeForm.officialNewsName
      this.handleItem.value = this.jumpTypeForm.officialNewsId
      this.dialogJumpVisible = false
      if(this.handleItem.value && this.handleItem.type){
        this.handleItem.link = true
      }
    },
    selectJumpTitle(row){
      this.jumpTypeForm.officialNewsName = row.officialNewsName
      this.jumpTypeForm.officialNewsId = row.officialNewsId
    },
    officialTitleValueChange(e){
      this.queryOfficial.searchName = e
      this.getOfficialReleaseList()
    },
    clearOfficialTitleValue(){
      this.queryOfficial.searchName = ''
      this.getOfficialReleaseList()
    },
    closeDialogJumpVisible(){
      this.queryOfficial = {
        size:10,
        current:1,
        searchName:''
      }
      this.jumpTypeForm={
        type:'officialRelease',
        officialNewsName:'',
        officialNewsId:''
      }
    },
    handleCurrentChange(val){
      this.queryOfficial.current = val
      this.getOfficialReleaseList()
    },
    handleSizeChange(val){
      this.queryOfficial.size = val
      this.getOfficialReleaseList()
    },
    // 编辑 - 发布活动1
    editSave() {
      this.formLoading = true
      let that = this;
      this.baseFormData.details = this.quillContent.content;

      // 遍历票种数组
      this.baseFormData.ticketingManagements.forEach((item) => {
        item.payMethodList = []
        // 保存时将支付方式列表清空并重新
        if (item.ticketingType == '2') {
          item.payMethodList.push(item.payOfflinePay);
        }
      });
      // delete this.baseFormData.ticketingManagements
      this.baseFormData.submitType = 1;
      this.baseFormData.id = this.$route.query.id;
      this.customList.forEach(item=>{
        if(item.type == 'input' || item.type == 'textarea'){
          item.placeholder = "请输入" + item.label
        }else if(item.type == 'radio' || item.type == 'checkbox'){
          item.placeholder = "请选择" + item.label
        }
      })
      this.baseFormData.conferenceFormList = [...this.defaultList,...this.customList]

      this.$refs.baseFormDataRef.validate((valid1) => {
        // 状态不为草稿
        if (this.statusFlag != "0") {
          if (valid1) {
            editSaveActivity(this.baseFormData).then((res) => {
              if (res.data.code !== 0) {
                return this.$message.error("编辑活动失败");
              }
              this.$message.success("编辑活动成功");
              this.fileList = [];
              this.baseFormData.fileList = [];
              this.defaultList = []
              this.$router.go(-1);
            }).finally(() => {
              this.formLoading = false
            });
          } else {
            this.formLoading = false
            this.$message.error("活动信息填写不完整");
            this.validRst = [];
            this.defaultList = []
          }
          return;
        }
        this.$refs.setTicketDataRef.forEach((item) => {
          item.validate((valid2) => {
            that.validRst.push(valid2);
            return false;
          });
        });
        if (!this.validRst.includes(false) && valid1) {
          editSaveActivity(this.baseFormData).then((res) => {
            if (res.data.code !== 0) {
              return this.$message.error("编辑活动失败");
            }
            this.$message.success("编辑活动成功");
            this.fileList = [];
            this.baseFormData.fileList = [];
            this.$router.go(-1);
          }).finally(() => {
            this.formLoading = false
          });
        } else {
          this.$message.error("活动信息填写不完整");
          this.validRst = [];
          this.formLoading = false
        }
      });
    },
    // 新增 - 发布活动
    publish() {
      this.formLoading = true
      let that = this;
      this.baseFormData.details = this.quillContent.content;
      // 遍历票种数组
      this.baseFormData.ticketingManagements.forEach((item) => {
        item.payMethodList = []
        // 保存时将支付方式列表清空并重新
        if (item.ticketingType == '2') {
          item.payMethodList.push(item.payOfflinePay);
        }
      });

      this.baseFormData.submitType = 1;
      this.customList.forEach(item=>{
        if(item.type == 'input' || item.type == 'textarea'){
          item.placeholder = "请输入" + item.label
        }else if(item.type == 'radio' || item.type == 'checkbox'){
          item.placeholder = "请选择" + item.label
        }
      })
      this.baseFormData.conferenceFormList = [...this.defaultList,...this.customList]
      this.$refs.baseFormDataRef.validate((valid1) => {
        this.$refs.setTicketDataRef.forEach((item) => {
          item.validate((valid2) => {
            that.validRst.push(valid2);
            return false;
          });
        });
        if (!this.validRst.includes(false) && valid1) {
          savePublish(this.baseFormData).then((res) => {
            if (res.data.code !== 0) {
              this.validRst = [];
              return this.$message.error("发布活动失败");
            }
            this.$message.success("发布活动成功");
            this.fileList = [];
            this.baseFormData.fileList = [];
            this.$router.go(-1);
            this.validRst = [];
            this.defaultList = []
          }).finally(() => {
            this.formLoading = false
          });
        } else {
          this.$message.error("活动信息填写不完整");
          this.validRst = [];
          this.defaultList = []
          this.formLoading = false
        }
      });
    },
    // 新增 - 保存草稿
    saveManuscript() {
      this.formLoading = true
      let that = this;
      this.baseFormData.details = this.quillContent.content;
      // 遍历票种数组
      this.baseFormData.ticketingManagements.forEach((item) => {
        item.payMethodList = []
        // 保存时将支付方式列表清空并重新
        if (item.ticketingType == '2') {
          item.payMethodList.push(item.payOfflinePay);
        }
      });
      this.baseFormData.submitType = 0;
      this.customList.forEach(item=>{
        if(item.type == 'input' || item.type == 'textarea'){
          item.placeholder = "请输入" + item.label
        }else if(item.type == 'radio' || item.type == 'checkbox'){
          item.placeholder = "请选择" + item.label
        }
      })
      this.baseFormData.conferenceFormList = [...this.defaultList,...this.customList]
      this.$refs.baseFormDataRef.validate((valid1) => {
        this.$refs.setTicketDataRef.forEach((item) => {
          item.validate((valid2) => {
            that.validRst.push(valid2);
            return false;
          });
        });
        if (!this.validRst.includes(false) && valid1) {
          savePublish(this.baseFormData).then((res) => {
            if (res.data.code !== 0) {
              return this.$message.error("保存草稿失败");
            }
            this.$message.success("保存草稿成功");
            this.fileList = [];
            this.baseFormData.fileList = [];
            this.$router.go(-1);
          }).finally(() => {
            this.formLoading = false
          });
        } else {
          this.$message.error("活动信息填写不完整");
          this.validRst = [];
          this.formLoading = false
        }
      });
    },

    // 编辑 - 保存草稿0
    saveManuscriptUpdate() {
      this.formLoading = true
      let that = this;
      this.baseFormData.details = this.quillContent.content;
      // 遍历票种数组
      this.baseFormData.ticketingManagements.forEach((item) => {
        item.payMethodList = []
        if (item.ticketingType == '2') {
          item.payMethodList.push(item.payOfflinePay);
        }
      });
      this.baseFormData.submitType = 0;
      this.baseFormData.id = this.$route.query.id;
      this.customList.forEach(item=>{
        if(item.type == 'input' || item.type == 'textarea'){
          item.placeholder = "请输入" + item.label
        }else if(item.type == 'radio' || item.type == 'checkbox'){
          item.placeholder = "请选择" + item.label
        }
      })
      this.baseFormData.conferenceFormList = [...this.defaultList,...this.customList]
      this.$refs.baseFormDataRef.validate((valid1) => {
        // 状态不为草稿
        if (this.statusFlag != "0") {
          if (valid1) {
            editSaveActivity(this.baseFormData).then((res) => {
              if (res.data.code !== 0) {
                return this.$message.error("保存草稿失败");
              }
              this.$message.success("保存草稿成功");
              this.fileList = [];
              this.baseFormData.fileList = [];
              this.$router.go(-1);
            }).finally(() => {
              this.formLoading = false
            });
          } else {
            this.$message.error("活动信息填写不完整");
            this.validRst = [];
            this.formLoading = false
          }
          return;
        }
        this.$refs.setTicketDataRef.forEach((item) => {
          item.validate((valid2) => {
            that.validRst.push(valid2);
            return false;
          });
        });
        if (!this.validRst.includes(false) && valid1) {
          editSaveActivity(this.baseFormData).then((res) => {
            if (res.data.code !== 0) {
              return this.$message.error("保存草稿失败");
            }
            this.$message.success("保存草稿成功");
            this.fileList = [];
            this.baseFormData.fileList = [];
            this.$router.go(-1);
          }).finally(() => {
            this.formLoading = false
          });
        } else {
          this.$message.error("活动信息填写不完整");
          this.validRst = [];
          this.formLoading = false
        }
      });
    },
    // 移入
    mouseOver() {
      this.showDelete = true;
    },
    // 移出
    mouseLeave() {
      this.showDelete = false;
    },
    // 获取当前时间
    getCurrentTime(){
      this.baseFormData.startTime = dateFormat(new Date())
    },
    getNextTime(){
      this.baseFormData.endTime = dateFormat(new Date(new Date().getTime() + 1000*3600*24))
    }
  },
  created() {
    this.getCurrentTime()
    this.getNextTime()
    this.getActivityClassify();
    this.getCityTree();
    this.getActivityType();
    this.getTagsPage();
    this.getActivityInfo(this.$route.query.id);
  },
};
</script>

<style lang="scss" scoped>
.title {
  padding-bottom: 20px;
  font-size: 18px;
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.elForm {
  max-width: 1100px;
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
      cursor: pointer;
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
  .addressItem{
    display: flex;
    .el-form-item:first-child{
      // flex-shrink:0;
    }
    .el-form-item:last-child{
      flex: 1;
      ::v-deep .el-form-item__error{
        padding-left: 10px;
      }
    }
  }
}
.posterInpBox {
  display: flex;
  .upload-demo {
    margin-right: 15px;
  }
}
::v-deep .el-dialog__body {
  overflow: hidden;
  max-height: 500px;
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
.box-card {
  width: 1050px;
}
.form-collect {
  width: 120px;
  text-align: right;
}
.tips {
  width: 1000px;
  margin: 30px 0 30px 120px;
  border-radius: 10px;
  border: 1px solid #eff0f1;
  padding: 20px;
  cursor: pointer;
  text-align: center;
  font-size: 14px;
  color: #919397;
  > i {
    color: #3cd489;
  }
  &:hover {
    box-shadow: 0px 0px 10px -7px red;
  }
}
.form-card {
  width: 1000px;
  margin: 30px 0 30px 120px;
  border-radius: 10px;
  border: 1px solid #eff0f1;
  padding: 20px;
  .default-options {
    display: flex;
    justify-content: space-between;
    ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #000;
    }
    .general-box {
      width: 200px;
      padding: 15px;
      border: 1px dashed #eff0f1;
      border-radius: 10px;
      > div:first-child {
        margin-bottom: 15px;
      }
      .choose-box {
        display: grid;
        gap: 15px 15px;
        grid-template-columns: 1fr 1fr;
        .el-button {
          margin: 0;
        }
      }
    }
  }
  
}
.more-options {
    margin-bottom: 15px;
  }
  .option-box{
    margin-bottom: 20px;
  }
  .custom-box{
    .item{
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      >i{
        margin-left: 10px;
        color: #409EFF;
        font-size: 18px;
        cursor: pointer;
      }
    }
    .option-list{
      margin-left: 60px;
      margin-bottom: 15px;
      .list{
        display: flex;
        flex-direction: column;
        i{
        margin-left: 10px;
        color: #409EFF;
        font-size: 18px;
        cursor: pointer;
      }
        .tagitem{
          // margin-right: 10px;
          width: fit-content;
          margin-top: 10px;
        }
        .el-button{
          width: fit-content;
          margin-top: 10px;
        }
        .el-input{
          margin-top: 10px;
        }
      }
    }
  }
.footer-btn {
  margin-left: 120px;
}
::v-deep .popperName {
  background: rgb(48, 48, 49);
}
::v-deep .el-input-number__increase {
  right: 0px !important;
  border-left: 1px solid #dcdfe6 !important;
}
.icon-ticket-remove {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 20px;
  cursor: pointer;
  color: #babec0;
}
::v-deep .el-select-dropdown__list {
    width: 250px;
}
</style>