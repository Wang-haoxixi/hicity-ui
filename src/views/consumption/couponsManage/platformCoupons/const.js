import { getDicValue } from "@/util/dic"

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
      label: '优惠券所属门类',
      prop: 'category',
      width: 100,
      type: 'select',
      search: true,
      hidden: true,
      dicName: 'COUPONS_CATEGORY'
    },
    {
      label: '发券人',
      prop: 'userRealName',
    },
    {
      label: '发券人账户',
      prop: 'userAccount',
    },
    {
      label: '优惠券状态',
      prop: 'status',
      width: 100,
      search: true,
      type: 'select',
      dicData: [
        {
          label: '未上架',
          value: 1
        },
        {
          label: '已上架未发券',
          value: 2
        },
        {
          label: '已下架',
          value: 3
        },
        {
          label: '上架中',
          value: 4
        }
      ],
      formatter: function (row) {
        return getDicValue('COUPONS_STATUS', row.status)
        // if (row.status === 0) {
        //   return '待上架'
        // } else if (row.status === 1) {
        //   return '已上架'
        // } else if (row.status === 2) {
        //   return '已售罄'
        // } else if (row.status === 3) {
        //   return '已下架'
        // } else if (row.status === 4) {
        //   return '仓库中'
        // } else {
        //   return ''
        // }
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
