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
      maxlength: 50,
    },
    {
      label: '所属商户',
      prop: 'merchantName',
    },
    {
      label: '城市',
      prop: 'cityName',
    },
    {
      label: '供应量',
      prop: 'supply',
    },
    {
      label: '供应量',
      prop: 'supply',
    },
    {
      label: '已领数量',
      prop: 'receivedNum',
    },
    {
      label: '库存',
      prop: 'surplus',
    },
    {
      label: '已核销',
      prop: 'writtenOff',
    },
    {
      label: '未使用',
      prop: 'unUseNum',
    },
    {
      label: '上架状态',
      prop: 'status',
      width: 100,
      formatter: function (row) {
        if (row.status === 0) {
          return '待上架'
        } else if (row.status === 1) {
          return '已上架'
        } else if (row.status === 2) {
          return '已售罄'
        } else if (row.status === 3) {
          return '已下架'
        } else if (row.status === 4) {
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
      formatter: function (row) {
        if (row.sellStatus === 0) {
          return '未开领'
        } else if (row.sellStatus === 1) {
          return '已开领'
        } else if (row.sellStatus === 2) {
          return '已领完'
        } else {
          return ''
        }
      }
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
