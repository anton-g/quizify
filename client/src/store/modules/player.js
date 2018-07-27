import axios from 'axios'
import Vue from 'vue'
import izitoast from 'izitoast'
import router from '@/router'

import * as types from '../mutation-types'

import { PLAYER_SOCKET_STORAGE_ITEM, API_URL } from '../../common/constants'

const socketBus = new Vue()

const state = {
  me: undefined,
  quizInfo: undefined,
  result: undefined
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
  [types.UPDATE_QUIZ] (state, newData) {
    state.quizInfo = {
      ...state.quizInfo,
      ...newData
    }
  },
  [types.CLEANUP_PLAYER] (state) {
    state.me = undefined
    state.quizInfo = undefined
    state.result = undefined
  },
  [types.SET_RESULT_INFO] (state, data) {
    state.result = data
  },
  [types.SOCKET_PAUSE] (state) {
    state.quizInfo.state = 'PAUSED'
  },
  [types.SOCKET_RESUME] (state) {
    state.quizInfo.state = 'PLAYING'
  },
  [types.SCORED] (state, score) {
    if (state.me) {
      state.me.score += score
    }
  }
}

const actions = {
  async joinQuiz ({ commit }, { key, name }) {
    const { status, data } = await axios.post(`${API_URL}/game/${key}/join`, {
      name: name
    })

    if (status !== 200 || data.error) {
      console.log(data.error)
      return
    }

    const player = data.player
    const game = data.game
    commit(types.PLAYER_JOIN, player)
    commit(types.UPDATE_QUIZ, game)

    socketBus.$socket.emit('JOIN', player.id, (game) => {
      // Just in case game have been updated
      commit(types.UPDATE_QUIZ, game)

      localStorage.setItem(PLAYER_SOCKET_STORAGE_ITEM, socketBus.$socket.id)

      router.push({ name: 'player-lobby' })
    })
  },
  async reconnectPlayer ({ commit }, socket) {
    izitoast.show({
      class: 'toast-reconnect',
      title: 'Reconnecting!',
      message: `Trying to reconnect to previous quiz..`
    })

    const toast = document.querySelector('.toast-reconnect')

    socketBus.$socket.emit('RECONN_P', socket, (data) => {
      izitoast.hide({}, toast)

      if (!data) {
        izitoast.show({
          title: 'Reconnect failed',
          message: 'Could not reconnect to quiz..'
        })
        return
      }

      const player = data.player
      const game = data.game
      commit(types.PLAYER_JOIN, player)
      commit(types.UPDATE_QUIZ, game)

      localStorage.setItem(PLAYER_SOCKET_STORAGE_ITEM, socketBus.$socket.id)

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
  cleanupPlayer ({ commit }) {
    commit(types.CLEANUP_PLAYER)
  },
  socket_changePlaylist: ({ commit }, data) => {
    commit(types.UPDATE_QUIZ, data)
  },
  socket_start: ({ commit }, data) => {
    router.push({ name: 'player-play' })
    commit(types.UPDATE_QUIZ, data)
  },
  socket_nextQuestion: ({ commit }, data) => {
    commit(types.UPDATE_QUIZ, data)
  },
  socket_prevQuestion: ({ commit }, data) => {
    commit(types.UPDATE_QUIZ, data)
  },
  socket_scored: ({ commit }, score) => {
    commit(types.SCORED, score)

    izitoast.show({
      title: 'Correct!',
      message: `You scored ${score} point!`
    })
  },
  socket_endGame: ({ commit }, data) => {
    router.push({ name: 'player-end' })

    commit(types.SET_RESULT_INFO, data.results)

    localStorage.removeItem(PLAYER_SOCKET_STORAGE_ITEM)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
