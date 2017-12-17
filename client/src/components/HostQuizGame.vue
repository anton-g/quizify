<template lang="pug">
  .host-game
    h1.title {{ artist + ' - ' + title }}
    image-play-button(:url="image", :playing="playing", @toggle="togglePlayState")
    h1.title Vad heter artisten?
</template>

<script>
import ImagePlayButton from '@/components/ImagePlayButton'

export default {
  components: {
    ImagePlayButton
  },
  data () {
    return {
      playing: true
    }
  },
  created () {
    this.$store.dispatch('playNextTrack')
  },
  methods: {
    togglePlayState () {
      this.playing = !this.playing

      this.$store.dispatch(this.playing ? 'resume' : 'pause')
    }
  },
  computed: {
    track () {
      return this.$store.state.create.tracks[0]
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
