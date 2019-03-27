import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
/* 引入字体图标 */
import './assets/styles/icon.css'
/* 引入初始化样式 */
import './assets/styles/global.scss'
/* 解决移动端点击延迟 */
import FastClick from 'fastclick'

Vue.config.productionTip = false
FastClick.attach(document.body)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
