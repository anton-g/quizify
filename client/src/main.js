import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMq from 'vue-mq'
import VueSocketio from 'vue-socket.io-extended'
import io from 'socket.io-client'

Vue.config.productionTip = false

Vue.use(VueMq, {
  breakpoints: {
    tablet: 769,
    desktop: 1024,
    widescreen: 1216,
    fullhd: Infinity
  }
})
Vue.use(VueSocketio, io('http://localhost:3000'), store)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
