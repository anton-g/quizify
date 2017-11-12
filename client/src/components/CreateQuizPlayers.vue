<template lang="pug">
  .create-quiz--players
    .pin
      span Give your friends this PIN:
      horizontal-line-heading.pin ABC123
    .players
      player-list
    .settings
      h3 Selected playlist
      playlist-list-item(:playlist="selectedPlaylist")
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
    }
  }
}
</script>

<style lang="scss" scoped>
.create-quiz--players {
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
}
</style>
