import * as types from '../mutation-types'
import i18n from '../../i18n'
import izitoast from 'izitoast'
import { HOST_RECONNECT_ID, PLAYER_SOCKET_STORAGE_ITEM } from '../../common/constants'

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
      class: 'toast-disconnect',
      title: i18n.t('toast:disconnect:title'),
      message: i18n.t('toast:disconnect:text'),
      color: 'red',
      timeout: 0,
      close: false,
      drag: false
    })
  },
  socket_reconnect ({ dispatch }) {
    const playerSocket = localStorage.getItem(PLAYER_SOCKET_STORAGE_ITEM)
    const hostReconnectId = localStorage.getItem(HOST_RECONNECT_ID)

    if (playerSocket) {
      dispatch('reconnectPlayer', playerSocket)
    } else if (hostReconnectId) {
      dispatch('reconnectHost', hostReconnectId)
    }

    const toast = document.querySelector('.toast-disconnect')
    if (toast) {
      izitoast.hide({}, toast)
    }
  }
}

export default {
  state,
  mutations,
  actions
}
