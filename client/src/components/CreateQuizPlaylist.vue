<template lang="pug">
  .create-quiz--playlist
    h2 Select a playlist
    playlist-list(:playlists="userPlaylists", @selectedPlaylist="selectPlaylist")
    .columns.is-mobile.navigation
      .column
        router-link.home-button(:to="{ name: 'landing' }") Home
      .column
        a.button.is-dark.is-pulled-right(@click="nextStep", :disabled="!hasSelectedPlaylist")
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
      userPlaylists: [],
      selectedPlaylist: null
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
      if (this.hasSelectedPlaylist) {
        this.$router.push({ name: 'create-quiz-players' })
      }
    },
    selectPlaylist (playlist) {
      this.selectedPlaylist = playlist
    }
  },
  computed: {
    hasSelectedPlaylist () {
      return !!(this.selectedPlaylist)
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
