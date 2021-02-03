export const tableOption = (admin = false) => {
  let column = [
    {
      label: '发布者',
      prop: 'realName',
    },
    {
      label: '游记标题',
      prop: 'travelName',
    },
    {
      label: '创建时间',
      prop: 'createTime',
    },
  ]
  if (admin) {
    column.push({
      label: '展示范围',
      prop: 'cityList',
      slot: true,
      width: 80,
    })
  }

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
