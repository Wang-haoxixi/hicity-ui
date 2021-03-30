export const tableOption = (admin = false) => {
  let columns = [
    {
      label: '游记标题',
      prop: 'travelName',
      search: true,
    },
    {
      label: '发布者',
      prop: 'realName',
      width: 150,
    },
    {
      label: '创建时间',
      prop: 'createTime',
      width: 160,
    },
  ]
  if (admin) {
    columns.push({
      label: '展示范围',
      prop: 'cityList',
      slot: true,
      width: 80,
    })
  }

  let option = {
    menuWidth: 100,
    menu: true,
    columns
  }
  
  return option
}
