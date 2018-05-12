import axios from 'axios'
import Vue from 'vue'

import * as types from '../mutation-types'

const socketBus = new Vue()

const state = {
}

const getters = {
}

const mutations = {
  [types.PLAYER_JOIN] (state, player) {
  }
}

const actions = {
  async joinQuiz ({ commit, state }, { key, name }) {
    const { status, data } = await axios.post(`http://localhost:3000/game/${key}/join`, {
      name: name
    })

    if (status !== 200 || data.error) {
      console.log('error')
      return
    }

    socketBus.$socket.emit('JOIN', data.id)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
