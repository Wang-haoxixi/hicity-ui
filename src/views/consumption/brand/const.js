export const tableOption = (admin = false) => {
  let columns = [
    {
      label: '品牌ID',
      prop: 'brandId',
    },
    {
      label: '品牌名称',
      prop: 'brandName',
    },
    {
      label: '下设门店',
      prop: 'merchantCount',
    },
    {
      label: '创建城市',
      prop: 'createByCityName',
    },
  ]

  let option = {
    header: true,
    menu: true,
    labelWidth: 160,
    menuWidth: 150,
    columns
  }
  
  return option
}
