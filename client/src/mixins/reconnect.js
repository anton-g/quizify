import { HOST_RECONNECT_ID, PLAYER_SOCKET_STORAGE_ITEM } from '../common/constants'
import i18n from '../i18n'
import izitoast from 'izitoast'

export const reconnectOnCreation = {
  created () {
    const toast = document.querySelector('.toast-reconnect')

    const playerSocket = localStorage.getItem(PLAYER_SOCKET_STORAGE_ITEM)
    const hostReconnectId = localStorage.getItem(HOST_RECONNECT_ID)
    if (playerSocket && !toast) {
      izitoast.show({
        class: 'toast-reconnect',
        title: i18n.t('toast:reconnect:title'),
        message: i18n.t('toast:reconnect:text')
      })

      this.$store.dispatch('reconnectPlayer', playerSocket)
    } else if (hostReconnectId && !toast) {
      izitoast.show({
        class: 'toast-reconnect',
        title: i18n.t('toast:reconnect:title'),
        message: i18n.t('toast:reconnect:text')
      })

      this.$store.dispatch('reconnectHost', hostReconnectId)
    }
  }
}
