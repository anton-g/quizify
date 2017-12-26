import Vue from 'vue'
import izitoast from 'izitoast'
import router from '@/router'

import * as types from '../mutation-types'

const socketBus = new Vue()

const state = {
  user: {},
  selectedQuizKey: '',
  quizStarted: false,
  isPaused: false,
  won: false
}

const getters = {
  isConnectedToQuiz (state, getters, rootState) {
    return rootState.common.connected && state.selectedQuizKey
  },
  isQuizStarted (state) {
    return state.quizStarted
  }
}

const mutations = {
  [types.QUIZ_SELECT_KEY] (state, key) {
    state.selectedQuizKey = key
  },
  [types.SET_USER] (state, user) {
    state.user = user
  },
  [types.QUIZ_ENDED] (state, won) {
    state.won = won
  },
  [types.SOCKET_START_QUIZ] (state) {
    state.quizStarted = true
  },
  [types.SOCKET_QUIZ_PAUSE] (state) {
    state.isPaused = true
  },
  [types.SOCKET_QUIZ_RESUME] (state) {
    state.isPaused = false
  }
}

const actions = {
  verifyQuizKey ({ commit, state }, quizKey) {
    return new Promise((resolve, reject) => {
      socketBus.$socket.emit('quiz_verify_key', quizKey, verified => {
        if (verified === true) {
          commit(types.QUIZ_SELECT_KEY, quizKey)
          resolve(verified)
        } else {
          reject(new Error('could not find quiz'))
        }
      })
    })
  },
  joinSelectedQuiz ({ commit, state }, username) {
    return new Promise((resolve, reject) => {
      socketBus.$socket.emit('quiz_join', state.selectedQuizKey, username, (success, user) => {
        if (success === true) {
          commit(types.SET_USER, user)
          resolve(true)
        } else {
          reject(new Error('could not join quiz'))
        }
      })
    })
  },
  leaveQuiz ({ commit, state }) {
    socketBus.$socket.emit('quiz_leave')
    commit(types.QUIZ_SELECT_KEY, '')
    commit(types.SET_USER, {})
  },
  socket_quizScored (_, score) {
    izitoast.show({
      title: 'Correct!',
      message: `Woho! You answered correctly! ${score > 1 ? `You scored ${score} points!` : ''}`,
      icon: 'fa fa-star',
      close: false,
      drag: false
    })
  },
  socket_quizEnded ({ commit }, won) {
    commit(types.QUIZ_ENDED, won)
    router.push({ name: 'player-result' })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
