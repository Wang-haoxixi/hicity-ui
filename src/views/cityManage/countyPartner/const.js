export const tableOption = (edit = false, admin = false) => {
  let option = {
    labelWidth: 160,
    menuWidth: 90,
    menu: true,
    columns: [
      {
        label: '区县',
        prop: 'cityName',
        span: 24,
        search: true,
        maxlength: 50,
        searchPlaceholder: '请输入区县名称'
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
