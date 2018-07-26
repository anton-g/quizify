import * as types from '../mutation-types'

const state = {
  loading: {},
  connected: false
}

const mutations = {
  [types.SOCKET_CONNECT] (state) {
    state.connected = true
  },
  [types.SOCKET_DISCONNECT] (state) {
    state.connected = false
  }
}

export default {
  state,
  mutations
}
