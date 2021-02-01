export const tableOption = (edit = false, admin = false) => {
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
    menuWidth: 220,
    column: [
      {
        label: '城市',
        prop: 'cityName',
        span: 24,
        search: true,
        searchPlaceholder: '请输入城市名称'
      }, 
      {
        label: '状态',
        prop: 'status',
        span: 24,
        formatter: function(row) {
          if (row.isOpening) {
            if (row.state == 0) {
              return '已开通'
            } else {
              return '已锁定'
            }
          } else {
            return '未开通'
          }
        }
      },
      {
        label: '最高权限账号',
        prop: 'userName',
        span: 24,
        formatter: function(row) {
          return row.userName || '/'
        }
      }
    ]
  }
  return option
}