import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Home from './views/Home.vue'
import PlayerLobby from './views/PlayerLobby.vue'
import PlayerPlay from './views/PlayerPlay.vue'
import PlayerEnd from './views/PlayerEnd.vue'

Vue.use(Router)

const checkIsConnectedToQuiz = (to, from, next) => {
  console.log('getters', store.getters)
  if (store.getters.isConnectedToQuiz) {
    next()
  } else {
    next({ name: 'home' })
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
    }
  ]
})
