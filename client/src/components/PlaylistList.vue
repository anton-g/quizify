<template lang="pug">
  .playlist-list
    ul
      li(v-for="playlist in playlists") {{ playlist.name }}
</template>

<script>
export default {
  name: 'playlistlist',
  props: ['playlists']
}
</script>

<style lang="scss">

</style>
