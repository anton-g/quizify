<template lang="pug">
  .create-quiz--players
    .key
      span Give your friends this key:
      horizontal-line-heading {{ createdQuizKey }}
    .players
      player-list(:players="players")
    .settings
      h3 Selected playlist
      playlist-list-item(:playlist="selectedPlaylist")
    a.button.is-dark.is-fullwidth(@click="startQuiz", :disabled="!hasActiveDevice")
      span Let's get this party started
      span.icon
        i.fa.fa-music
    .change-playlist-button
      router-link(:to="{ name: 'create-quiz-playlist' }") Change playlist
</template>

<script>
import izitoast from 'izitoast'

import HorizontalLineHeading from '@/components/common/HorizontalLineHeading'
import PlaylistListItem from '@/components/host/PlaylistListItem'
import PlayerList from '@/components/common/PlayerList'

export default {
  components: {
    PlaylistListItem,
    HorizontalLineHeading,
    PlayerList
  },
  created () {
    this.verifyDevice()
  },
  methods: {
    startQuiz () {
      // TODO validate selected playlist etc
      if (!this.hasActiveDevice) {
        return
      }

      if (this.players.length < 1) {
        this.playerCountNotification()
        return
      }

      this.$store.dispatch('startQuiz').then(() => {
        this.$router.push({ name: 'host-game' })
      })
    },
    verifyDevice () {
      this.$store.dispatch('fetchDevices')
        .then(() => {
          if (!this.$store.getters.hasActiveDevice) {
            setTimeout(() => this.activeDeviceNotification(), 1000)
          }
        })
    },
    activeDeviceNotification () {
      izitoast.show({
        title: 'Error',
        message: 'Could not connect to a running Spotify client. Please open Spotify on any device and then retry. If it still doesn\'t work, try playing a few seconds of any song and retrying again.',
        icon: 'fa fa-exclamation-circle',
        timeout: false,
        close: false,
        drag: false,
        buttons: [
          ['<button>Retry</button>', (instance, toast) => {
            instance.hide(toast, {
              transitionOut: 'fadeOutDown',
              transitionOutMobile: 'fadeOutDown'
            }, 'close')

            this.verifyDevice()
          }]
        ]
      })
    },
    playerCountNotification () {
      izitoast.show({
        title: 'No players connected',
        message: 'You need at least 1 player to start the game!',
        icon: 'fa fa-exclamation-circle'
      })
    }
  },
  computed: {
    selectedPlaylist () {
      return this.$store.state.game.selectedPlaylist
    },
    players () {
      return this.$store.state.common.players
    },
    createdQuizKey () {
      return this.$store.state.game.createdQuizKey
    },
    hasActiveDevice () {
      return this.$store.getters.hasActiveDevice
    }
  }
}
</script>

<style lang="scss" scoped>
.create-quiz--players {
  width: 100%;

  .key {
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
