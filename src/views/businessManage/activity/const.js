export const tableOption = (isAdmin) => {
  let columns = [
    {
      label: '活动名称',
      prop: 'name',
      search: true,
      maxlength: 50,
      hidden: true
    },
    {
      label: '活动封面',
      prop: 'poster',
      slot: true,
      width: '150px'
    },
    {
      label: '活动信息',
      prop: 'info',
      slot: true
    },
    {
      label: '活动状态',
      prop: 'status',
      slot: true,
      width: '90px'
    },
    {
      label: '展示范围',
      prop: 'exhibits',
      slot: true,
      width: '90px'
    },
    {
      label: '报名人数',
      prop: 'joinNumber',
      width: '90px'
    }
  ]
  if (!isAdmin) {
    columns.splice(3, 1)
  }
  return {
    expand: true,
    defaultExpand: true,
    menu: true,
    menuWidth: 100,
    columns
  }
}