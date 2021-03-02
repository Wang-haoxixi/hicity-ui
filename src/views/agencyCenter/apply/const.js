export const tableOption = {
  menuWidth: "180px",
  // header: true,
  menu: [
    {
      label: "查看详情",
      fun: "handleView"
    },
    // "add",
    // "view",
    // "edit",
    // "delete"
  ],
  columns: [
    {
      prop: "id",
      label: "用户账号",
      // hidden: false,  // 分页table中该列是否隐藏   不写默认false 不隐藏
      formHidden: true, // 表单中该字段是否隐藏   不写默认false 不隐藏
      // addHidden: true,  // 默认新增时表单中该字段是否隐藏   不写默认false 不隐藏
      editHidden: true, // 默认编辑时表单中该字段是否隐藏   不写默认false 不隐藏
      viewHidden: true // 默认查看时表单中该字段是否隐藏   不写默认false 不隐藏
    },
    {
      prop: "name",
      label: "姓名",
      // slot: true,
      // formSlot: true,
      search: true
    },
    {
      prop: "mobile",
      label: "联系方式"
    },
    {
      prop: "cityName",
      label: "地区"
    },
    {
      prop: "cooperationIntention",
      label: "合作意向"
    }
  ]
};
