<template lang="pug">
  .host-game
    .question
      h1.title.is-3 What is the name of the
        strong  artist
        | ?
    .song
      image-play-button(:url="image", :playing="playing", @toggle="togglePlayState")
      h1.title.is-5
        strong {{ artist }}
        |  - {{ title }}
</template>

<script>
import ImagePlayButton from '@/components/ImagePlayButton'

export default {
  components: {
    ImagePlayButton
  },
  data () {
    return {
      playing: false,
      songStarted: false
    }
  },
  methods: {
    togglePlayState () {
      this.playing = !this.playing

      if (this.songStarted) {
        this.$store.dispatch(this.playing ? 'resume' : 'pause')
      } else {
        this.$store.dispatch('playNextTrack')
        this.songStarted = true
      }
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
.host-game {
  max-width: 600px;
  width: 100%;

  .title {
    color: white;
    text-align: center;
    font-weight: 500;
  }

  .question {
    margin-bottom: 1rem;
  }

  .song {
    .title {
      margin-top: 1rem;
    }
  }
}
</style>
