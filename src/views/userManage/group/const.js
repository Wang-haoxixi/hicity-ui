export const tableOption = (admin = false) => {
  let column = [
    {
      label: '圈子ID',
      prop: 'circleId'
    },
    {
      label: '圈子名称',
      prop: 'name'
    },
    {
      label: '创建者',
      prop: 'telephone'
    },
    {
      label: '群主姓名',
      prop: 'createByName'
    },
    {
      label: '圈子状态',
      prop: 'state'
    },
    {
      label: '成员',
      prop: 'userCount',
    },
    {
      label: '注册城市',
      prop: 'createByCity'
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
