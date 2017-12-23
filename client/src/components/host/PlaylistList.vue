<template lang="pug">
  .playlist-list
    ul
      li(v-for="playlist in playlists", @click="selectPlaylist(playlist)")
        playlist-list-item(:playlist="playlist", :selected="isSelected(playlist)")
</template>

<script>
import PlaylistListItem from '@/components/host/PlaylistListItem'

export default {
  name: 'playlistlist',
  props: {
    playlists: {
      type: Array
    }
  },
  data () {
    return {
      selectedPlaylist: {}
    }
  },
  components: {
    PlaylistListItem
  },
  methods: {
    selectPlaylist (playlist) {
      this.$store.dispatch('selectPlaylist', playlist)
    },
    isSelected (playlist) {
      return !!(this.$store.state.game.selectedPlaylist) && this.$store.state.game.selectedPlaylist.id === playlist.id
    }
  }
}
</script>

<style lang="scss">
  .playlist-list {
    max-height: 350px;
    overflow-y: scroll;
    background-color: rgba(255, 255, 255, 0.15);
    padding: 0.5rem;
    border-radius: 0.5rem;

    ul {
      li {
        margin-top: 0.2rem;
      }
    }
  }
</style>
