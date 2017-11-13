<template lang="pug">
  .create-quiz--players
    .pin
      span Give your friends this PIN:
      horizontal-line-heading.pin {{ quizPin }}
    .players
      player-list(:players="players")
    .settings
      h3 Selected playlist
      playlist-list-item(:playlist="selectedPlaylist")
    a.button.is-dark.is-fullwidth
      span Let's get this party started
      span.icon
        i.fa.fa-music
    .change-playlist-button
      router-link(:to="{ name: 'create-quiz-playlist' }") Change playlist
</template>

<script>
import HorizontalLineHeading from '@/components/HorizontalLineHeading'
import PlaylistListItem from '@/components/PlaylistListItem'
import PlayerList from '@/components/PlayerList'

export default {
  components: {
    PlaylistListItem,
    HorizontalLineHeading,
    PlayerList
  },
  computed: {
    selectedPlaylist () {
      return this.$store.state.selectedPlaylist
    },
    players () {
      return this.$store.state.players
    },
    quizPin () {
      return this.$store.state.quizPin
    }
  }
}
</script>

<style lang="scss" scoped>
.create-quiz--players {
  width: 100%;

  .pin {
    text-align: center;

    h2 {
      font-size: 2rem;
      font-weight: bold;
    }
  }

  .settings {
    margin-top: 1rem;

    h3 {
      margin: 0.2rem 0;
      font-weight: bold;
    }
  }

  .button {
    margin-top: 1rem;
    width: 100%;
  }

  .change-playlist-button {
    margin-top: 1rem;
    text-align: center;

    a {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: underline;

      &:hover {
        color: white;
      }
    }
  }
}
</style>
