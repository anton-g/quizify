import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import LandingPage from '@/pages/LandingPage'

import PlayQuiz from '@/pages/PlayQuiz'
import PlayQuizJoin from '@/components/PlayQuizJoin'
import PlayQuizLobby from '@/components/PlayQuizLobby'
import PlayQuizBuzzer from '@/components/PlayQuizBuzzer'

import CreateQuiz from '@/pages/CreateQuiz'
import CreateQuizLogin from '@/components/CreateQuizLogin'
import CreateQuizPlaylist from '@/components/CreateQuizPlaylist'
import CreateQuizLobby from '@/components/CreateQuizLobby'

Vue.use(Router)

const checkAuthorization = (to, from, next) => {
  if (store.getters.isAuthorized) {
    next()
  } else {
    next({ name: 'create-quiz-login' })
  }
}
const checkIsConnectedToQuiz = (to, from, next) => {
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
      name: 'play',
      component: PlayQuiz,
      children: [
        {
          path: ':id',
          name: 'play',
          component: PlayQuizJoin
        },
        {
          path: 'lobby',
          name: 'lobby',
          beforeEnter: checkIsConnectedToQuiz,
          component: PlayQuizLobby
        },
        {
          path: '/game',
          name: 'game',
          beforeEnter: checkIsConnectedToQuiz,
          component: PlayQuizBuzzer
        }
      ]
    },
    {
      path: '/create',
      component: CreateQuiz,
      children: [
        {
          path: '/',
          name: 'create',
          component: CreateQuizLogin,
          meta: { step: 1 }
        },
        {
          path: 'login',
          name: 'create-quiz-login',
          component: CreateQuizLogin,
          meta: { step: 1 }
        },
        {
          path: 'songs',
          name: 'create-quiz-playlist',
          component: CreateQuizPlaylist,
          beforeEnter: checkAuthorization,
          meta: { step: 2 }
        },
        {
          path: 'lobby',
          name: 'create-quiz-lobby',
          component: CreateQuizLobby,
          beforeEnter: checkAuthorization,
          meta: { step: 3 }
        }
      ]
    },
    {
      path: '*',
      component: LandingPage // TODO replace with 404 page
    }
  ]
})
