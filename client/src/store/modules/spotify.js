import * as types from '../mutation-types'

const SpotifyApi = require('spotify-web-api-js')
const spotify = new SpotifyApi()

const state = {
  accessToken: '',
  expiresIn: '',
  userPlaylists: [],
  devices: [],
  tracks: []
}

const getters = {
  isAuthorized (state) {
    return state.accessToken.length > 0 // TODO check expiration as well
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
  [types.SPOTIFY_TRACKS] (state, tracks) {
    state.tracks = tracks
  }
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
  },
  fetchDevices ({ commit, state }) {
    return new Promise((resolve, reject) => {
      spotify.getMyDevices()
      .then(data => {
        commit(types.USER_DEVICES, data.devices)

        resolve()
      })
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
      .catch(error => console.log(error))
    })
  },
  playTrack ({ rootState }) {
    const track = rootState.create.questions[rootState.create.currentQuestion].track
    spotify.play({
      uris: [
        track.uri
      ]
    })
    .catch(err => console.log(err))
  },
  pause () {
    spotify.pause({})
    .catch(err => console.log(err))
  },
  resume () {
    spotify.play({})
    .catch(err => console.log(err))
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
