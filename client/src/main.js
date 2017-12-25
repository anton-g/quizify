import Vue from 'vue'
import App from './App'

import router from './router'
import store from './store'

import VueSocketio from 'vue-socket.io'
import VueI18n from 'vue-i18n'
import socketio from 'socket.io-client'
import izitoast from 'izitoast'

import 'font-awesome/scss/font-awesome.scss'
import 'izitoast/dist/css/iziToast.min.css'

izitoast.settings({
  position: 'topCenter',
  transitionIn: 'fadeInDown',
  transitionOut: 'fadeOutUp',
  transitionInMobile: 'fadeInDown',
  transitionOutMobile: 'fadeOutUp',
  progressBar: false
})

Vue.use(VueI18n)
Vue.use(VueSocketio, socketio(`//${window.location.hostname}:8081`, { reconnection: false }), store)
Vue.config.productionTip = false

let lang = ((navigator.languages && navigator.languages.length
  ? navigator.languages[0]
  : navigator.userLanguage) || navigator.language).split('-')[0]

const i18n = new VueI18n({
  locale: lang,
  fallbackLocale: 'en'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  store,
  router,
  render: h => h(App)
})
