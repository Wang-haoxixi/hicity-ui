export const tableOption = (admin = false) => {
  let columns = [
    {
      label: '话题名称',
      prop: 'topicsName',
      span: 24,
      rules: [{required: true, message: '请输入话题名称'}]
    },
    {
      label: '所属分类',
      prop: 'classifyId',
      formSlot: true,
      span: 24,
      formatter: function (row) {
        return row.classifyName
      }
    },
    {
      label: '被应用次数',
      prop: 'numberOfTimesUsed',
      formHidden: true,
    },
  ]
  let option = {
    index: true,
    labelWidth: '160px',
    addBtn: true,
    menuWidth: 100,
    menu: ['edit', 'delete'],
    columns
  }
  
  return option
}
