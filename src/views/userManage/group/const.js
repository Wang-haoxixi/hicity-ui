export const tableOption = (admin = false) => {
  let columns = [
    {
      label: '圈子ID',
      prop: 'circleId',
      width: 100
    },
    {
      label: '圈子名称',
      prop: 'name',
      search: true,
      maxlength: 50,
    },
    {
      label: '创建者',
      prop: 'phone',
      width: 120
    },
    {
      label: '群主姓名',
      prop: 'createByName',
      width: 120
    },
    {
      label: '圈子状态',
      prop: 'isLock',
      width: 120,
      formatter: function (row) {
        return row.isLock ? '锁定' : '正常'
      }
    },
    {
      label: '成员',
      prop: 'userCount',
      width: 80
    },
    {
      label: '注册城市',
      prop: 'city',
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
