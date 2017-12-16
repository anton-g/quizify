<template lang="pug">
  .host-game
    h1.title {{ artist + ' - ' + title }}
    img(:src="image")
    h1.title Vad heter artisten?
</template>

<script>
export default {
  created () {
    this.$store.dispatch('playNextTrack')

    setTimeout(() => {
      this.$store.dispatch('pause')
    }, 2500)

    setTimeout(() => {
      this.$store.dispatch('resume')
    }, 6000)
  },
  computed: {
    track () {
      return this.$store.state.tracks[0]
    },
    image () {
      return this.track.album.images[0].url
    },
    artist () {
      return this.track.artists[0].name
    },
    title () {
      return this.track.name
    }
  }
}
</script>

<style lang="scss">
.host-game h1 {
  color: white !important;
  text-align: center;
}
</style>
