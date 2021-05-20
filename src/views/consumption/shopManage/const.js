export const tableOption = (admin = false) => {
  let columns = [
    {
      label: '统一社会信用代码',
      prop: 'businessLicense',
      width: "150",
    },
    {
      label: '店铺名称',
      prop: 'storeName',
      search: true,
      maxlength: 50,
    },
    {
      label: '店铺地址',
      prop: 'address',
    },
    {
      label: '店铺类型',
      prop: 'storeType',
      type: 'select',
      dicName: 'STORE_TYPE'
    },
    {
      label: '城市/地区',
      prop: 'cityName',
      width: "100",
    },
    {
      label: '所属商户',
      prop: 'storeManagerName',
      width: "120",
    },
    {
      label: '店铺状态',
      prop: 'storeStatus',
      width: "100",
      formatter: function (data) {
        if (data.storeStatus == 1) {
          return '正常'
        } else if (data.storeStatus == 2) {
          return '隐藏'
        } else if (data.storeStatus == 3) {
          return '锁定'
        } else {
          return ''
        }
      }
    },
  ]

  let option = {
    menuWidth: 130,
    menu: true,
    columns
  }
  
  return option
}


export const cashierOption = {
  menuWidth: 80,
  menu: true,
  index: true,
  header: false,
  columns: [
    {
      label: '所属店铺名称',
      prop: 'storeName',
    },
    {
      label: '统一社会信用码',
      prop: 'businessLicense',
    },
    {
      label: '姓名',
      prop: 'name',
      width: "120",
    },
    {
      label: '账户',
      prop: 'phone',
      width: "120",
    }
  ]
}