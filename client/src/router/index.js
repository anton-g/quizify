import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import LandingPage from '@/pages/LandingPage'

import PlayerPage from '@/pages/PlayerPage'
import PlayerJoin from '@/components/player/PlayerJoin'
import PlayerLobby from '@/components/player/PlayerLobby'
import PlayerGame from '@/components/player/PlayerGame'

import HostPage from '@/pages/HostPage'
import HostNewQuiz from '@/components/host/HostNewQuiz'
import HostLogin from '@/components/host/HostLogin'
import HostSelectPlaylist from '@/components/host/HostSelectPlaylist'
import HostLobby from '@/components/host/HostLobby'
import HostGame from '@/components/host/HostGame'
import HostResult from '@/components/host/HostResult'

Vue.use(Router)

const checkAuthorization = (to, from, next) => {
  if (store.getters.isAuthorized) {
    next()
  } else {
    next({ name: 'create-quiz-login' })
  }
}
const checkIsConnectedToQuiz = (to, from, next) => {
  console.log(store.getters)
  if (store.getters.isConnectedToQuiz) {
    next()
  } else {
    next({ name: 'landing' })
  }
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage
    },
    {
      path: '/play',
      component: PlayerPage,
      children: [
        {
          path: ':id',
          name: 'play',
          component: PlayerJoin
        },
        {
          path: 'lobby',
          name: 'lobby',
          beforeEnter: checkIsConnectedToQuiz,
          component: PlayerLobby
        },
        {
          path: '/game',
          name: 'game',
          beforeEnter: checkIsConnectedToQuiz,
          component: PlayerGame
        }
      ]
    },
    {
      path: '/host',
      component: HostPage,
      children: [
        {
          path: 'create',
          component: HostNewQuiz,
          children: [
            {
              path: '/',
              name: 'create',
              component: HostLogin,
              meta: { step: 1 }
            },
            {
              path: 'login',
              name: 'create-quiz-login',
              component: HostLogin,
              meta: { step: 1 }
            },
            {
              path: 'songs',
              name: 'create-quiz-playlist',
              component: HostSelectPlaylist,
              beforeEnter: checkAuthorization,
              meta: { step: 2 }
            },
            {
              path: 'lobby',
              name: 'create-quiz-lobby',
              component: HostLobby,
              beforeEnter: checkAuthorization,
              meta: { step: 3 }
            }
          ]
        },
        {
          path: 'game',
          name: 'host-game',
          component: HostGame,
          beforeEnter: checkAuthorization
        },
        {
          path: 'result',
          name: 'game-result',
          component: HostResult,
          beforeEnter: checkAuthorization
        }
      ]
    },
    {
      path: '*',
      component: LandingPage // TODO replace with 404 page
    }
  ]
})
