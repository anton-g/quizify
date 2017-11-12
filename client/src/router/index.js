import Vue from 'vue'
import Router from 'vue-router'

import LandingPage from '@/pages/LandingPage'
import CreateQuiz from '@/pages/CreateQuiz'
import CreateQuizLogin from '@/components/CreateQuizLogin'
import CreateQuizPlaylist from '@/components/CreateQuizPlaylist'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage
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
          name: 'create-quiz-songs',
          component: CreateQuizPlaylist,
          meta: { step: 2 }
        }
      ]
    }
  ]
})
