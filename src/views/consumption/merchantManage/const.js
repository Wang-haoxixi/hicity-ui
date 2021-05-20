import { getDic } from "@/util/dic"

export const tableOption = (admin = false) => {
  let columns = [
    {
      label: '商户账户',
      prop: 'phone',
      width: "120",
      search: true,
    },
    {
      label: '姓名',
      prop: 'name',
      maxlength: 50,
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
      ]
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