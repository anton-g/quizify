import Vue from 'vue'
import axios from 'axios'
import izitoast from 'izitoast'
import router from '@/router'

import * as types from '../mutation-types'

import { HOST_SOCKET_STORAGE_ITEM, API_URL } from '../../common/constants'

const socketBus = new Vue()

const state = {
  jwt: undefined,
  quiz: undefined,
  buzzedPlayer: undefined,
  result: [],
  featuredPlaylists: [],
  playlists: []
}

const getters = {
  hasActiveQuiz (state, getters, rootState) {
    return rootState.common.connected && !!state.quiz
  },
  isBuzzed (state) {
    return !!state.buzzedPlayer
  },
  isPaused (state) {
    return !!state.quiz && state.quiz.state === 'PAUSED'
  },
  finalQuestion (state) {
    return !!state.quiz && state.quiz.currentQuestionNo === state.quiz.questions.length
  },
  currentQuestion (state) {
    if (state.quiz) {
      return state.quiz.questions[state.quiz.currentQuestionNo - 1]
    }
  }
}

const mutations = {
  [types.SET_JWT] (state, jwt) {
    state.jwt = jwt
  },
  [types.SET_QUIZ] (state, quiz) {
    state.quiz = quiz
  },
  [types.UPDATE_QUIZ] (state, update) {
    state.quiz = {
      ...state.quiz,
      ...update
    }
  },
  [types.UPDATE_PLAYER] (state, player) {
    const idx = state.quiz.players.findIndex(p => p.id === player.id)
    if (idx > -1) {
      state.quiz.players[idx] = player
    }
  },
  [types.SET_BUZZED_PLAYER] (state, player) {
    state.buzzedPlayer = player
  },
  [types.SET_RESULT] (state, result) {
    state.result = result
  },
  [types.CLEANUP_HOST] (state) {
    state.playlist = undefined
    state.quiz = undefined
    state.buzzedPlayer = undefined
    state.result = []
  },
  [types.SET_FEATURED_PLAYLISTS] (state, featuredPlaylists) {
    state.featuredPlaylists = featuredPlaylists
  },
  [types.SET_USER_PLAYLISTS] (state, playlists) {
    state.playlists = playlists
  }
}

const actions = {
  login () {
    window.location = `http://localhost:3000/auth/login`
  },
  successfulLogin ({ commit }, jwt) {
    commit(types.SET_JWT, jwt)
  },
  async create ({ commit, state }, options) {
    const { status, data } = await axios.post(`${API_URL}/game`, {
      playlist: options.playlist.id
    },
    {
      headers: {
        Authorization: `Bearer ${state.jwt}`
      }
    })

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

      localStorage.setItem(HOST_SOCKET_STORAGE_ITEM, socketBus.$socket.id)
    })
  },
  async updatePlaylist ({ commit, state }, playlist) {
    socketBus.$socket.emit('CHANGE_PLAYLIST', {
      key: state.quiz.key,
      playlist: playlist.id
    }, quiz => {
      commit(types.UPDATE_QUIZ, quiz)
    })
  },
  async reconnectHost ({ commit, state }, socket) {
    izitoast.show({
      class: 'toast-reconnect',
      title: 'Reconnecting!',
      message: `Trying to reconnect to previous quiz..`
    })

    const toast = document.querySelector('.toast-reconnect')

    socketBus.$socket.emit('RECONN_H', socket, (quiz) => {
      izitoast.hide({}, toast)

      if (!quiz) {
        izitoast.show({
          title: 'Reconnect failed',
          message: 'Could not reconnect to quiz..'
        })
        return
      }

      commit(types.SET_QUIZ, quiz)

      if (quiz.state === 'LOBBY') {
        router.push({ name: 'host-lobby' })
      } else if (quiz.state === 'PLAYING' || quiz.state === 'PAUSED') {
        router.push({ name: 'host-play' })
      } else {
        // TODO handle other states
        console.log('-unknown state-')
      }

      localStorage.setItem(HOST_SOCKET_STORAGE_ITEM, socketBus.$socket.id)
    })
  },
  async start ({ state, commit }) {
    socketBus.$socket.emit('START', state.quiz.key, (quiz) => {
      commit(types.SET_QUIZ, quiz)
      router.push({ name: 'host-play' })
    })
  },
  resetBuzz ({ commit }) {
    commit(types.SET_BUZZED_PLAYER, undefined)
    socketBus.$socket.emit('RESUME', state.quiz.key)
  },
  score ({ state, commit }) {
    socketBus.$socket.emit('SCORE', state.buzzedPlayer.id, (player) => {
      commit(types.UPDATE_PLAYER, player)
      socketBus.$socket.emit('RESUME', state.quiz.key)
    })
  },
  pause ({ state, commit }) {
    socketBus.$socket.emit('PAUSE', state.quiz.key, (quiz) => {
      commit(types.UPDATE_QUIZ, quiz)
    })
  },
  resume ({ state, commit }) {
    socketBus.$socket.emit('RESUME', state.quiz.key, (quiz) => {
      commit(types.UPDATE_QUIZ, quiz)
    })
  },
  prevQuestion ({ state, commit }) {
    socketBus.$socket.emit('PREV_QUESTION', state.quiz.key, quiz => {
      commit(types.UPDATE_QUIZ, quiz)
    })
  },
  nextQuestion ({ state, commit }) {
    socketBus.$socket.emit('NEXT_QUESTION', state.quiz.key, quiz => {
      commit(types.UPDATE_QUIZ, quiz)
    })
  },
  endQuiz ({ state, commit }) {
    socketBus.$socket.emit('END_GAME', state.quiz.key, response => {
      commit(types.SET_RESULT, response.results)
      router.push({ name: 'host-end' })
    })

    localStorage.removeItem(HOST_SOCKET_STORAGE_ITEM)
  },
  cleanupHost ({ commit }) {
    commit(types.CLEANUP_HOST)
  },
  async loadFeaturedPlaylists ({ commit }) {
    const { status, data: featuredPlaylists } = await axios.get(`${API_URL}/playlist/featured`)

    if (status !== 200) {
      console.log('Could not load featured playlists')
      return
    }

    commit(types.SET_FEATURED_PLAYLISTS, featuredPlaylists)
  },
  async loadUserPlaylists ({ commit, state }) {
    const { status, data: userPlaylists } = await axios.get(`${API_URL}/playlist/`, {
      headers: {
        Authorization: `Bearer ${state.jwt}`
      }
    })

    if (status !== 200) {
      console.log('Could not load user playlists')
      return
    }

    commit(types.SET_USER_PLAYLISTS, userPlaylists)
  },
  socket_update: ({ commit }, update) => {
    commit(types.UPDATE_QUIZ, update)
  },
  socket_buzzed: ({ state, commit }, playerId) => {
    const player = state.quiz.players.find(p => p.id === playerId)
    console.log(`${player.name} buzzed`)

    commit(types.SET_BUZZED_PLAYER, player)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
