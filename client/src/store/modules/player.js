import axios from 'axios'
import Vue from 'vue'
import router from '@/router'

import * as types from '../mutation-types'

const socketBus = new Vue()

const state = {
  me: undefined,
  quizInfo: undefined,
  paused: false
}

const getters = {
  isConnectedToQuiz (state, getters, rootState) {
    return rootState.common.connected && !!state.me && !!state.quizInfo
  }
}

const mutations = {
  [types.PLAYER_JOIN] (state, player) {
    state.me = player
  },
  [types.UPDATE_QUIZ_INFO] (state, quizInfo) {
    state.quizInfo = quizInfo
  },
  [types.SOCKET_PAUSE] (state) {
    state.paused = true
  },
  [types.SOCKET_RESUME] (state) {
    state.paused = false
  },
  [types.SOCKET_SCORED] (state, score) {
    if (state.me) {
      state.me.score += score
    }
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

    const player = data.player
    const game = data.game

    socketBus.$socket.emit('JOIN', player.id)
    // TODO ack
    commit(types.PLAYER_JOIN, player)
    commit(types.UPDATE_QUIZ_INFO, game)
  },
  socket_start: ({ commit, state }) => {
    router.push({ name: 'player-play' })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
