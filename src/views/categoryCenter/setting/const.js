export const tableOption = {
  menu: ['add', 'edit', 'delete'],
  labelWidth: '150px',
  columns: [
    {
      label: '标签名称',
      prop: 'name',
      maxlength: 20,
      search: true,
      rules: [{required: true,message: '请输入标签名称', trigger: 'blur'}]
    },
    {
      label: '标签编码',
      prop: 'tagCode',
      maxlength: 20,
      search: true,
      rules: [{required: true,message: '请输入标签编码', trigger: 'blur'}]
    },
    {
      label: '是否允许城市停用',
      prop: 'editable',
      type: 'switch',
      inactiveText: '不允许',
      inactiveValue: false,
      activeText: '允许',
      activeValue: true,
      value: false,
      rules: [{required: true,message: '请选择是否允许城市停用', trigger: 'blur'}]
    }
  ]
}