<template lang="pug">
  card.create
    h2.title Create quiz
    p.intro Laboris in consequat aliquip consectetur laborum in cillum nisi ex officia.
    .field
      .control
        button.button.is-dark.is-fullwidth(@click="showPlaylistSelection = true") {{ selectedPlaylist ? selectedPlaylist.name : 'Select playlist' }}
    .field.is-grouped
      .control
        button.button.is-danger.is-outlined(@click="cancel") Cancel
      .control
        button.button.is-dark.is-fullwidth(@click="create") Create
    playlist-picker(
      :active="showPlaylistSelection",
      :featuredPlaylists="featuredPlaylists",
      :playlists="userPlaylists"
      @close="showPlaylistSelection = false",
      @select="select")
</template>

<script>
import Card from '../components/Card.vue'
import PlaylistPicker from '../components/PlaylistPicker.vue'
import { reconnectOnCreation } from '../mixins/ReconnectMixin.js'

export default {
  mixins: [reconnectOnCreation],
  components: {
    Card,
    PlaylistPicker
  },
  data () {
    return {
      showPlaylistSelection: false
    }
  },
  created () {
    this.$store.dispatch('loadFeaturedPlaylists')
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
      this.showPlaylistSelection = false
    },
    cancel () {
      this.$router.push({ name: 'home' })
    },
    create () {
      if (this.selectedPlaylist) {
        this.$store.dispatch('create')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@design';

.title {
  margin-bottom: $size-2;
}

.intro {
  margin-bottom: $size-1;
}
</style>
