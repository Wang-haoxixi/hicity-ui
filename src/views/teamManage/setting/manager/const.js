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
export const tableOption = (edit = false) => {
  let columns = [
    {
      label: '序号',
      prop: 'userId',
      span: 24,
      formHidden: true,
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
      maxlength: 20,
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
      ]
    },
    {
      label: '联系电话',
      prop: 'phone',
      span: 24,
      width: 120,
      maxlength: 20,
    },
    {
      label: '密码',
      prop: 'password',
      type: 'password',
      hidden: true,
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
      width: 180,
      label: '创建时间',
      prop: 'createTime',
      formHidden: true,
      span: 24
    }
  ]
  let option = {
    labelWidth: '150px',
    header: true,
    menu: true,
    menuWidth: 220,
    columns
  }
  return option
}
