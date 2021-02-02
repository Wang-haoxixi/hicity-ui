export const tableOption = (admin = false) => {
  let column = [
    {
      label: '话题名称',
      prop: 'topicsName',
      span: 24,
      rules: [{required: true, message: '请输入话题名称'}]
    },
    {
      label: '所属分类',
      prop: 'classifyId',
      formslot: true,
      span: 24,
      formatter: function (row) {
        return row.classifyName
      }
    }
  ]
  let option = {
    border: true,
    index: true,
    indexLabel: '序号', 
    stripe: true,
    menuAlign: 'center',
    editBtn: false,
    delBtn: false,
    align: 'center',
    addBtn: false,
    labelWidth: 160,
    menuWidth: 150,
    column
  }
  
  return option
}
