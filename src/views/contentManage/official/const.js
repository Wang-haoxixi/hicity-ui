export const tableOption = (admin = false) => {
  let columns = [
    {
      prop: "searchName",
      label: "名称",
      search: true,
      maxlength: 50,
      hidden: true,
    },
    {
      prop: "officialNewsName",
      label: "名称",
      slot: true,
    },
    {
      prop: "officialColumnName",
      label: "栏目",
      width: 120
    },
    {
      prop: "createByName",
      label: "发布者",
      width: 180,
    },
    {
      prop: "state",
      label: "状态",
      width: 90,
      formatter: function(data) {
        if (data.state == 0) {
          return "草稿";
        } else if (data.state == 1) {
          return "已生效";
        } else if (data.state == 2) {
          return "已失效";
        } else {
          return "";
        }
      }
    },
    {
      prop: "createTime",
      label: "创建时间",
      width: 160
    }
  ];
  if (admin) {
    columns.push({
      label: "展示范围",
      prop: "cityList",
      slot: true,
      width: 80
    });
  }

  let option = {
    menu: [
      {
        label: "编辑",
        fun: "toUpdate"
      },
      {
        label: "删除",
        fun: "toDelete"
      }
    ],
    menuWidth: "100px",
    columns,
  };
  return option;
};
