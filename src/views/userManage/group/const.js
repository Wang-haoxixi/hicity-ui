export const tableOption = (admin = false) => {
  let columns = [
    {
      label: '圈子ID',
      prop: 'circleId',
      width: 100
    },
    {
      label: '圈子名称',
      prop: 'name'
    },
    {
      label: '创建者',
      prop: 'telephone',
      width: 120
    },
    {
      label: '群主姓名',
      prop: 'createByName',
      width: 120
    },
    {
      label: '圈子状态',
      prop: 'state',
      width: 120
    },
    {
      label: '成员',
      prop: 'userCount',
      width: 80
    },
    {
      label: '注册城市',
      prop: 'createByCity',
      width: 120
    },
    
  ]
  let option = {
    labelWidth: 160,
    menuWidth: 80,
    menu: [
      {
        label: '详情',
        fun: 'groupView'
      }
    ],
    columns
  }
  
  return option
}
