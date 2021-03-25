export const tableOption = () => {
  let columns = [
    {
      label: 'ID',
      prop: 'id',
      width: 80,
    },
    {
      label: '券名称',
      prop: 'name',
      search: true,
    },
    {
      label: '上架状态',
      prop: 'shelfStatus',
      width: 100,
      formatter: function (row) {
        if (row.shelfStatus === 0) {
          return '待上架'
        } else if (row.shelfStatus === 1) {
          return '已上架'
        } else if (row.shelfStatus === 2) {
          return '已售罄'
        } else if (row.shelfStatus === 3) {
          return '已下架'
        } else if (row.shelfStatus === 4) {
          return '仓库中'
        } else {
          return ''
        }
      }
    },
    {
      label: '本店核销',
      prop: 'writtenOff',
      width: 100,
    },
  ]

  let option = {
    menuWidth: 120,
    menu: true,
    header: true,
    columns
  }
  
  return option
}
