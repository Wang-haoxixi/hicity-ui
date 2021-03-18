import { rule } from "@/util/validateRules";
export const tableOption = (admin = false) => {
  let columns = [
    {
      label: '角色名称',
      prop: 'roleName',
      span: 24,
      rules: [
        { required: true, message: '角色名称不能为空', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
      ]
    },
    {
      width: 120,
      label: '角色标识',
      prop: 'roleCode',
      span: 24,
      editDisabled: true,
      rules: [
        { required: true, message: '角色标识不能为空', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'},
        { validator: rule.validatorKey, trigger: 'blur'}
      ]
    },
    {
      label: '角色描述',
      prop: 'roleDesc',
      type: 'textarea',
      span: 24,
      rules: [
        { max: 128, message: '长度在 128 个字符内', trigger: 'blur' }
      ]
    },
    {
      label: '创建时间',
      prop: 'createTime',
      width: 160,
      formHidden: true,
      span: 24
    }
  ]
  return {
    index: true,
    indexLabel: '序号',
    labelWidth: '150px',
    menu: true,
    menuWidth: 240,
    columns
  }
}
