import * as types from '../mutation-types'
import i18n from '../../i18n'
import izitoast from 'izitoast'

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
  [types.DISCONNECT] (state) {
    state.connected = false
  },
  [types.SOCKET_PONG] (state, ms) {
  }
}

const actions = {
  changeLocale ({ commit }, locale) {
    commit(types.SET_LOCALE, locale)
  },
  socket_disconnect ({ commit }) {
    commit(types.DISCONNECT)
    izitoast.show({
      title: i18n.t('toast:disconnect:title'),
      message: i18n.t('toast:disconnect:text'),
      color: 'red',
      timeout: 0
    })
  },
  socket_reconnect ({ commit, state }) {
    console.log('reconnect?')
  }
}

export default {
  state,
  mutations,
  actions
}
