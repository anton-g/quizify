import Vue from 'vue'
import Vuex from 'vuex'

import * as types from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: { // TODO should be empty when not in dev
    accessToken: 'BQAoWlJFoereTbtYSR0wtt7ilDuqV9m4TcwGnZPzixhv9cVjK9qrIWxnCsLIqQIPU6uFh6AgbZW2TGm9cOKPzGPfLTtrFT8eudXJ3S4cZOeyWuhQ3GGb8_C5xqadhfwv7GLVAIKV_-_CACSWQc46lGmHoFRYIFR2wDd2-kAYUbDxR06OGn-Kyg',
    expiresIn: ''
  },
  actions: {
    login ({ commit, state }, { access_token, expires_in }) {
      commit(types.ACCESS_TOKEN, access_token)
      commit(types.EXPIRES_IN, expires_in)
    }
  },
  getters: {

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
