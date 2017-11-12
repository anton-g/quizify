<template lang="pug">
  .create-quiz--playlist
    playlist-list(:playlists="userPlaylists")
</template>

<script>
import PlaylistList from '@/components/PlaylistList'

import spotify from '@/spotify'

export default {
  data () {
    return {
      userPlaylists: []
    }
  },
  components: {
    PlaylistList
  },
  created () {
    spotify.getUserPlaylists(this.$store.state.accessToken)
    .then(data => {
      this.userPlaylists = data.items
    })
  }
}
</script>

<style lang="scss">

</style>
