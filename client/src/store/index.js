import Vue from 'vue'
import Vuex from 'vuex'

import * as types from './mutation-types'

import spotify from '@/spotify'

Vue.use(Vuex)

// TODO well this is ugly af https://github.com/MetinSeylan/Vue-Socket.io/issues/47
const socketBus = new Vue()

export default new Vuex.Store({
  state: { // TODO should be empty when not in dev
    accessToken: '',
    expiresIn: '',
    userPlaylists: [],
    selectedPlaylist: null,
    createdQuizKey: '',
    players: [],
    connected: false,
    selectedQuizKey: '',
    user: {}
  },
  actions: {
    login ({ commit, state }, { access_token, expires_in }) {
      commit(types.ACCESS_TOKEN, access_token)
      commit(types.EXPIRES_IN, expires_in)
    },
    createQuiz ({ commit, state }) {
      if (!state.createdQuizKey) {
        socketBus.$socket.emit('quiz_create', (key) => {
          commit(types.SET_CREATED_QUIZ_KEY, key)
        })
      }
    },
    fetchUserPlaylists ({ commit, state }) {
      spotify.getUserPlaylists(state.accessToken)
      .then(data => {
        commit(types.USER_PLAYLISTS, data.items)
      })
    },
    selectPlaylist ({ commit }, playlist) {
      commit(types.SELECT_PLAYLIST, playlist)
    },
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
    }
  },
  getters: {
    isAuthorized (state) {
      return state.accessToken.length > 0 // TODO check expiration as well
    },
    hasCreatedQuiz (state) {
      return state.createdQuizKey && state.selectedPlaylist
    },
    isConnectedToQuiz (state) {
      return state.connected && state.selectedQuizKey
    }
  },
  mutations: {
    [types.ACCESS_TOKEN] (state, token) {
      state.accessToken = token
    },
    [types.EXPIRES_IN] (state, expiration) {
      state.expiresIn = expiration // TODO this is completely useless unless checking current time
    },
    [types.USER_PLAYLISTS] (state, playlists) {
      state.userPlaylists = playlists
    },
    [types.SELECT_PLAYLIST] (state, playlist) {
      state.selectedPlaylist = playlist
    },
    [types.SET_CREATED_QUIZ_KEY] (state, key) {
      state.createdQuizKey = key
    },
    [types.QUIZ_SELECT_KEY] (state, key) {
      state.selectedQuizKey = key
    },
    [types.SOCKET_CONNECT] (state) {
      state.connected = true
    },
    [types.SOCKET_DISCONNECT] (state) {
      state.connected = false
    },
    [types.SOCKET_USERS_UPDATE] (state, users) {
      state.players = users
    },
    [types.SET_USER] (state, user) {
      state.user = user
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})
