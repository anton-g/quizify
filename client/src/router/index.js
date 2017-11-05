import Vue from 'vue'
import Router from 'vue-router'

import LandingPage from '@/pages/LandingPage'
import CreateQuiz from '@/pages/CreateQuiz'

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
      name: 'create',
      component: CreateQuiz
    }
  ]
})
