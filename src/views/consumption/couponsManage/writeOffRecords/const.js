export const tableOption = () => {
  let columns = [
    {
      label: '核销时间',
      prop: 'writeOffTime',
      width: 200
    },
    {
      label: '用户名',
      prop: 'userName',
      width: 120
    },
    {
      label: '联系方式',
      prop: 'phone',
      width: 120,
    },
    {
      label: '券类型',
      prop: 'type',
      type: 'select',
      dicData: [
        {
          label: '平台券',
          value: '1'
        },
        {
          label: '商户券',
          value: '0'
        }
      ],
      width: 100,
    },
    {
      label: '券名',
      prop: 'name',
      slot: true,
      search: true,
    },
    {
      label: '核销商户',
      prop: 'merchantName',
      slot: true,
    },
    {
      label: '核销人员',
      prop: 'writeOffUserName',
      width: 120
    },
    {
      label: '核销员手机号',
      prop: 'writeOffStatus',
      width: 120,
    },
  ]

  let option = {
    menuWidth: 80,
    menu: true,
    columns
  }
  
  return option
}
