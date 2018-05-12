import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import PlayerLobby from './views/PlayerLobby.vue'
import PlayerPlay from './views/PlayerPlay.vue'

Vue.use(Router)

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
      component: PlayerLobby
    },
    {
      path: '/play',
      name: 'player-play',
      component: PlayerPlay
    }
  ]
})
