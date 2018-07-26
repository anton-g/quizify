import { HOST_SOCKET_STORAGE_ITEM, PLAYER_SOCKET_STORAGE_ITEM } from '../common/constants'

export const reconnectOnCreation = {
  created () {
    console.log('Checking if previous connected quiz exists..')
    const playerSocket = localStorage.getItem(PLAYER_SOCKET_STORAGE_ITEM)
    const hostSocket = localStorage.getItem(HOST_SOCKET_STORAGE_ITEM)
    if (playerSocket) {
      console.log(`Found previous socket ${playerSocket}, trying to reconnect..`)
      this.$store.dispatch('reconnectPlayer', playerSocket)
    } else if (hostSocket) {
      console.log(`Found previous socket ${hostSocket}, trying to reconnect..`)
      this.$store.dispatch('reconnectHost', hostSocket)
    } else {
      console.log('Could not find any previous game.')
    }
  }
}
