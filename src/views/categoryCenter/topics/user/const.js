export const tableOption = (admin = false) => {
  let columns = [
    {
      label: '话题名称',
      prop: 'topicsName',
      span: 24,
      search: true,
      maxlength: 50,
    },
  ]
  let option = {
    menu: true,
    index: true,
    labelWidth: '160px',
    menuWidth: 100,
    columns
  }
  
  return option
}
