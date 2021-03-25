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
      label: '发布城市',
      prop: 'businessName',
    },
    {
      label: '使用范围',
      prop: 'scopeOfUseCity',
      slot: true,
    },
    {
      label: '供应量',
      prop: 'supply',
      width: 100,
    },
    {
      label: '已领数量',
      prop: 'receivedNum',
      width: 100,
    },
    {
      label: '库存',
      prop: 'stock',
      width: 100,
    },
    {
      label: '已核销',
      prop: 'writtenOff',
      width: 100,
    },
    {
      label: '未使用数量',
      prop: 'unUseNum',
      width: 100,
    },
    {
      label: '过期数量',
      prop: '过期数量',
      width: 100,
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
      label: '领取状态',
      prop: 'sellStatus',
      width: 100,
    },
  ]

  let option = {
    menuWidth: 160,
    menu: true,
    header: true,
    columns
  }
  
  return option
}
