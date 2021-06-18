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
      search: true,
      hidden: true
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
  index: true,
  menu: true,
  search: true,
  menuWidth: '100px',
  columns: [
    {
      label: '订单号',
      prop: 'orderNumber',
      search: true,
      maxlength: 20,
    },
    {
      label: '日期',
      prop: 'createTime',
      type: 'daterange',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      search: true,
      search: 'senior',
      formatter: function(row) {
        return row.orderCreateTime
      },
      width: 160
    },
    {
      label: '收益类型',
      prop: 'transactionTypeStr',
      width: 120
    },
    {
      label: '金额',
      prop: 'amount',
      width: 100,
    },
    {
      label: '状态',
      prop: 'state',
      type: 'select',
      search: true,
      width: 100,
      dicData: [
        {
          label: '全部',
          value: '0'
        },
        {
          label: '未到账',
          value: '1'
        },
        {
          label: '已到账',
          value: '2'
        },
        {
          label: '待结算',
          value: '3'
        },
        {
          label: '已结算',
          value: '4'
        },
        {
          label: '结算失败',
          value: '5'
        }
      ],
      formatter: function (row) {
        return row.stateStr
      }
    },
    {
      label: '交易日期',
      prop: 'createTime',
      width: 160
    },
  ]
}
