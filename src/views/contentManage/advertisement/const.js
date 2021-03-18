export const tableOption = (admin = false) => {
  let columns = [
    {
      label: '广告位id',
      prop: 'adslotId',
      width: 100,
      formHidden: true
    },
    {
      label: '广告位名称',
      prop: 'adslotName',
      width: 180,
      rules: [
        { required: true, message: "请输入广告位名称", trigger: "blur" },
        { min: 1, message: "请输入广告位名称", trigger: "blur" },
      ]
    },
    {
      label: '广告位描述',
      prop: 'adslotDescription',
      type: 'textarea',
      rules: [
        { required: true, message: "请输入广告位描述", trigger: "blur" },
      ]
    },
    {
      label: '广告位编码',
      prop: 'adslotNumber',
      width: 100,
      rules: [
        { required: true, message: "请输入广告位编码", trigger: "blur" },
      ]
    },
    {
      label: '类型',
      prop: 'type',
      hidden: true,
      formSlot: true,
      rules: [{ required: true, message: "请选择类型", trigger: "change" }]
    },
  ]
  if (admin) {
    columns.splice(4, 0, {
      label: '城市',
      prop: 'cityId',
      value: '',
      formatter: function (row) {
        return row.cityName
      },
      formSlot: true,
      width: 80,
      rules: [{ required: true, message: "请选择城市", trigger: "change" }]
    })
  }

  let option = {
    menuWidth: 100,
    addBtn: true,
    menu: ['edit', 'delete'],
    labelWidth: '120px',
    columns
  }
  
  return option
}
