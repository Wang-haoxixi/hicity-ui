export const tableOption = (admin = false) => {
  let column = [
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
