import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import ElementUI from 'element-ui';

import '@/plugins/axios'
import '@/plugins/element'

//读取本机文件
import VueResource from 'vue-resource'
Vue.use(VueResource)

///引入echarts
import Echarts from 'echarts'

Vue.prototype.$echarts = Echarts
import jquery from 'jquery'
Vue.prototype.$ = jquery

Vue.use(ElementUI);
Vue.config.productionTip = false
// import 'jquery'
import '@/sytles/index.css' // 全局样式表
// import '@/sytles/common.css' // 全局样式表
// import '@/sytles/map.css' // 全局样式表
import store from './store'
// import Echarts from "echarts";

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
