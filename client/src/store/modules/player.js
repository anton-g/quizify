import axios from 'axios'
import Vue from 'vue'
import router from '@/router'

import * as types from '../mutation-types'

const socketBus = new Vue()

const state = {
  me: undefined,
  quizInfo: undefined
}

const getters = {
  isConnectedToQuiz (state, getters, rootState) {
    return rootState.common.connected && !!state.me && !!state.quizInfo
  },
  paused (state) {
    return state.quizInfo && state.quizInfo.state === 'PAUSED'
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
    state.quizInfo.state = 'PAUSED'
  },
  [types.SOCKET_RESUME] (state) {
    state.quizInfo.state = 'PLAYING'
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
    commit(types.PLAYER_JOIN, player)
    commit(types.UPDATE_QUIZ_INFO, game)

    socketBus.$socket.emit('JOIN', player.id, (game) => {
      // Just in case game have been updated
      commit(types.UPDATE_QUIZ_INFO, game)

      localStorage.setItem('socket', socketBus.$socket.id)

      router.push({ name: 'player-lobby' })
    })
  },
  async reconnectQuiz ({ commit, state }, socket) {
    console.log('Reconnecting..')
    socketBus.$socket.emit('RECONN', socket, (data) => {
      if (!data) {
        console.log('Could not reconnect.. :(')
        return
      }

      console.log('Successfully reconnected! Restoring game state..')
      const player = data.player
      const game = data.game
      commit(types.PLAYER_JOIN, player)
      commit(types.UPDATE_QUIZ_INFO, game)

      localStorage.setItem('socket', socketBus.$socket.id)

      if (game.state === 'LOBBY') {
        router.push({ name: 'player-lobby' })
      } else if (game.state === 'PLAYING' || game.state === 'PAUSED') {
        router.push({ name: 'player-play' })
      } else {
        // TODO handle other states
        console.log('-unknown state-')
      }
    })
  },
  socket_start: ({ commit, state }) => {
    router.push({ name: 'player-play' })
    // TODO update game state
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
