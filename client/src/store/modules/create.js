import Vue from 'vue'

import * as types from '../mutation-types'
import spotify from '@/spotify'

const socketBus = new Vue()

const state = {
  accessToken: '',
  expiresIn: '',
  userPlaylists: [],
  tracks: [],
  devices: [],

  createdQuizKey: '',
  selectedPlaylist: null,

  questions: [],
  currentQuestion: 0
}

const getters = {
  isAuthorized (state) {
    return state.accessToken.length > 0 // TODO check expiration as well
  },
  hasCreatedQuiz (state) {
    return !!(state.createdQuizKey && state.selectedPlaylist)
  },
  hasActiveDevice (state) {
    return !!state.devices.find(d => d.is_active)
  }
}

const mutations = {
  [types.ACCESS_TOKEN] (state, token) {
    state.accessToken = token
  },
  [types.EXPIRES_IN] (state, expiration) {
    state.expiresIn = expiration // TODO this is completely useless unless checking current time
  },
  [types.USER_PLAYLISTS] (state, playlists) {
    state.userPlaylists = playlists
  },
  [types.USER_DEVICES] (state, devices) {
    state.devices = devices
  },
  [types.SELECT_PLAYLIST] (state, playlist) {
    state.selectedPlaylist = playlist
  },
  [types.SET_CREATED_QUIZ_KEY] (state, key) {
    state.createdQuizKey = key
  },
  [types.QUIZ_QUESTIONS] (state, questions) {
    state.questions = questions
  },
  [types.QUIZ_NEXT_TRACK] (state) {
    state.currentQuestion += 1
  }
}

const actions = {
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
  fetchDevices ({ commit, state }) {
    return new Promise((resolve, reject) => {
      spotify.getUserDevices()
      .then(data => {
        commit(types.USER_DEVICES, data.devices)

        resolve()
      })
    })
  },
  selectPlaylist ({ commit }, playlist) {
    commit(types.SELECT_PLAYLIST, playlist)
  },
  generateQuestions ({ commit, state }) {
    return new Promise((resolve, reject) => {
      spotify.getPlaylistTracks(state.selectedPlaylist, state.accessToken)
      .then(data => {
        const questions = data.items.map(i => {
          return {
            question: Math.random() < 0.5 ? 'What is the name of the song?' : 'What is the name of the artist?',
            track: i.track
          }
        })

        commit(types.QUIZ_QUESTIONS, questions)
        resolve()

        // reject()
      })
    })
  },
  startQuiz ({ dispatch }) {
    return dispatch('generateQuestions')
    .then(() => {
      socketBus.$socket.emit('quiz_start')
    })
  },
  playTrack ({ commit, state }) {
    spotify.playTrack(state.questions[state.currentQuestion].track, state.accessToken)
  },
  nextTrack ({ commit, dispatch }) {
    commit(types.QUIZ_NEXT_TRACK)
    dispatch('pause')
  },
  pause ({ state }) {
    spotify.pause(state.accessToken)
  },
  resume ({ state }) {
    spotify.resume(state.accessToken)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
