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
      label: '优惠券类型',
      prop: 'type',
      width: 100,
      type: 'select',
      search: true,
      dicData: [
        {
          label: '全部',
          value: undefined
        },
        {
          label: '商户券',
          value: '0'
        },
        {
          label: '平台券',
          value: '1'
        }
      ]
    },
    {
      label: '发布城市',
      prop: 'cityName',
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
      prop: 'surplus',
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
    menuWidth: 160,
    menu: true,
    header: true,
    columns
  }
  
  return option
}
