<template lang="pug">
  card.lobby
    h2.title Lobby
    ImageButton(
      :img="selectedPlaylist.img",
      :text="selectedPlaylist.name",
      subtext="Click to change"
      height="70px",
      width="100%",
      color="#52494c",
      @click="showPlaylistPicker = true"
    )
    button.button Start
    h3.title.is-4 Players
    player-list
    playlist-picker(
      :active="showPlaylistPicker",
      :featuredPlaylists="featuredPlaylists",
      :playlists="userPlaylists"
      @close="showPlaylistPicker = false",
      @select="select")
</template>

<script>
import Card from '../components/Card.vue'
import PlayerList from '../components/PlayerList.vue'
import ImageButton from '../components/ImageButton.vue'
import PlaylistPicker from '../components/PlaylistPicker.vue'

export default {
  components: {
    Card,
    PlayerList,
    ImageButton,
    PlaylistPicker
  },
  data () {
    return {
      showPlaylistPicker: false
    }
  },
  computed: {
    featuredPlaylists () {
      return this.$store.state.host.featuredPlaylists.slice(0, 3)
    },
    userPlaylists () {
      return this.$store.state.host.playlists
    },
    selectedPlaylist () {
      return this.$store.state.host.playlist
    }
  },
  methods: {
    select (playlist) {
      this.$store.dispatch('selectPlaylist', playlist)
      this.showPlaylistPicker = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
