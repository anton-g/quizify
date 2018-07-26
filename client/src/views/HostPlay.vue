<template lang="pug">
  card.play
    .info
      span.questionNo {{ currentQuestionNo }} / {{ questionCount }}
      h2.question {{ currentQuestion.question }}
      img.image(:src="currentQuestion.track.img")
      p.artist {{ currentQuestion.track.artist }}
      p.song {{ currentQuestion.track.song }}
    .actions
      button.button.is-dark.is-outlined.is-fullwidth(@click="prev", :disabled="currentQuestionNo === 1")
        .q-icon
          FontAwesomeIcon(:icon="prevIcon")
        | Prev
      button.button.is-dark.is-fullwidth(@click="togglePlayState")
        | {{ isPaused ? 'Resume' : 'Pause' }}
        .q-icon
          FontAwesomeIcon(:icon="togglePlayIcon")
      button.button.is-dark.is-fullwidth(@click="next", :class="{ 'is-danger': lastQuestion }")
        | {{ lastQuestion ? 'End' : 'Next' }}
        .q-icon(v-if="!lastQuestion")
          FontAwesomeIcon(:icon="nextIcon")
    modal.buzz-info(:active="buzzed", v-if="buzzed")
      h2.title {{ playerName }} buzzed
      .question {{ currentQuestion.question }}
      .artist {{ currentQuestion.track.artist }}
      .song {{ currentQuestion.track.song }}
      .actions
        button.button.is-danger.is-fullwidth(@click="incorrect") Incorrect
        button.button.is-outlined.is-dark.is-fullwidth(@click="correct") Correct
      span(slot="close")
</template>

<script>
import Card from '../components/Card.vue'
import Modal from '../components/Modal.vue'

import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { faBackward, faForward, faPlay, faPause } from '@fortawesome/fontawesome-free-solid'

export default {
  components: {
    Card,
    Modal,
    FontAwesomeIcon
  },
  computed: {
    buzzed () {
      return this.$store.getters.isBuzzed
    },
    playerName () {
      return this.$store.state.host.buzzedPlayer.name
    },
    isPaused () {
      return this.$store.getters.isPaused
    },
    lastQuestion () {
      return this.$store.getters.finalQuestion
    },
    questionCount () {
      return this.$store.state.host.quiz.questions.length
    },
    currentQuestionNo () {
      return this.$store.state.host.quiz.currentQuestionNo
    },
    currentQuestion () {
      return this.$store.getters.currentQuestion
    },
    prevIcon () {
      return faBackward
    },
    nextIcon () {
      return faForward
    },
    togglePlayIcon () {
      return this.isPaused ? faPlay : faPause
    }
  },
  methods: {
    incorrect () {
      this.$store.dispatch('resetBuzz')
    },
    correct () {
      this.$store.dispatch('score')
      this.$store.dispatch('resetBuzz')
    },
    togglePlayState () {
      if (this.isPaused) {
        this.$store.dispatch('resume')
      } else {
        this.$store.dispatch('pause')
      }
    },
    prev () {
      this.$store.dispatch('prevQuestion')
    },
    next () {
      const action = this.lastQuestion ? 'endQuiz' : 'nextQuestion'
      this.$store.dispatch(action)
    },
    end () {
      this.$store.dispatch('endQuiz')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@design';

.info {
  display: flex;
  flex-direction: column;
  align-items: center;

  .questionNo {
    color: gray;
    font-size: 14px;
    line-height: 14px;
    margin-bottom: $size-1;
  }

  .question {
    font-size: $size-3;
    line-height: $size-3;
    margin-bottom: $size-2;
  }

  .image {
    width: 200px;
    height: 200px;
    border-radius: $size-2;
    margin-bottom: $size-1;
  }

  .artist {
    font-family: $font-family-heading;
  }
}

.actions {
  margin-top: $size-2;
  display: flex;

  .button {
    .q-icon {
      padding: 0 4px;
    }
  }

  > :first-child {
    margin-right: $size-1;
  }

  > :last-child {
    margin-left: $size-1;
  }
}

.buzz-info {
  .title {
    margin-bottom: $size-1;
  }

  .question {
    text-align: center;
    margin-bottom: $size-1;
  }

  .artist {
    text-align: center;
    font-weight: bold;
  }

  .song {
    text-align: center;
  }

  .actions {
    margin-top: $size-1;
    display: flex;
    justify-content: space-between;

    :first-child {
      margin-right: $size-1;
    }

    :last-child {
      margin-left: $size-1;
    }
  }
}
</style>
