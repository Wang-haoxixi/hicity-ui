export const tableOption = () => {
  let columns = [
    {
      label: 'ID',
      prop: 'couponsId',
      width: 80,
    },
    {
      label: '券名称',
      prop: 'name',
      search: true,
      maxlength: 50,
    },
    {
      label: '优先级',
      prop: 'orderNum',
      width: 80,
    },
    {
      label: '有效期开始时间',
      prop: 'availableStartTime',
      width: 160,
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
        },
        {
          label: '店铺券',
          value: '2'
        }
      ],
      formatter: function (row) {
        if (row.type == '0') {
          return row.deductionType == '1' ? '店铺券' : '商户券'
        } else {
          return '平台券'
        }
      }
    },
    {
      label: '优惠券种类',
      prop: 'deductionType',
      width: 100,
      type: 'select',
      dicData: [
        {
          label: '店铺折扣券',
          value: '1'
        },
        {
          label: '立减现金券',
          value: '2'
        },
        {
          label: '满减现金券',
          value: '3'
        },
        {
          label: '满减折扣券',
          value: '4'
        },
        {
          label: '立减折扣券',
          value: '5'
        },
      ]
    },
    {
      label: '发券人',
      prop: 'userRealName',
      width: 80,
      search: true,
    },
    {
      label: '发券店铺',
      prop: 'storeName',
      width: 100,
    },
    {
      label: '精选推荐位',
      prop: 'isChoice',
      width: 100,
      search: true,
      type: 'select',
      dicData: [
        {
          label: '全部',
          value: undefined,
        },
        {
          label: '是',
          value: '1'
        },
        {
          label: '否',
          value: '0'
        }
      ]
    }
  ]

  let option = {
    menuWidth: 120,
    menu: true,
    header: true,
    columns
  }
  
  return option
}
