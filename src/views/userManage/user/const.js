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
export const tableOption = {
  menu: ['edit', 'delete'],
  labelWidth: "160px",
  menuWidth: 100,
  columns: [{
    label: '序号',
    prop: 'userId',
    span: 24,
    formHidden: true,
    width: 100,
  }, {
    label: '真实姓名',
    prop: 'realName',
    span: 24,
    maxlength: 20,
    rules: [{
      required: true,
      message: '请输入真实姓名',
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
  }, {
    label: '密码',
    prop: 'password',
    type: 'password',
    editValue: '',
    hidden: true,
    maxlength: 20,
    span: 24,
    rules: [{
      min: 6,
      max: 20,
      message: '长度在 6 到 20 个字符',
      trigger: 'blur'
    }]
  },
  {
    label: '手机号',
    prop: 'phone',
    value: '',
    span: 24,
    hidden: true,
    rules: [{
      min: 11,
      max: 11,
      message: '长度在 11 个字符',
      trigger: 'blur'
    }]
  },
  {
    label: '状态',
    prop: 'lockFlag',
    type: 'radio',
    slot: true,
    border:true,
    span: 24,
    width: 150,
    rules: [{
      required: true,
      message: '请选择状态',
      trigger: 'blur'
    }],
    dicData: [{
      label: '有效',
      value: '0'
    }, {
      label: '锁定',
      value: '9'
    }]
  },
  {
    width: 180,
    label: '创建时间',
    prop: 'createTime',
    type: 'datetime',
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss',
    display: false,
    formHidden: true,
    span: 24
  }]
}
