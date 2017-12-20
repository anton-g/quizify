<template lang="pug">
  .host-game
    .question
      h1.title.is-3 What is the name of the
        strong  song
        | ?
    .song
      .columns.is-mobile.is-vcentered
        .column.is-narrow
          p.image.is-96x96
            img(:src="image")
        .column
          p {{ artist }}
          p.is-highlighted {{ title }}
        .column.is-3
          play-pause-button(@press="togglePlayState", :playing="playing")
</template>

<script>
import PlayPauseButton from '@/components/PlayPauseButton'

export default {
  components: {
    PlayPauseButton
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

    strong {
      font-weight: 700;
    }
  }

  .question {
    margin-bottom: 1rem;
  }

  .song {
    img {
      border-radius: 0.3rem;
    }

    p {
      padding: 0;
      margin: 0;

      font-size: 1.3rem;

      &.is-highlighted {
        font-weight: 700;
      }
    }
  }
}
</style>
