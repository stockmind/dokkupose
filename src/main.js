import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/buefy.js'

Vue.config.productionTip = false

import contenteditable from 'vue-contenteditable'
Vue.use(contenteditable)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')