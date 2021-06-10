export const tableOption = () => {
  let columns = [
    {
      label: '商品ID',
      prop: 'id',
      width: 80,
    },
    {
      label: '商品名称',
      prop: 'name',
      search: 'basic',
      maxlength: 50,
    },
    {
      label: '商品分类',
      prop: 'type',
      width: 100,
      type: 'select',
      dicData: [
        {
          value: 1,
          label: '研究报告'
        }
      ]
    },
    {
      label: '商品价格',
      prop: 'price',
      width: 100,
    },
    {
      label: '已兑换数量',
      prop: 'convertedQuantity',
      width: 100,
    },
    {
      label: '状态',
      prop: 'state',
      type: 'select',
      dicData: [
        {
          value: 0,
          label: '待上架'
        },
        {
          value: 1,
          label: '上架中'
        },
        {
          value: 2,
          label: '已下架'
        }
      ],
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
