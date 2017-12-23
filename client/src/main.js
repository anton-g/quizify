import Vue from 'vue'
import App from './App'

import router from './router'
import store from './store'

import VueSocketio from 'vue-socket.io'
import socketio from 'socket.io-client'

import 'font-awesome/scss/font-awesome.scss'
import 'izitoast/dist/css/iziToast.min.css'

Vue.use(VueSocketio, socketio(`//${window.location.hostname}:8081`, { reconnection: false }), store)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
