export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  column: [
    {
      label: '组织id',
      prop: 'id',
      hide: true,
      editDisabled: true,
	  editDisplay: false,
      addDisplay: false
    },
    {
      label: '组织名称',
      prop: 'name',
      search: true,
      rules: [
        { required: true, message: '请输入组织名称', trigger: 'blur'},
        { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur'}
      ]
    },
    {
      label: '组织编号',
      type: 'number',
      prop: 'code',
      rules: [{
        required: true,
        message: '请输入组织编号',
        trigger: 'blur'
      }]
    },
    {
      label: '开始时间',
      prop: 'startTime',
      type: 'datetime',
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd',
      rules: [{
        required: true,
        message: '请输入结束时间',
        trigger: 'blur'
      }]
    },
    {
      label: '结束时间',
      prop: 'endTime',
      type: 'datetime',
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd',
      rules: [{
        required: true,
        message: '请输入结束时间',
        trigger: 'blur'
      }]
    },
    {
      label: '状态',
      prop: 'status',
      type: 'radio',
      border:true,
      dicUrl: '/admin/dict/type/status_type',
      search: true
    }
  ]
}
