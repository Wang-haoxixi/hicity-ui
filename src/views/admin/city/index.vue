<template>
  <div>
    <basic-container>
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-button-group>
            <el-button v-if="sys_city_add" type="primary" icon="el-icon-plus" @click="handlerAdd">添加</el-button>

            <el-button v-if="sys_city_edit" type="primary" icon="el-icon-edit" @click="handlerEdit">编辑</el-button>
            <el-button v-if="sys_city_del" type="primary" icon="el-icon-delete" @click="handleDelete">删除</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
      <el-row :gutter="20">
        <el-col :span="6" style='margin-top:15px;'>
          <el-input placeholder="输入关键字进行过滤" v-model="filterText">
          </el-input>
          <el-tree class="filter-tree" :data="treeData" node-key="id" highlight-current :props="defaultProps"
            :filter-node-method="filterNode" @node-click="getNodeData" ref="tree">
          </el-tree>
        </el-col>
        <el-col :span="18" style='margin-top:15px;'>
          <el-card class="box-card">
            <el-form :label-position="labelPosition" label-width="120px" :model="form" ref="form" :rules="rule">
              <el-form-item label="父级节点" prop="parentId"
                :rules="[{ required: true, message: '父级节点不能为空', trigger: 'change' }]">
                <!-- <el-input v-model="form.parentId" :disabled="formEdit" placeholder="请输入父级节点"></el-input> -->
                <el-input v-model="form.parentName" :disabled="formEdit" placeholder="选择城市" @focus="handleCity()"
                  readonly></el-input>
                <input type="hidden" v-model="form.parentId" />
              </el-form-item>
              <el-form-item label="节点编号" prop="id" v-if="formEdit"
                :rules="[{ required: true, message: '节点编号不能为空', trigger: 'change' }]">
                <el-input v-model="form.id" :disabled="formEdit" placeholder="节点编号"></el-input>
              </el-form-item>
              <el-form-item label="行政区域代码" prop="regionCode"
                :rules="[{ required: true, message:'请输入行政区划代码', trigger: 'blur' }]">
                <el-input v-model="form.regionCode" :disabled="formEdit" placeholder="请输入行政区域代码" maxlength="6">
                </el-input>
              </el-form-item>
              <el-form-item label="行政区域名称" prop="regionName"
                :rules="[{ required: true, message: '行政区域名称', trigger: 'change' }, {validator:this.checkCityName,trigger:'blur'}]">
                <el-input v-model="form.regionName" :disabled="formEdit" placeholder="请输入城市名称"></el-input>
              </el-form-item>
              <el-form-item label="行政区域简称" prop="abbreviation"
                :rules="[{ required: true, message: '行政区域行政区域简称', trigger: 'change' }]">
                <el-input v-model="form.abbreviation" :disabled="formEdit" placeholder="行政区域简称"></el-input>
              </el-form-item>
              <el-form-item label="区划编码" prop="regionNumber">
                <el-input v-model="form.regionNumber" maxlength="12" :disabled="formEdit" placeholder="请输入区划编码" type="number" :min="0"
                  :max="10000"></el-input>
              </el-form-item>
              <el-form-item label="行政区域描述" prop="regionDesc"
                :rules="[{ required: true, message: '行政区域描述不能为空', trigger: 'change' },{ min: 0, max: 255, message: '长度在255个字符以内', trigger: 'blur' }]">
                <el-input v-model="form.regionDesc" :disabled="formEdit" placeholder="行政区域描述"></el-input>
              </el-form-item>
              <el-form-item label="排序" prop="orderNum">
                <el-input v-model="form.orderNum" :disabled="formEdit" placeholder="请输入排序" type="number"></el-input>
              </el-form-item>
              <el-form-item label="区域等级" prop="regionLvl"
                :rules="[{ required: true, message: '区域等级不能为空', trigger: 'change' }]">
                <el-select v-model="form.regionLvl" :disabled="formEdit" placeholder="请选择区域等级">
                  <el-option v-for="item in dicList['city_level']" :key="item.value" :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="formStatus == 'update'">
                <el-button type="primary" @click="update">更新</el-button>
                <el-button @click="onCancel">取消</el-button>
              </el-form-item>
              <el-form-item v-if="formStatus == 'create'">
                <el-button type="primary" @click="create">保存</el-button>
                <el-button @click="onCancel">取消</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogCityVisible" :append-to-body="true">
        <el-input placeholder="输入关键字进行过滤" v-model="filterTextIner">
        </el-input>
        <el-tree class="filter-tree" :data="treeDataFor" :default-checked-keys="checkedKeys"
          :filter-node-method="filterNode" check-strictly node-key="id" highlight-current ref="deptTree"
          :props="defaultProps" @node-click="getNodeDataNew">
        </el-tree>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
  import {
    getCityTree,
    getCityById,
    postCity,
    downloadColumns,
    deleteCity,
    putCity,
    checkRegionCode,
    checkCityName,
  } from '@/api/admin/city'
  import {
    mapGetters
  } from 'vuex'
  export default {
    // name: 'menu',
    data() {
      return {
        textMap: {
          update: '编辑',
          create: '创建',
        },
        exportData: {
          listQuery: {
            columns: [],
          },
          data: [{
            title: '行政区划字段',
            prop: 'columns',
            data: [],
          }],
        },
        dialogStatus: '',
        dialogCityVisible: false,
        filterTextIner: '',
        checkedKeys: [],
        list: null,
        total: null,
        formEdit: true,
        formAdd: true,
        formStatus: '',
        showElement: false,
        typeOptions: ['0', '1'],
        methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
        cityLevelOptions: [],
        listQuery: {
          name: undefined,
        },
        currentValue: [],
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'regionName',
        },
        labelPosition: 'right',
        form: {
          name: undefined,
          orderNum: undefined,
          regionNumber: undefined,
          parentId: undefined,
          key: undefined,
        },
        currentId: 0,
        sys_city_add: false,
        sys_city_del: false,
        sys_city_edit: false,
        rule: {
          code: [{
            min: 2,
            max: 2,
            message: '请填写2个字符'
          }],
          cityLevel: [],
          orderNum: [{
            required: true,
            message: '排序不能为空',
            trigger: 'change'
          }, {
            validator: this.checkCityNames,
            trigger: 'change'
          }],
          regionNumber: [{
            required: true,
            message: '区划编码不能为空',
            trigger: 'change'
          }, {
            validator: this.checkRegionCode,
            trigger: 'change'
          }]
        },
        filterText: '',
      }
    },
    filters: {
      typeFilter(type) {
        const typeMap = {
          0: '菜单',
          1: '按钮',
        }
        return typeMap[type]
      },
    },
    created() {
      this.getList()
      this.sys_city_add = this.permissions['sys_city_add']
      this.sys_city_del = this.permissions['sys_city_del']
      this.sys_city_edit = this.permissions['sys_city_edit']
    },
    computed: {
      ...mapGetters([
        'permissions',
        'dicList',
      ]),
      parentOption() {
        let option = JSON.parse(JSON.stringify(this.treeData))
        return option
      },
      treeDataFor() {
        let arr = this.transTree(this.treeData)
        arr.splice(0, 0, {
          id: 0,
          regionName: '最上级'
        })
        return arr
      },
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      },
      filterTextIner(val) {
        this.$refs.deptTree.filter(val)
      },
      'form.orderNum': {
        deep: true,
        handler(val) {
          if (val < 1) {
            this.$set(this.form, 'orderNum', 1)
          }
        },
      },
      'form.parentId': {
        deep: true,
        handler(val) {
          if (val == 0) {
            this.$set(this.form, 'parentName', '最上级')
          }
        },
      },
      'form.regionNumber': {
        deep: true,
        handler(val) {
          if (val < 0) {
            this.$set(this.form, 'regionNumber', 1)
          }
        },
      },
    },
    methods: {
      //转化tree
      transTree (tree) {
        let arr = []
        for(let  item of tree){
          if(item.id !== this.form.id){
            let obj = {...item}
            if(obj.children){
              obj.children = this.transTree(item.children)
            }
            arr.push(obj)
          }
        }
        return arr
      },
      // 导入
      filterNode(value, data) {
        if (!value) return true
        return data.regionName.indexOf(value) !== -1
      },
      getNodeDataNew(data) {
        this.dialogCityVisible = false
        this.form.parentId = data.id
        this.form.parentName = data.regionName || '最上级'
      },
      handleCity() {
        this.dialogCityVisible = true
      },
      getList() {
        getCityTree(this.listQuery).then(({
          data
        }) => {
          this.treeData = data.data
          // console.log('treedata',this.treeData)
        })
        this.$nextTick(() => {
          this.$refs['form'] ? this.$refs['form'].clearValidate() : ''
        })
      },
      getNodeData(data) {
        if (!this.formEdit) {
          this.formStatus = 'update'
        }
        getCityById(data.id).then(({
          data
        }) => {
          this.form = data.data.data
          if (!this.form.parentName) {
            this.$set(this.form, 'parentName', '最上级')
          }
        })
        this.currentId = data.id
        this.showElement = true
      },
      handlerEdit() {
        if (this.form.id) {
          this.formEdit = false
          this.formStatus = 'update'
          this.$nextTick(() => {
            this.$refs['form'] ? this.$refs['form'].clearValidate() : ''
          })
        }
      },
      handlerAdd() {
        let parentName = this.form.regionName
        this.resetForm()
        this.$set(this.form, 'parentName', parentName)
        this.formEdit = false
        this.formStatus = 'create'
        this.$nextTick(() => {
          this.$refs['form'] ? this.$refs['form'].clearValidate() : ''
        })
      },
      handleDelete() {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          deleteCity(this.currentId).then(() => {
            this.getList()
            this.resetForm()
            this.onCancel()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000,
            })
            this.$nextTick(() => {
              this.$refs['form'] ? this.$refs['form'].clearValidate() : ''
            })
          })
        })
      },
      update() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            putCity(this.form).then(() => {
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000,
              })
              this.getList()
              // getCityById(this.currentId).then(({ data }) => {
              //   this.form = data.data
              //   if (!this.form.parentName) {
              //     this.$set(this.form, 'parentName', '最上级')
              //   }
              // })
            })
          }
        })
      },
      create() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            postCity(this.form).then(({
              data
            }) => {
              if (data.data) {
                this.getStateList(data.data)
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000,
                })
                this.currentId = ''
                this.resetForm()
              }
            })
          }
        })
      },
      //静态更新左侧树
      getStateList(id, status = 'create') {
        let form = this.form
        let formId = this.form.parentId
        if (status === 'create') {
          if (!this.form.parentId || this.form.parentId == 0) {
            this.treeData.push({
              ...this.form,
              id: id,
            })
          } else {
            for (let item of this.treeData) {
              if (item.id == formId) {
                if (!item.children) {
                  item.children = []
                }
                item.children.push({
                  ...this.form,
                  id: id,
                })
                return true
                break
              } else {
                let bool = itempush(item)
                if (bool == true) {
                  break
                }
              }
            }
          }
        }

        function itempush(obj) {
          if (obj.children && obj.children.length > 0) {
            for (let item of obj.children) {
              console.log(item.id, formId)
              if (item.id == formId) {
                if (!item.children) {
                  item.children = []
                }
                item.children.push({
                  ...form,
                  id: id,
                })
                return true
                break
              } else {
                itempush(item)
                // return false
              }
            }
          }
          return false
        }
      },
      onCancel() {
        this.formEdit = true
        this.formStatus = ''
      },
      resetForm() {
        this.form = {
          permission: undefined,
          name: undefined,
          menuId: undefined,
          parentId: this.currentId,
          url: undefined,
          icon: undefined,
          sort: undefined,
          component: undefined,
          type: undefined,
          method: undefined,
        }
        this.$nextTick(() => {
          this.$refs['form'] ? this.$refs['form'].clearValidate() : ''
        })
      },

      checkCode(rule, value, callback) {
        if (!value) {
          return callback(new Error('不能为空'))
        } else if (value.length < 2) {
          return callback(new Error('长度不能小于2'))
        } else if (value.length > 3) {
          return callback(new Error('长度不能大于3'))
        } else {
          let re = /^\d+$/
          if (!re.test(value)) {
            callback(new Error('请输入数字值'))
          } else {
            callback()
          }
        }
      },
      //区域编码验重
      checkRegionCode(rule, value, callback) {
        if (value == '') {
          callback(new Error('不能为空！'))
        } else if (value.length !== 12) {
          callback(new Error('区划编码需为12位'))
        } else {
          let params = {}
          if (this.form.regionNumber) {
            params.regionNumber = this.form.regionNumber
          }
          if (this.form.id) {
            params.id = this.form.id
          }
          checkRegionCode(params).then(({
            data
          }) => {
            if (data.data == false) {
              callback(new Error(data.msg))
            } else {
              callback()
            }
          })
        }
      },
      //城市名称验重
      checkCityName(rule, value, callback) {
        let params = {}
        if (this.form.regionName) {
          params.regionName = this.form.regionName
        }
        if (this.form.id) {
          params.id = this.form.id
        }
        checkCityName(params).then(({
          data
        }) => {
          if (data.data == false) {
            callback(new Error(data.msg))
          } else {
            callback()
          }
        })
      },
      //排序
      checkCityNames(rule, value, callback) {
        if (value == '') {
          callback(new Error('排序不能为空'))
        } else if (value > 1000) {
          callback(new Error('排序需小于1000'))
        } else {
          callback()
        }
      },
    },
  }

</script>

<style lang="scss" scoped>
  /deep/ .basic-container>.el-card {
    height: calc(100vh - 137px);
    overflow: auto;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
    border: none;
  }

</style>
