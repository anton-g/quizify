<template lang="pug">
  .create-quiz--playlist
    h2 Select a playlist
    playlist-list(:playlists="userPlaylists")
    .columns.is-mobile.navigation
      .column
        router-link.home-button(:to="{ name: 'landing' }") Home
      .column
        a.button.is-dark.is-pulled-right(@click="nextStep", :disabled="nextDisabled")
          span Lets go
          span.icon
            i.fa.fa-music
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
  },
  methods: {
    nextStep () {

    }
  },
  computed: {
    nextDisabled () {
      return true
    }
  }
}
</script>

<style lang="scss">
  .create-quiz--playlist {
    max-width: 600px;
    width: 100%;

    h2 {
      font-weight: bold;
      font-size: 1.3rem;
      margin-bottom: 0.3rem;
    }

    .navigation {
      align-items: center;
      margin-top: 0.2rem;

      .home-button {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: underline;

        &:hover {
          color: white;
        }
      }
    }
  }
</style>
