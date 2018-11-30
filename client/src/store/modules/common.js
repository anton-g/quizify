import * as types from '../mutation-types'
import i18n from '../../i18n'
import izitoast from 'izitoast'
import axios from 'axios'
import { HOST_RECONNECT_ID, PLAYER_SOCKET_STORAGE_ITEM } from '../../common/constants'

const API_URL = process.env.VUE_APP_API_URL

const state = {
  connected: false,
  currentLocale: 'en',
  enableFeaturedPlaylists: false,
  charities: []
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
  [types.SET_CHARITIES] (state, charities) {

  },
  [types.SOCKET_PONG] (state, ms) {
  }
}

const actions = {
  changeLocale ({ commit }, locale) {
    commit(types.SET_LOCALE, locale)
  },
  getCharities ({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      if (state.charities.length > 0) {
        resolve(state.charities)
        return
      }

      const { data } = await axios.get(`${API_URL}/charity`)
      commit(types.SET_CHARITIES, data)
      resolve(data)
    })
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
