export const tableOption = () => {
  let columns = [
    {
      label: '评论类型',
      prop: 'isSuper',
      search: true,
      type: 'select',
      dicData: [
        {
          label: '评论',
          value: true
        },
        {
          label: '回复',
          value: false
        }
      ],
      width: 100,
      formatter: function (row) {
        if (row.rankingCommentId == '0') {
          return '评论'
        } else {
          return '回复'
        }
      }
    },
    {
      label: '评论日期',
      prop: 'time',
      search: true,
      searchValue: [],
      type: 'daterange',
      width: 160,
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      formatter: function (row) {
        return row.createTime
      }
    },
    {
      label: '评论人姓名',
      prop: 'createByName',
      search: true,
      maxlength: 50,
      width: 120,
    },
    {
      label: '评论内容',
      prop: 'content',
    },
    {
      label: '当前状态',
      prop: 'isHidden',
      width: 100,
      search: true,
      type: 'select',
      dicData: [
        {
          label: '正常',
          value: false
        },
        {
          label: '隐藏',
          value: true
        }
      ]
    }
  ]

  let option = {
    menuWidth: 100,
    menu: true,
    columns
  }
  
  return option
}
