// import Vue from 'vue'
import router from '@/router'

// import * as types from '../mutation-types'

// const socketBus = new Vue()

const state = {
  quizOptions: undefined
}

const getters = {

}

const mutations = {

}

const actions = {
  createQuiz () {
    // todo lot of spotify stuff
    router.push({ name: 'host-create' })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
