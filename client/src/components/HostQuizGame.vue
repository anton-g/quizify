<template lang="pug">
  .host-game
    .question
      h1.title.is-3 {{ question.question }}
    .song.columns.is-mobile.is-vcentered
      .column.is-narrow
        p.image.is-96x96
          img(:src="image")
      .column
        p {{ artist }}
        p.is-highlighted {{ title }}
      .column.is-3
        play-pause-button(@press="togglePlayState", :playing="playing")
    .controls
      a.button.is-light.is-outlined(@click="skipQuestion") Skip question
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
        this.$store.dispatch('playTrack')
        this.songStarted = true
      }
    },
    skipQuestion () {
      this.$store.dispatch('nextTrack')
      this.songStarted = false
      this.playing = false
    }
  },
  computed: {
    question () {
      // Refactor to getter
      return this.$store.state.create.questions[this.$store.state.create.currentQuestion]
    },
    image () {
      return this.question.track.album.images[0].url
    },
    artist () {
      return this.question.track.artists[0].name
    },
    title () {
      return this.question.track.name
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
