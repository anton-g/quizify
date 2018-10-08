import Vue from 'vue'
import axios from 'axios'
import izitoast from 'izitoast'
import router from '@/router'
import i18n from '../../i18n'

import * as types from '../mutation-types'

import { HOST_RECONNECT_ID } from '../../common/constants'
const API_URL = process.env.VUE_APP_API_URL

const socketBus = new Vue()

const state = {
  jwt: undefined,
  quiz: undefined,
  buzzedPlayer: undefined,
  result: [],
  featuredPlaylists: [],
  playlists: [],
  devices: []
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
    return !!state.quiz && state.quiz.questions && (state.quiz.currentQuestionNo === state.quiz.questions.length)
  },
  currentQuestion (state) {
    if (state.quiz && state.quiz.questions) {
      return state.quiz.questions[state.quiz.currentQuestionNo - 1]
    }
  }
}

const mutations = {
  [types.SET_JWT] (state, jwt) {
    state.jwt = jwt
    axios.defaults.headers = {
      Authorization: `Bearer ${jwt}`
    }
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
      Vue.set(state.quiz.players, idx, player)
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
  },
  [types.SET_USER_DEVICES] (state, devices) {
    state.devices = devices
  }
}

const actions = {
  login () {
    window.location = `${API_URL}/auth/login`
  },
  successfulLogin ({ commit }, jwt) {
    commit(types.SET_JWT, jwt)
  },
  async create ({ commit, state, rootState }, options) {
    const { status, data } = await axios.post(`${API_URL}/game`, {
      playlist: options.playlist.id,
      deviceId: options.device.id,
      language: rootState.common.currentLocale
    })

    if (status !== 201 || data.error) {
      console.log('error')
      return
    }

    commit(types.SET_QUIZ, data)
    // TODO loading indicator
    // TODO maybe have a timeout here to check if something goes wrong with socket?

    socketBus.$socket.emit('HOST', {
      authorization: state.jwt,
      key: data.key,
      secret: data.secret
    }, (res) => {
      commit(types.SET_QUIZ, res)
      router.push({ name: 'host-lobby' })

      localStorage.setItem(HOST_RECONNECT_ID, state.jwt)
    })
  },
  async updatePlaylist ({ commit, state, rootState }, playlist) {
    socketBus.$socket.emit('CHANGE_PLAYLIST', {
      authorization: state.jwt,
      key: state.quiz.key,
      playlist: playlist.id,
      lang: rootState.common.currentLocale
    }, quiz => {
      commit(types.UPDATE_QUIZ, quiz)
    })
  },
  async reconnectHost ({ commit, state }, jwt) {
    socketBus.$socket.emit('RECONN_H', {
      authorization: jwt
    }, (quiz) => {
      const toast = document.querySelector('.toast-reconnect')
      if (toast) {
        izitoast.hide({}, toast)
      }

      if (!quiz) {
        izitoast.show({
          title: i18n.t('toast:reconnect-failed:title'),
          message: i18n.t('toast:reconnect-failed:text')
        })
        return
      }

      commit(types.SET_QUIZ, quiz)
      commit(types.SET_JWT, jwt)

      if (quiz.state === 'LOBBY') {
        router.push({ name: 'host-lobby' })
      } else if (quiz.state === 'PLAYING' || quiz.state === 'PAUSED') {
        router.push({ name: 'host-play' })
      } else {
        // TODO handle other states
        console.log('-unknown state-')
      }
    })
  },
  async start ({ state, commit }) {
    socketBus.$socket.emit('START', {
      authorization: state.jwt,
      key: state.quiz.key
    }, (quiz) => {
      commit(types.SET_QUIZ, quiz)
      router.push({ name: 'host-play' })
    })
  },
  resetBuzz ({ commit }) {
    commit(types.SET_BUZZED_PLAYER, undefined)
  },
  score ({ dispatch, state, commit }) {
    socketBus.$socket.emit('SCORE', {
      authorization: state.jwt,
      userId: state.buzzedPlayer.id
    }, (player) => {
      commit(types.UPDATE_PLAYER, player)

      // TODO workaround; this should be updated from the server
      commit(types.UPDATE_QUIZ, {
        state: 'PAUSED'
      })
    })
  },
  pause ({ state, commit }) {
    socketBus.$socket.emit('PAUSE', {
      authorization: state.jwt,
      key: state.quiz.key
    }, (quiz) => {
      commit(types.UPDATE_QUIZ, quiz)
    })
  },
  resume ({ state, commit }) {
    socketBus.$socket.emit('RESUME', {
      authorization: state.jwt,
      key: state.quiz.key
    }, (quiz) => {
      commit(types.UPDATE_QUIZ, quiz)
    })
  },
  prevQuestion ({ state, commit }) {
    socketBus.$socket.emit('PREV_QUESTION', {
      authorization: state.jwt,
      key: state.quiz.key
    }, quiz => {
      commit(types.UPDATE_QUIZ, quiz)
    })
  },
  nextQuestion ({ state, commit }) {
    socketBus.$socket.emit('NEXT_QUESTION', {
      authorization: state.jwt,
      key: state.quiz.key
    }, quiz => {
      commit(types.UPDATE_QUIZ, quiz)
    })
  },
  endQuiz ({ state, commit }) {
    socketBus.$socket.emit('END_GAME', {
      authorization: state.jwt,
      key: state.quiz.key
    }, response => {
      commit(types.SET_RESULT, response.results)
      router.push({ name: 'host-end' })
    })

    localStorage.removeItem(HOST_RECONNECT_ID)
  },
  cleanupHost ({ commit }) {
    commit(types.CLEANUP_HOST)
  },
  hostLeave ({ dispatch, state }) {
    socketBus.$socket.emit('END_GAME', {
      authorization: state.jwt,
      key: state.quiz.key
    }, () => {
      dispatch('cleanupHost')
      router.push({ name: 'home' })
      localStorage.removeItem(HOST_RECONNECT_ID)
    })
  },
  async loadFeaturedPlaylists ({ commit }) {
    const { status, data: featuredPlaylists } = await axios.get(`${API_URL}/playlist/featured`)

    if (status !== 200) {
      console.log('Could not load featured playlists')
      return
    }

    commit(types.SET_FEATURED_PLAYLISTS, featuredPlaylists)
  },
  async loadUserPlaylists ({ commit }) {
    const { status, data: userPlaylists } = await axios.get(`${API_URL}/playlist/`)

    if (status !== 200) {
      console.log('Could not load user playlists')
      return
    }

    commit(types.SET_USER_PLAYLISTS, userPlaylists)
  },
  async loadUserDevices ({ commit }) {
    return new Promise(async (resolve, reject) => {
      const { status, data: devices } = await axios.get(`${API_URL}/user/devices`)

      if (status !== 200) {
        console.log('Could not load user devices')
        reject(new Error('error'))
        return
      }
      commit(types.SET_USER_DEVICES, devices)
      resolve()
    })
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
