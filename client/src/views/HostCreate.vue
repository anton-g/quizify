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
import { reconnectOnCreation } from '../mixins/reconnect.js'

export default {
  mixins: [reconnectOnCreation],
  components: {
    Card,
    PlaylistPicker
  },
  data () {
    return {
      showPlaylistSelection: false,
      selectedPlaylist: undefined
    }
  },
  created () {
    const [key, jwt] = this.$route.hash.slice(1).split('=')
    if (key === 'jwt') {
      this.$store.dispatch('successfulLogin', jwt)
      this.$store.dispatch('loadFeaturedPlaylists')
    }
  },
  computed: {
    featuredPlaylists () {
      return this.$store.state.host.featuredPlaylists.slice(0, 3)
    },
    userPlaylists () {
      return this.$store.state.host.playlists
    }
  },
  methods: {
    select (playlist) {
      this.selectedPlaylist = playlist
      this.showPlaylistSelection = false
    },
    cancel () {
      this.$router.push({ name: 'home' })
    },
    create () {
      if (this.selectedPlaylist) {
        const options = {
          playlist: this.selectedPlaylist
        }
        this.$store.dispatch('create', options)
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
