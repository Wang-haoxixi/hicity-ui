export const tableOption = (admin = false) => {
  let column = [
    {
      label: '店铺ID',
      prop: 'merchantId',
    },
    {
      label: '商户门店',
      prop: 'merchantName',
    },
    {
      label: '品牌',
      prop: 'brandName',
    },
    {
      label: '创建城市',
      prop: 'cityName',
    },
    {
      label: '联系人',
      prop: 'merchantUserName',
    },
    {
      label: '联系电话',
      prop: 'merchantUserPhone',
    },
    {
      label: '详细地址',
      prop: 'address',
    },
    {
      label: '店铺状态',
      prop: 'merchantStatus',
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
    }
  ]

  let option = {
    border: true,
    // index: true,
    // indexLabel: '序号', 
    stripe: true,
    menuAlign: 'center',
    editBtn: false,
    delBtn: false,
    align: 'center',
    addBtn: false,
    labelWidth: 160,
    menuWidth: 150,
    column
  }
  
  return option
}
