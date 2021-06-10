export const tableOption = () => {
  let columns = [
    {
      label: '券名称',
      prop: 'name',
      search: 'basic',
      slot: true,
      maxlength: 50,
    },
    {
      label: '用户名',
      prop: 'receiverName',
      width: 120
    },
    {
      label: '领取时间',
      prop: 'createTime',
      width: 200
    },
    {
      label: '核销状态',
      prop: 'writeOffStatus',
      width: 100,
      formatter: function (row) {
        if (row.writeOffStatus === '0') {
          return '未核销'
        } else if (row.writeOffStatus === '1') {
          return '已核销'
        } else {
          return ''
        }
      }
    },
  ]

  let option = {
    menuWidth: 80,
    menu: true,
    columns
  }

  return option
}
