<template lang="pug">
  .create-quiz--playlist
    h2 {{ $t('heading') }}
    playlist-list.selector(:playlists="userPlaylists")
    .columns.is-mobile.navigation
      .column.is-narrow
        router-link.home-button(:to="{ name: 'landing' }") {{ $t('home-button') }}
      .column
        a.button.is-dark.is-pulled-right(@click="nextStep", :disabled="!hasSelectedPlaylist")
          span {{ $t('select-button') }}
          span.icon
            i.fa.fa-music
</template>

<script>
import PlaylistList from '@/components/host/PlaylistList'

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
      return this.$store.state.game.selectedPlaylist
    },
    hasSelectedPlaylist () {
      return !!(this.selectedPlaylist)
    },
    userPlaylists () {
      return this.$store.state.spotify.userPlaylists
    }
  }
}
</script>

<style lang="scss">
  .create-quiz--playlist {
    max-width: 600px;
    width: 95%;
    margin: 0 auto 0;

    h2 {
      font-weight: bold;
      font-size: 1.3rem;
      margin-bottom: 0.3rem;
    }

    .selector {
      max-width: 360px;
    }

    .columns {
      margin: 0;

      .column {
        padding: 0.5rem 0;
      }
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

<i18n>
{
  "en": {
    "heading": "Select a playlist",
    "home-button": "Home",
    "select-button": "Select playlist"
  },
  "sv": {
    "heading": "Välj en spellista",
    "home-button": "Hem",
    "select-button": "Välj"
  }
}
</i18n>
