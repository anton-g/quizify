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
    quizKey: '',
    players: [],
    connected: false
  },
  actions: {
    login ({ commit, state }, { access_token, expires_in }) {
      commit(types.ACCESS_TOKEN, access_token)
      commit(types.EXPIRES_IN, expires_in)
    },
    createQuiz ({ commit, state }) {
      if (!state.quizKey) {
        socketBus.$socket.emit('room_create', (key) => {
          commit(types.SET_QUIZ_KEY, key)
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
    joinQuiz ({ commit, state }, roomKey) {
      return new Promise((resolve, reject) => {
        socketBus.$socket.emit('room_verify_key', roomKey, verified => {
          if (verified) {
            // save key
            resolve(verified)
          } else {
            reject(verified)
          }
        })
      })
    }
  },
  getters: {
    isAuthorized (state) {
      return state.accessToken.length > 0 // TODO check expiration as well
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
    [types.SET_QUIZ_KEY] (state, key) {
      state.quizKey = key
    },
    [types.SOCKET_CONNECT] (state) {
      state.connected = true
    },
    [types.SOCKET_DISCONNECT] (state) {
      state.connected = false
    },
    [types.SOCKET_USER_JOIN] (state, user) {
      console.log(user)
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})
