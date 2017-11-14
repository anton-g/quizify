import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import LandingPage from '@/pages/LandingPage'

import JoinQuiz from '@/pages/JoinQuiz'

import CreateQuiz from '@/pages/CreateQuiz'
import CreateQuizLogin from '@/components/CreateQuizLogin'
import CreateQuizPlaylist from '@/components/CreateQuizPlaylist'
import CreateQuizPlayers from '@/components/CreateQuizPlayers'

Vue.use(Router)

const checkAuthorization = (to, from, next) => {
  if (store.getters.isAuthorized) {
    next()
  } else {
    next({ name: 'create-quiz-login' })
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
      path: '/join/:id',
      name: 'join',
      component: JoinQuiz
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
          path: 'friends',
          name: 'create-quiz-players',
          component: CreateQuizPlayers,
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
