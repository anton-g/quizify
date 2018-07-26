import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Home from './views/Home.vue'
import PlayerLobby from './views/PlayerLobby.vue'
import PlayerPlay from './views/PlayerPlay.vue'
import PlayerEnd from './views/PlayerEnd.vue'
import HostCreate from './views/HostCreate.vue'
import HostLobby from './views/HostLobby.vue'
import HostPlay from './views/HostPlay.vue'
import HostEnd from './views/HostEnd.vue'

Vue.use(Router)

const checkIsConnectedToQuiz = (to, from, next) => {
  if (store.getters.isConnectedToQuiz) {
    next()
  } else {
    next({ name: 'home' })
  }
}

const checkHasQuiz = (to, from, next) => {
  if (store.getters.hasActiveQuiz) {
    next()
  } else {
    next({ name: 'host-create' })
  }
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/lobby',
      name: 'player-lobby',
      component: PlayerLobby,
      beforeEnter: checkIsConnectedToQuiz
    },
    {
      path: '/play',
      name: 'player-play',
      component: PlayerPlay,
      beforeEnter: checkIsConnectedToQuiz
    },
    {
      path: '/end',
      name: 'player-end',
      component: PlayerEnd,
      beforeEnter: checkIsConnectedToQuiz
    },
    {
      path: '/create',
      name: 'host-create',
      component: HostCreate
    },
    {
      path: '/create/lobby',
      name: 'host-lobby',
      component: HostLobby,
      beforeEnter: checkHasQuiz
    },
    {
      path: '/create/play',
      name: 'host-play',
      component: HostPlay,
      beforeEnter: checkHasQuiz
    },
    {
      path: '/create/end',
      name: 'host-end',
      component: HostEnd,
      beforeEnter: checkHasQuiz
    }
  ]
})
