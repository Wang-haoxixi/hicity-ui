export const tableOption = (admin = false) => {
  let columns = [
    {
      label: '发布者',
      prop: 'realName',
    },
    {
      label: '游记标题',
      prop: 'travelName',
      search: true,
    },
    {
      label: '创建时间',
      prop: 'createTime',
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
