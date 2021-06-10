export const tableOption = {
  menu: true,
  menuWidth: 100,
  columns: [
    {
      label: '广告缩略图',
      prop: 'imageUrl',
      slot: true,
      width: '160px'
    },
    {
      label: '广告名称',
      prop: 'adName',
      search: 'basic',
      maxlength: 50,
    },
    {
      label: '广告位',
      prop: 'adslotName',
    },
    {
      label: '开始时间',
      prop: 'beginDate',
      width: '160px'
    },
    {
      label: '结束时间',
      prop: 'endDate',
      width: '160px'
    },
  ]
}
