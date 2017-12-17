import Vue from 'vue'

import * as types from '../mutation-types'
import spotify from '@/spotify'

const socketBus = new Vue()

const state = {
  accessToken: '',
  expiresIn: '',
  userPlaylists: [],

  createdQuizKey: '',
  selectedPlaylist: null,
  tracks: []
}

const getters = {
  isAuthorized (state) {
    return state.accessToken.length > 0 // TODO check expiration as well
  },
  hasCreatedQuiz (state) {
    return !!(state.createdQuizKey && state.selectedPlaylist)
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
  [types.SELECT_PLAYLIST] (state, playlist) {
    state.selectedPlaylist = playlist
  },
  [types.SET_CREATED_QUIZ_KEY] (state, key) {
    state.createdQuizKey = key
  },
  [types.QUIZ_TRACKS] (state, tracks) {
    state.tracks = tracks
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
  selectPlaylist ({ commit }, playlist) {
    commit(types.SELECT_PLAYLIST, playlist)
  },
  startQuiz ({ commit, state }) {
    return new Promise((resolve, reject) => {
      spotify.getPlaylistTracks(state.selectedPlaylist, state.accessToken)
      .then(data => {
        commit(types.QUIZ_TRACKS, data.items.map(i => i.track))
        socketBus.$socket.emit('quiz_start')
        resolve()

        // reject()
      })
    })
  },
  playNextTrack ({ commit, state }) {
    spotify.playTrack(state.tracks[0], state.accessToken)
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
