import { getDic } from "@/util/dic"

export const tableOption = (admin = false) => {
  let columns = [
    {
      label: '商户账户',
      prop: 'phone',
      width: "120",
      maxlength: 20,
      search: true
    },
    {
      label: '商户姓名',
      prop: 'name',
      search: true
    },
    {
      label: '城市/地区',
      prop: 'cityName',
      width: "100",
    },
    {
      label: '所属店铺数',
      prop: 'numberStores',
      width: "100",
    },
    {
      label: '累计收款金额',
      prop: 'cumulativeRevenue',
      width: "120",
    },
    {
      label: '商户状态',
      prop: 'merchantStatus',
      width: "80",
      type: 'select',
      dicData: [
        {
          label: '正常',
          value: '0'
        },
        {
          label: '停用',
          value: '1'
        },
        {
          label: '注销',
          value: '2'
        }
      ],
      search: true
    },
    {
      label: '城市/地区',
      prop: 'cityId',
      width: "100",
      search: true
    },
    {
      label: '创建时间',
      prop: 'createTime',
      width: '160'
    },
  ]

  let option = {
    menuWidth: 180,
    menu: true,
    search: true,
    columns
  }

  return option
}


export const shopTableOption = {
  menuWidth: 120,
  index: true,
  header: false,
  menu: true,
  columns: [
    {
      label: '统一社会信用代码',
      prop: 'businessLicense'
    },
    {
      label: '店铺名称',
      prop: 'storeName'
    },
    {
      label: '店铺地址',
      prop: 'address'
    },
    {
      label: '店铺状态',
      prop: 'storeStatus',
      // type: 'select',
      formatter: ({storeStatus}) => {
        let dicData = getDic('STORE_STATE')
        for (let i = 0; i < dicData.length; i++) {
          if (dicData[i].value == storeStatus) {
            return dicData[i].label
          }
        }
      }
    },
  ]
}


export const orderTableOption = {
  menuWidth: 80,
  index: true,
  menu: true,
  search: true,
  columns: [
    {
      label: '订单号',
      prop: 'orderNum',
      search: 'basic',
    },
    {
      label: '订单创建时间',
      prop: 'createTime',
      width: 160,
    },
    {
      label: '收款店铺',
      prop: 'storeName'
    },
    {
      label: '收银员',
      prop: 'cashierName'
    },
    {
      label: '收款金额',
      prop: 'paymentAmount',
      formatter: function (data) {
        return data.paymentAmount + '元'
      }
    },
    {
      label: '收款状态',
      prop: 'storeOrderStatus',
      type: 'select',
      dicName: 'STORE_ORDER_STATUS',
      width: 100,
    },
  ]
}

export const accountTableOption = {
  menuWidth: 80,
  index: true,
  menu: ['view'],
  search: true,
  labelWidth: '150px',
  columns: [
    {
      label: '交易账户',
      prop: 'payeePhone',
    },
    {
      label: '交易日期',
      prop: 'transactionDate',
      type: 'date',
      valueFormat: 'yyyy-MM-dd',
      search: 'senior',
      hidden: true,
      formHidden: true,
    },
    {
      label: '交易日期',
      prop: 'createTime',
      width: 160,
    },
    {
      label: '交易类型',
      prop: 'transactionType',
      type: 'select',
      dicData: [
        {
          label: '收入',
          value: 1
        },
        {
          label: '提现',
          value: 2
        }
      ],
      search: 'senior',
    },
    {
      label: '交易金额',
      prop: 'amount'
    },
    {
      label: '账户余额',
      prop: 'balance',
      formHidden: true
    },
    {
      label: '收款订单号',
      prop: 'serialNo',
      hidden: true
    },
  ]
}
