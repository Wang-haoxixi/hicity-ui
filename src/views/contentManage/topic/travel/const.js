export const tableOption = (admin = false) => {
  let columns = [
    {
      label: '游记标题',
      prop: 'travelName',
      search: 'basic',
      maxlength: 50,
    },
    {
      label: '发布者',
      prop: 'realName',
      width: 150,
    },
    {
      label: '创建时间',
      prop: 'createTime',
      width: 160,
    },
    {
      label: '状态',
      prop: 'state',
      formatter: function (row) {
        if (row.state == '0') {
          return '草稿'
        } else if (row.state == '1') {
          return '已发布'
        } else {
          return ''
        }
      },
      width: 80
    },
  ]
  if (admin) {
    columns.splice(2, 0, {
      label: '展示范围',
      prop: 'cityList',
      slot: true,
      width: 80,
    })
  }

  let option = {
    menuWidth: 100,
    menu: true,
    columns
  }

  return option
}
