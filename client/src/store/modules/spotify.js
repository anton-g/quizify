import * as types from '../mutation-types'

const SpotifyApi = require('spotify-web-api-js')
const spotify = new SpotifyApi()

const state = {
  accessToken: '',
  expires: '',
  userPlaylists: [],
  devices: [],
  tracks: []
}

const getters = {
  isAuthorized (state) {
    return state.accessToken.length > 0 && state.expires > Date.now()
  },
  hasActiveDevice (state) {
    return state.devices.findIndex(d => d.is_active) > -1
  }
}

const mutations = {
  [types.ACCESS_TOKEN] (state, token) {
    state.accessToken = token
  },
  [types.EXPIRES_IN] (state, expiration) {
    state.expires = Date.now() + (expiration * 1000)
  },
  [types.USER_PLAYLISTS] (state, playlists) {
    state.userPlaylists = playlists
  },
  [types.USER_DEVICES] (state, devices) {
    state.devices = devices
  },
  [types.SPOTIFY_TRACKS] (state, tracks) {
    state.tracks = tracks
  }
}

const errorHandler = (error) => {
  const response = JSON.parse(error.response)
  switch (response.error.status) {
    case 403:
      if (response.error.message === 'Command failed: Already paused' ||
          response.error.message === 'Command failed: Not paused') {
        return
      }
  }

  throw error
}

const actions = {
  login ({ commit }, { access_token, expires_in }) {
    spotify.setAccessToken(access_token)

    commit(types.ACCESS_TOKEN, access_token)
    commit(types.EXPIRES_IN, expires_in)
  },
  fetchUserPlaylists ({ commit, state }) {
    spotify.getUserPlaylists()
    .then(data => {
      commit(types.USER_PLAYLISTS, data.items)
    })
    .catch(errorHandler)
  },
  fetchDevices ({ commit, state }) {
    return new Promise((resolve, reject) => {
      spotify.getMyDevices()
      .then(data => {
        commit(types.USER_DEVICES, data.devices)

        resolve()
      })
      .catch(errorHandler)
    })
  },
  getPlaylistTracks ({ commit }, playlist) {
    // TODO currently only gets the top 100 tracks
    return new Promise((resolve, reject) => {
      spotify.getPlaylistTracks(playlist.owner.id, playlist.id)
      .then(data => {
        commit(types.SPOTIFY_TRACKS, data.items.map(i => i.track))
        resolve()
      })
      .catch(errorHandler)
    })
  },
  playTrack ({ getters }) {
    const track = getters.currentQuestion.track
    spotify.play({
      uris: [
        track.uri
      ]
    })
    .catch(errorHandler)
  },
  pause () {
    spotify.pause({})
    .catch(errorHandler)
  },
  resume () {
    spotify.play({})
    .catch(errorHandler)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
