import Vue from 'vue'
import App from './App'

import router from './router'
import i18n from './i18n'
import store from './store'

import VueSocketio from 'vue-socket.io'
import socketio from 'socket.io-client'
import izitoast from 'izitoast'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

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

Raven
    .config('https://890cb60280ca496ab20940cc62ba7857@sentry.io/265884')
    .addPlugin(RavenVue, Vue)
    .install()

const socket = socketio(`//${window.location.hostname}:8081`, { reconnection: false, 'sync disconnect on unload': true })
console.log(socket)
socket.io.on('disconnect', () => {
  console.log('test')
})

Vue.use(VueSocketio, socket, store)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  store,
  router,
  render: h => h(App)
})
