import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import nprogress from 'nprogress'
const Home = () => import('./views/Home.vue')
const PlayerLobby = () => import('./views/PlayerLobby.vue')
const PlayerPlay = () => import('./views/PlayerPlay.vue')
const PlayerEnd = () => import('./views/PlayerEnd.vue')
const HostCreate = () => import('./views/HostCreate.vue')
const HostLobby = () => import('./views/HostLobby.vue')
const HostPlay = () => import('./views/HostPlay.vue')
const HostEnd = () => import('./views/HostEnd.vue')

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

const router = new Router({
  mode: 'history',
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

router.beforeEach((to, from, next) => {
  nprogress.start()
  next()
})
router.afterEach(() => {
  nprogress.done()
})

export default router
