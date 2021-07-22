import 'babel-polyfill'
import 'classlist-polyfill'
import Vue from 'vue'
import axios from './router/axios'
import VueAxios from 'vue-axios'
import App from './App'
import './permission' // 权限
import './error' // 日志
import router from './router/router'
import store from './store'
import { loadStyle } from './util/util'
import * as urls from '@/config/env'
import { iconfontUrl, iconfontVersion } from '@/config/env'
import * as filters from './filters' // 全局filter
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/common.scss'
import basicContainer from './components/basic-container/main'
import HcTableForm from '@/views/components/HcTableForm/index'
import HcCrud from '@/views/components/HcCrud/index'
import HcTableDataBox from '@/views/components/HcTableDataBox/index'
import Avue from '@smallwei/avue'
import '@smallwei/avue/lib/index.css'
// 插件 json 展示
import vueJsonTreeView from 'vue-json-tree-view'
import './styles/iconfont.scss'
import VCharts from 'vue-echarts' // 在 webpack 环境下指向 components/ECharts.vue
import { use } from 'echarts/core'
import './styles/font/index.scss'
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  BarChart,
  MapChart,
  LineChart,
  PieChart
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  MapChart,
  TooltipComponent,
  LegendComponent,
  TitleComponent
]);

Vue.component('v-chart', VCharts)

Vue.use(router)

Vue.use(vueJsonTreeView)

Vue.use(VueAxios, axios)

Vue.use(ElementUI, {
  size: 'medium',
  menuType: 'text'
})

Vue.use(Avue)

// 注册全局容器
Vue.component('basicContainer', basicContainer)
Vue.component('HcTableForm', HcTableForm)
Vue.component('HcTableDataBox', HcTableDataBox)
Vue.component('HcCrud', HcCrud)

// 加载相关url地址
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key]
})

// 加载过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
  loadStyle(iconfontUrl.replace('$key', ele))
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
