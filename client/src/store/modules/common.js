import * as types from '../mutation-types'

const state = {
  players: [],
  connected: false
}

const getters = {}

const mutations = {
  [types.SOCKET_USERS_UPDATE] (state, users) {
    state.players = users
  },
  [types.SOCKET_CONNECT] (state) {
    state.connected = true
  },
  [types.SOCKET_DISCONNECT] (state) {
    state.connected = false
  }
}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
