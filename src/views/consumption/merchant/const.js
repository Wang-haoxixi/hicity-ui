export const tableOption = (admin = false) => {
  let columns = [
    {
      label: '店铺ID',
      prop: 'merchantId',
      width: "70",
    },
    {
      label: '商户门店',
      prop: 'merchantName',
    },
    {
      label: '品牌',
      prop: 'brandName',
      width: "100",
    },
    {
      label: '城市/地区',
      prop: 'cityName',
      width: "100",
    },
    {
      label: '联系人',
      prop: 'merchantUserName',
      width: "120",
    },
    {
      label: '联系电话',
      prop: 'merchantUserPhone',
      width: "120",
    },
    {
      label: '详细地址',
      prop: 'address',
    },
    {
      label: '店铺状态',
      prop: 'merchantStatus',
      width: "100",
      formatter: function (data) {
        if (data.merchantStatus == 1) {
          return '正常'
        } else if (data.merchantStatus == 2) {
          return '隐藏'
        } else if (data.merchantStatus == 3) {
          return '锁定'
        } else {
          return ''
        }
      }
    },
    {
      label: '店铺二维码',
      width: "100",
      prop: 'qrcode',
      slot: true,
      formHidden: true
    }
  ]

  let option = {
    menuWidth: 130,
    menu: true,
    columns
  }
  
  return option
}
