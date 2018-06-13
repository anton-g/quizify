<template lang="pug">
  card.create
    h2.title Create quiz
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

export default {
  components: {
    Card,
    PlaylistPicker
  },
  data () {
    return {
      showPlaylistSelection: false
    }
  },
  computed: {
    featuredPlaylists () {
      return [
        {
          name: 'Alla ska med',
          length: 23,
          img: 'https://mosaic.scdn.co/640/11b1054a8d4b86106085ec30073e50e6f584639e6be8b8cd5690385c28304aafc58ace5ce6dbdc977c6ab0bd116e14ecdd58299a1d103df4e195ac2d93e156ad7762357bea213e53cf346e5f8fe3efae'
        },
        {
          name: 'Dansband gör covers',
          length: 54,
          img: 'https://i.scdn.co/image/8cb5ccc8a642e06a69dbdb2f0c47d597057cb3b1'
        },
        {
          name: 'Generationsquiz',
          length: 301,
          img: 'https://mosaic.scdn.co/640/2993cba1f3c5e99613b7c5d1cc7df07e7d71cb8679970c9df607f89a5895e9b1aac1f4d1b5281d197c99322cf4f696082b86d92a5e4ab93e6cc49bfafa75bec32c71f5f4339c41b6ca816f4dd4cac111'
        }
      ].slice(0, 3)
    },
    userPlaylists () {
      return [
        {
          name: 'Julquiz',
          length: 10
        },
        {
          name: 'Amanda 25',
          length: 18
        },
        {
          name: 'Lajvet',
          length: 22
        },
        {
          name: 'Always bushes of seagulls',
          length: 10
        },
        {
          name: 'Sümmer',
          length: 199
        },
        {
          name: 'Och vi ska också glömmas bort',
          length: 98
        }
      ]
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
      // TODO
      console.log('cancel creation')
    },
    create () {
      this.$store.dispatch('create')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
