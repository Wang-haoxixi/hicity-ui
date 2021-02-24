export const tableOption = (admin = false) => {
  let column = [
    {
      label: '话题名称',
      prop: 'topicsName',
      span: 24,
    },
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
