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
    parentId: -1, // 父ID
    name: "", // 类型名称
    number: "", // 类型编码
    sort: 0, // 排序
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
        label: "类型名称",
      },
      {
        prop: "number",
        label: "类型编码",
      },
      {
        prop: "sort",
        label: "排序",
        width: "100px",
      },
    ]
  }
  return option
}
