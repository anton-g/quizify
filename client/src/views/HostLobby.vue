<template lang="pug">
  card.lobby
    h2.selection-none.title
      | Lobby
      span.key Key: {{ key }}
    ImageButton(
      :img="selectedPlaylist.img",
      :text="selectedPlaylist.name",
      subtext="Click to change playlist"
      height="70px",
      width="100%",
      color="#237032",
      @click="showPlaylistPicker = true"
    )
    button.button.is-dark.is-fullwidth.start-button(@click="start") Start
    h3.title.is-4 Players
    p.subtitle(v-show="players.length < 1") Tell your friends to join!
    player-list(:players="players")
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
  created () {
    if (this.userPlaylists.length < 1) {
      this.$store.dispatch('loadUserPlaylists')
    }
    if (this.featuredPlaylists.length < 1) {
      this.$store.dispatch('loadFeaturedPlaylists')
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
      return this.$store.state.host.quiz.playlist
    },
    players () {
      return this.$store.state.host.quiz.players
    },
    key () {
      return this.$store.state.host.quiz.key
    }
  },
  methods: {
    select (playlist) {
      this.$store.dispatch('updatePlaylist', playlist)
      this.showPlaylistPicker = false
    },
    start () {
      this.$store.dispatch('start')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@design';

.start-button {
  margin: $size-2 0;
}

.key {
  user-select: text;
  font-family: $font-family-default;
  font-weight: normal;
  background-color: #EEE;
  border-radius: $size-1;
  padding: $size-1;
  font-size: $size-3;
  margin-left: $size-1;
}
</style>
