export const tableOption = (edit = false, admin = false) => {
  let option = {
    labelWidth: 160,
    menuWidth: 120,
    menu: true,
    columns: [
      {
        label: '城市',
        prop: 'cityName',
        span: 24,
        search: 'basic',
        maxlength: 50,
        searchPlaceholder: '请输入城市名称'
      },
      {
        label: '状态',
        prop: 'status',
        span: 24,
        formatter: function(row) {
          if (row.isOpening) {
            if (row.state == 0) {
              return '已开通'
            } else {
              return '已锁定'
            }
          } else {
            return '未开通'
          }
        }
      },
      {
        label: '最高权限账号',
        prop: 'userName',
        span: 24,
        formatter: function(row) {
          return row.userName || '/'
        }
      }
    ]
  }
  return option
}

export const accountOption = () => {
  let option = {
    labelWidth: 160,
    menuWidth: 120,
    menu: true,
    columns: [
      {
        label: '订单号',
        prop: 'orderNumber',
        search: true,
        maxlength: 50,
      },
      {
        label: '订单创建日期',
        prop: 'orderCreateTime',
        width: '160',
      },
      {
        label: '交易类型',
        prop: 'transactionType',
        type: 'select',
        width: '100',
        dicData: [
          {
            label: '抽成',
            value: 3
          },
          {
            label: '微信手续费',
            value: 7
          },
          {
            label: '充值',
            value: 11
          },
          {
            label: '结算',
            value: 9
          }
        ],
        search: true,
        formatter: function (row) {
          return row.transactionTypeStr
        }
      },
      {
        label: '交易金额',
        prop: 'amount',
        width: '120',
        formatter: function (row) {
          return row.type === 1 ? `-${row.amount}` : row.amount
        }
      },
      {
        label: '账户余额',
        prop: 'balance',
        width: '120',
      },
      {
        label: '订单支付时间',
        prop: 'finishTime',
        width: '160',
      },
    ]
  }
  return option
}
