import { HOST_RECONNECT_ID, PLAYER_SOCKET_STORAGE_ITEM } from '../common/constants'

export const reconnectOnCreation = {
  created () {
    const playerSocket = localStorage.getItem(PLAYER_SOCKET_STORAGE_ITEM)
    const hostReconnectId = localStorage.getItem(HOST_RECONNECT_ID)
    if (playerSocket) {
      this.$store.dispatch('reconnectPlayer', playerSocket)
    } else if (hostReconnectId) {
      this.$store.dispatch('reconnectHost', hostReconnectId)
    }
  }
}
