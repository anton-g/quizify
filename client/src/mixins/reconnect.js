import { HOST_SOCKET_STORAGE_ITEM, PLAYER_SOCKET_STORAGE_ITEM } from '../common/constants'

export const reconnectOnCreation = {
  created () {
    const playerSocket = localStorage.getItem(PLAYER_SOCKET_STORAGE_ITEM)
    const hostSocket = localStorage.getItem(HOST_SOCKET_STORAGE_ITEM)
    if (playerSocket) {
      this.$store.dispatch('reconnectPlayer', playerSocket)
    } else if (hostSocket) {
      this.$store.dispatch('reconnectHost', hostSocket)
    }
  }
}
