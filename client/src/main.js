import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import VueMq from 'vue-mq'
import VueSocketio from 'vue-socket.io-extended'
import io from 'socket.io-client'
import izitoast from 'izitoast'
import nprogress from 'nprogress'
import * as Sentry from '@sentry/browser'

import 'izitoast/dist/css/iziToast.min.css'
import 'nprogress/nprogress.css'
import './registerServiceWorker'
import './devTools'

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

nprogress.configure({ showSpinner: false })

Vue.use(VueMq, {
  breakpoints: {
    tablet: 769,
    desktop: 1024,
    widescreen: 1216,
    fullhd: Infinity
  }
})
Vue.use(VueSocketio, io(process.env.VUE_APP_API_URL), store)

Sentry.init({
  dsn: process.env.VUE_APP_SENTRY_DSN,
  integrations: [new Sentry.Integrations.Vue({ Vue })]
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
