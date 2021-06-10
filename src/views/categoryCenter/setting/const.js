export const tableOption = {
  addBtn: true,
  menu: ['edit', 'delete'],
  labelWidth: '150px',
  columns: [
    {
      label: '标签名称',
      prop: 'name',
      maxlength: 20,
      search: 'basic',
      trim: true,
      rules: [{required: true, message: '请输入标签名称', trigger: 'blur'}]
    }
  ]
}

