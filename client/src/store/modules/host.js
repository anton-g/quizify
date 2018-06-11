import Vue from 'vue'
import axios from 'axios'
import router from '@/router'

import * as types from '../mutation-types'

const socketBus = new Vue()

const state = {
  playlist: undefined,
  quiz: undefined
}

const getters = {

}

const mutations = {
  [types.SET_PLAYLIST] (state, playlist) {
    state.playlist = playlist
  },
  [types.SET_QUIZ] (state, quiz) {
    state.quiz = quiz
  }
}

const actions = {
  login () {
    // todo lot of spotify stuff
    router.push({ name: 'host-create' })
  },
  selectPlaylist ({ commit }, playlist) {
    commit(types.SET_PLAYLIST, playlist)
  },
  async create ({ commit }) {
    const { status, data } = await axios.post(`http://localhost:3000/game`)

    if (status !== 201 || data.error) {
      console.log('error')
      return
    }

    commit(types.SET_QUIZ, data)
    // TODO loading indicator
    // TODO maybe have a timeout here to check if something goes wrong with socket?

    socketBus.$socket.emit('HOST', {
      key: data.key,
      secret: data.secret
    }, (res) => {
      commit(types.SET_QUIZ, res)
      router.push({ name: 'host-lobby' })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
