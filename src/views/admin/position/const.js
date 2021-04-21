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

export const initForm = () => {
  return {
    parentId: 0, // 父ID
    name: "", // 类型名称
    introduction: "", // 类型编码
    sort: 0, // 排序
    type: 1,
  };
};

export const tableOption = () => {
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
    columnBtn: false,
    column: [
      {
        prop: "id",
        label: "ID",
        width: "200px",
      },
      {
        prop: "name",
        label: "行业名称",
      },
    ]
  }
  return option
}
