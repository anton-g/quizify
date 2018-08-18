import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import VueMq from 'vue-mq'
import VueSocketio from 'vue-socket.io-extended'
import io from 'socket.io-client'
import izitoast from 'izitoast'

import 'izitoast/dist/css/iziToast.min.css'

require('./design/bulma.scss')

Vue.config.productionTip = false

izitoast.settings({
  position: 'topCenter',
  transitionIn: 'fadeInDown',
  transitionOut: 'fadeOutUp',
  transitionInMobile: 'fadeInDown',
  transitionOutMobile: 'fadeOutUp',
  progressBar: false
})

Vue.use(VueMq, {
  breakpoints: {
    tablet: 769,
    desktop: 1024,
    widescreen: 1216,
    fullhd: Infinity
  }
})
Vue.use(VueSocketio, io(process.env.VUE_APP_API_URL), store)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
