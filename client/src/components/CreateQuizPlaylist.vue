<template lang="pug">
  .create-quiz--playlist
    h2 Select a playlist
    playlist-list(:playlists="userPlaylists")
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

export default {
  components: {
    PlaylistList
  },
  created () {
    this.$store.dispatch('fetchUserPlaylists')
  },
  methods: {
    nextStep () {
      if (this.hasSelectedPlaylist) {
        this.$router.push({ name: 'create-quiz-lobby' })
      }
    }
  },
  computed: {
    selectedPlaylist () {
      return this.$store.state.create.selectedPlaylist
    },
    hasSelectedPlaylist () {
      return !!(this.selectedPlaylist)
    },
    userPlaylists () {
      return this.$store.state.create.userPlaylists
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
