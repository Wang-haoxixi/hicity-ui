export const tableOption = {
  menuWidth: '80px',
  menu: [
    {
      label: '查看',
      fun: 'handleView'
    }
  ],
  columns: [
    {
      prop: 'id',
      label: '用户账号'
    },
    {
      prop: 'name',
      label: '姓名'
    },
    {
      prop: 'mobile',
      label: '联系方式'
    },
    {
      prop: 'cityName',
      label: '地区'
    },
    {
      prop: 'cooperationIntention',
      label: '合作意向',
    }
  ]
}