export const tableOption = (admin = false) => {
  let column  = [
    {
      label: '标签名称',
      prop: 'name',
      search: true,
      span: 24,
      // width: 100,
      // editDisabled: (scope) => {
      //   return scope.row.editable
      // }
    },
    {
      label: '是否允许城市关闭',
      prop: 'editable',
      span: 24,
      type: 'switch',
      dicData: [
        {
          label: '不允许',
          value: false
        },
        {
          label: '允许',
          value: true
        }
      ],
      value: false,
      width: 100,
      // editDisabled: (scope) => {
      //   return scope.row.editable
      // }
    },
    {
      label: '标签编码',
      prop: 'tagCode',
      span: 24,
      search: true,
      width: 100,
    }
  ]
  if (admin) {
    column.push({
      label: '配置城市',
      prop: 'city',
      slot: true,
      display: false,
      span: 24,
      width: 100
    })
  } else {
    column.push({
      label: '排序',
      prop: 'sort',
      span: 24,
      width: 100,
      display: false,
    })
  }
  return {
    border: true,
    stripe: true,
    menuAlign: 'center',
    editBtn: false,
    delBtn: false,
    align: 'center',
    addBtn: false,
    labelWidth: 160,
    menuWidth: 160,
    column
  }
}