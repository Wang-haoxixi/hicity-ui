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
      label: '标签编码',
      prop: 'tagCode',
      span: 24,
      search: true,
      width: 100,
      // editDisabled: (scope) => {
      //   return scope.row.editable
      // }
    }
  ]
  if (admin) {
    column.push({
      label: '配置城市',
      prop: 'city',
      slot: true,
      span: 24,
      width: 100
    })
  } else {
    column.push({
      label: '排序',
      prop: 'sort',
      span: 24,
      width: 100,
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