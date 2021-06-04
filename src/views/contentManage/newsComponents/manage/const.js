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
      label: '发布者',
      prop: 'createByName',
      width: 180
    },
    {
      label: '状态',
      prop: 'state',
      width: 90,
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
    {
      label: '创建时间',
      prop: 'createTime',
      width: 160
    },

  ]
  if (admin) {
    columns.push({
      label: '展示范围',
      prop: 'cityList',
      slot: true,
      width: 80,
    })
  }

  let option = {
    menu: [
      {
        label: '编辑',
        fun: 'toUpdate'
      },
      {
        label: '删除',
        fun: 'toDelete'
      },
    ],
    menuWidth: 120,
    columns,
  }
  return option
}
