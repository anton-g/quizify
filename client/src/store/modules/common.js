import * as types from '../mutation-types'

const state = {
  loading: {},
  connected: false
}

const getters = {
}

const mutations = {
  [types.SOCKET_CONNECT] (state) {
    state.connected = true
  },
  [types.SOCKET_DISCONNECT] (state) {
    state.connected = false
  }
}

const actions = {
}

export default {
  state,
  getters,
  mutations,
  actions
}
