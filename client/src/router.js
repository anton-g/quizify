import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
const Home = () => import('./views/Home.vue')
const PlayerLobby = () => import(/* webpackChunkName: "group-player" */'./views/PlayerLobby.vue')
const PlayerPlay = () => import(/* webpackChunkName: "group-player" */'./views/PlayerPlay.vue')
const PlayerEnd = () => import(/* webpackChunkName: "group-player" */'./views/PlayerEnd.vue')
const HostCreate = () => import(/* webpackChunkName: "group-host" */'./views/HostCreate.vue')
const HostLobby = () => import(/* webpackChunkName: "group-host" */'./views/HostLobby.vue')
const HostPlay = () => import(/* webpackChunkName: "group-host" */'./views/HostPlay.vue')
const HostEnd = () => import(/* webpackChunkName: "group-host" */'./views/HostEnd.vue')

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
