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
      a.button.is-light.is-outlined(@click="nextQuestion", v-if="!isLastQuestion") Skip question
      a.button.is-dark(@click="endQuiz", v-if="isLastQuestion") End quiz
    modal-buzzed(
      :user="buzzedUser",
      :active="isBuzzed",
      @correct="correct",
      @incorrect="incorrect",
      @resume="resume")
</template>

<script>
import PlayPauseButton from '@/components/host/PlayPauseButton'
import ModalBuzzed from '@/components/host/ModalBuzzed'

export default {
  components: {
    PlayPauseButton,
    ModalBuzzed
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
        this.$store.dispatch(this.playing ? 'resumePlayback' : 'pausePlayback')
      } else {
        this.$store.dispatch('playTrack')
        this.songStarted = true
      }
    },
    nextQuestion () {
      this.$store.dispatch('nextTrack')
      this.songStarted = false
      this.playing = false
    },
    endQuiz () {
      // this.$store.dispatch('endQuiz')
      this.$router.push({ name: 'game-result' })
    },
    correct () {
      this.$store.dispatch('addScore', this.buzzedUser)
      this.$store.dispatch('resumeQuiz')

      if (!this.isLastQuestion) {
        this.nextQuestion()
      } else {
        this.endQuiz()
      }
    },
    incorrect () {
      this.resume()
    },
    resume () {
      this.playing = true
      this.$store.dispatch('resumeQuiz')
      this.$store.dispatch('resumePlayback')
    }
  },
  computed: {
    question () {
      return this.$store.getters.currentQuestion
    },
    image () {
      return this.question.track.album.images[0].url
    },
    artist () {
      return this.question.track.artists[0].name
    },
    title () {
      return this.question.track.name
    },
    buzzedUser () {
      return this.$store.getters.buzzedUser
    },
    isBuzzed () {
      return this.$store.state.game.buzzed
    },
    isLastQuestion () {
      return this.$store.getters.isLastQuestion
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
