export const tableOption = (admin = false) => {
  let columns = [
    {
      label: '名称',
      prop: 'searchName',
      hidden: true,
      maxlength: 50,
      search: true
    },
    {
      label: '名称',
      prop: 'officialNewsName',
      slot: true
    },
    {
      label: '栏目',
      prop: 'officialColumnName',
      width: 120,
    },
    {
      label: '创建者',
      prop: 'createByName',
      width: 120
    },
    {
      label: '创建时间',
      prop: 'createTime',
      width: 160
    },
    {
      label: '最新更新人',
      prop: 'updateByName',
      width: 120
    },
    {
      label: '最新更新时间',
      prop: 'updateTime',
      width: 160
    },
    {
      label: '状态',
      prop: 'state',
      width: 70,
      formatter: function (data) {
        if (data.state == 0) {
          return '草稿'
        } else if (data.state == 1) {
          return '已生效'
        } else if (data.state == 2) {
          return '已失效'
        } else {
          return ''
        }
      }
    },

  ]
  // if (admin) {
  //   columns.push({
  //     label: '展示范围',
  //     prop: 'cityList',
  //     slot: true,
  //     width: 80,
  //   })
  // }

  let option = {
    menu: true,
    menuWidth: 120,
    columns,
    selection: true
  }
  return option
}
