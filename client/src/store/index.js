import Vue from 'vue'
import Vuex from 'vuex'

import * as types from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: { // TODO should be empty when not in dev
    accessToken: '',
    expiresIn: ''
  },
  actions: {
    login ({ commit, state }, { access_token, expires_in }) {
      commit(types.ACCESS_TOKEN, access_token)
      commit(types.EXPIRES_IN, expires_in)
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
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})
