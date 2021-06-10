import { getDic } from '@/util/dic'

export const tableOption = () => {
  let columns = [
    {
      label: '订单号',
      prop: 'orderNum',
      search: true,
      maxlength: 50,
    },
    {
      label: '创建时间',
      prop: 'createTime',
      width: 160,
    },
    {
      label: '付款人账户',
      prop: 'payerPhone',
      search: true,
      maxlength: 50,
      width: 100
    },
    {
      label: '收款人账户',
      prop: 'cashierAccount',
      search: true,
      maxlength: 50,
      width: 100
    },
    {
      label: '支付时间',
      prop: 'paymentTime',
      width: 160,
    },
    {
      label: '支付方式',
      prop: 'paymentMethod',
      formatter: function (order) {
        if (order.paymentMethod == '1') {
          return '微信支付'
        } else if (order.paymentMethod == '2') {
          return '易宝支付'
        }
      },
      width: 100,
    },
    {
      label: '订单状态',
      prop: 'storeOrderStatus',
      search: true,
      type: 'select',
      dicData: [
        {
          label: '全部',
          value: undefined
        },
        ...getDic('STORE_ORDER_STATUS')
      ],
      width: 100,
    }
  ]

  let option = {
    menuWidth: 80,
    menu: true,
    columns
  }

  return option
}
