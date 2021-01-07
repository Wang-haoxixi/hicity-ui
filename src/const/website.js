export default {
  title: 'Gds',
  logo: 'Gds',
  key: 'Gds', // 配置主键,目前用于存储
  indexTitle: 'Gds微服务底层框架',
  whiteList: ['/login', '/404', '/401', '/lock'], // 配置无权限可以访问的页面
  whiteTagList: ['/login', '/404', '/401', '/lock'], // 配置不添加tags页面 （'/advanced-router/mutative-detail/*'——*为通配符）
  lockPage: '/lock',
  tokenTime: 6000,
  infoTitle: 'Gds微服务底层框架',
  statusWhiteList: [428],
  // 配置首页不可关闭
  isFirstPage: false,
  fistPage: {
    label: '首页',
    value: '/wel/index',
    params: {},
    query: {},
    group: [],
    close: false
  },
  // 配置菜单的属性
  menu: {
    props: {
      label: 'label',
      path: 'path',
      icon: 'icon',
      children: 'children'
    }
  }
}
