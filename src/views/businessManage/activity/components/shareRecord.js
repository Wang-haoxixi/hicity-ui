export const tableOption = (isAdmin) => {
    let columns = [
      {
        label: '分销人员',
        prop: 'shareName',
        search: 'basic',
      },
      {
        label: '活动名称',
        prop: 'activityName',
        width: "430px",
        slot: true,
      },
      {
        label: '分享次数',
        prop: 'shareNum',
        slot: true
      },
      {
        label: '报名人次',
        prop: 'applyNum',
        slot: true,
      },
    ]
    if (!isAdmin) {
      columns.splice(3, 1)
    }
    return {
      defaultExpand: true,
      menu: true,
      menuWidth: 220,
      columns
    }
  }