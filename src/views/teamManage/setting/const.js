import {getDetails} from '@/api/admin/user'
import { getDic } from '@/util/dic.js'


var validateUsername = (rule, value, callback) => {
  getDetails(value).then(response => {
    if (window.boxType === 'edit') callback()
    const result = response.data.data
    if (!!result) {
      callback(new Error('用户名已经存在'))
    } else {
      callback()
    }
  })
}
export const tableOption = (edit = false, admin = false) => {
  let option = {
    border: true,
    // index: true,
    // indexLabel: '序号', 
    stripe: true,
    menuAlign: 'center',
    editBtn: false,
    delBtn: false,
    align: 'center',
    addBtn: false,
    labelWidth: 160,
    menuWidth: 220,
    column: [
      {
        label: '序号',
        prop: 'userId',
        span: 24,
        display: false,
        width: 100,
      },
      {
        label: '管理员名称',
        prop: 'realName',
        span: 24,
        maxlength: 20,
        rules: [{
          required: true,
          message: '请输入管理员名称',
          trigger: 'blur'
        }]
      }, 
      {
        label: '用户名',
        prop: 'username',
        editDisabled: true,
        search: true,
        span: 24,
        rules: [{
          required: true,
          message: '请输入用户名'
        },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          },
          // {validator: validateUsername, trigger: 'blur'}
        ]
      },
      {
        label: '密码',
        prop: 'password',
        type: 'password',
        value: '',
        hide: true,
        span: 24,
        rules: [
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          },
          {
            required: !edit,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      },
      {
        label: '所属平台',
        prop: 'deptId',
        formatter: (row) => {
          return row.deptName
        },
        formslot: true,
        span: 24,
        dataType:"number",
        rules: [{
          required: true,
          message: '请选择所属部门',
          trigger: 'change'
        }]
      },
      // {
      //   label: '用户类型',
      //   prop: 'userType',
      //   hide: true,
      //   type: 'select',
      //   dicData: getDic('user_type'),
      //   props: {
      //     label: 'label',
      //     value: 'value'
      //   },
      //   span: 24,
      //   rules: [{
      //     required: true,
      //     message: '请选择用户类型',
      //     trigger: 'blur'
      //   }]
      // },
      {
        width: 180,
        label: '创建时间',
        prop: 'createTime',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
        display: false,
        span: 24
      }
    ]
  }
  if (!admin) {
    option.column.splice(5, 1)
  }
  return option
}
