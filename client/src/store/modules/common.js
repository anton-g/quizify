import * as types from '../mutation-types'
import i18n from '../../i18n'

const state = {
  connected: false,
  currentLocale: 'en',
  enableFeaturedPlaylists: false
}

const mutations = {
  [types.SET_LOCALE] (state, locale) {
    state.currentLocale = locale
    i18n.locale = locale
    localStorage.setItem('lang', locale)
  },
  [types.SOCKET_CONNECT] (state) {
    state.connected = true
  },
  [types.SOCKET_DISCONNECT] (state) {
    state.connected = false
  }
}

const actions = {
  changeLocale ({ commit }, locale) {
    commit(types.SET_LOCALE, locale)
  }
}

export default {
  state,
  mutations,
  actions
}
