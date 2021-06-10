export const tableOption = (admin = false) => {
  let column = [
    {
      label: '分类',
      prop: 'classifyName',
      search: true,
      maxlength: 50,
    },
    {
      label: '图片',
      prop: 'imageUrl',
      slot: true,
      width: 200,
    },
    {
      label: '关联话题',
      prop: 'topics',
      slot: true
    },
  ]
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
    menuWidth: 150,
    column
  }

  return option
}
