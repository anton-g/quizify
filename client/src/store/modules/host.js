// import Vue from 'vue'
import router from '@/router'

import * as types from '../mutation-types'

// const socketBus = new Vue()

const state = {
  playlist: undefined
}

const getters = {

}

const mutations = {
  [types.SET_PLAYLIST] (state, playlist) {
    state.playlist = playlist
  }
}

const actions = {
  createQuiz () {
    // todo lot of spotify stuff
    router.push({ name: 'host-create' })
  },
  selectPlaylist ({ commit }, playlist) {
    commit(types.SET_PLAYLIST, playlist)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
