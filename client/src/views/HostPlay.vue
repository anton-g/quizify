<template lang="pug">
  .play-wrapper
    card.play
      .info
        span.questionNo {{ currentQuestionNo }} / {{ questionCount }}
        h2.question {{ currentQuestion.question }}
        img.image(:src="currentQuestion.track.imageUrl", :alt="$t('alt:album-art', { trackName: currentQuestion.track.name, artistName: currentQuestion.track.artist })")
        p.artist {{ currentQuestion.track.artist }}
        p.song {{ currentQuestion.track.name }}
      .actions
        button.button.is-dark.is-outlined.is-fullwidth(@click="prev", :disabled="currentQuestionNo === 1")
          .q-icon
            FontAwesomeIcon(:icon="prevIcon")
          | {{ $t('button:prev') }}
        button.button.is-dark.is-fullwidth(@click="togglePlayState")
          | {{ isPaused ? $t('button:resume') : $t('button:pause') }}
          .q-icon
            FontAwesomeIcon(:icon="togglePlayIcon")
        button.button.is-dark.is-fullwidth(@click="next", :class="{ 'is-danger': lastQuestion }")
          | {{ lastQuestion ? $t('button:end') : $t('button:next') }}
          .q-icon(v-if="!lastQuestion")
            FontAwesomeIcon(:icon="nextIcon")
      .foot
        a.button.is-text(href="javascript:void(0);", @click="showHelp = true", @keydown.enter="showHelp = true") {{ $t('button:help') }}
      modal.buzz-info(:active="buzzed", v-if="buzzed")
        h2.title {{ $t('text:buzzed', { name: playerName }) }}
        .question {{ currentQuestion.question }}
        .artist {{ currentQuestion.track.artist }}
        .song {{ currentQuestion.track.name }}
        .actions
          button.button.is-danger.is-fullwidth(@click="incorrect") {{ $t('button:incorrect') }}
          button.button.is-outlined.is-dark.is-fullwidth(@click="correct") {{ $t('button:correct') }}
        span(slot="close")
      modal.help-modal(:active="showHelp", @close="showHelp = false")
        h2.title {{ $t('title:help') }}
        p {{ $t('text:help' )}}
        p.has-text-danger {{ $t('text:leave-warning') }}
        .leave
          button.button.is-danger(@click="leave") {{ $t('button:leave') }}
    card.players
      h2.title {{ $t('title:players') }}
      player-result-list(:results="players")
</template>

<script>
import Card from '../components/Card.vue'
import Modal from '../components/Modal.vue'
import PlayerResultList from '../components/PlayerResultList.vue'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { faBackward, faForward, faPlay, faPause } from '@fortawesome/fontawesome-free-solid'

export default {
  components: {
    Card,
    Modal,
    PlayerResultList,
    FontAwesomeIcon
  },
  data () {
    return {
      showHelp: false
    }
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
    players () {
      return this.$store.state.host.quiz.players
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
      this.$store.dispatch('resume')
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
    },
    leave () {
      this.$store.dispatch('hostLeave')
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
    color: rgba(0, 0, 0, 0.6);
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

.foot {
  text-align: right;
  margin-top: $size-2;
}

.players {
  margin-top: $size-2;
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

.help-modal {
  p {
    margin-bottom: $size-1;
  }

  .leave {
    text-align: right;
  }
}
</style>

<i18n>
{
  "en": {
    "alt:album-art": "Album art for {trackName} by {artistName}",
    "button:prev": "Prev",
    "button:next": "Next",
    "button:pause": "Pause",
    "button:resume": "Resume",
    "button:end": "End",
    "text:buzzed": "{name} buzzed!",
    "button:incorrect": "Incorrect",
    "button:correct": "Correct",
    "button:help": "Help",
    "title:help": "Help",
    "text:help": "A help text.",
    "text:leave-warning": "Leaving will end the quiz and all progress will be lost!",
    "button:leave": "Leave quiz",
    "title:players": "Players"
  },
  "sv": {
    "alt:album-art": "Skivomslag för {trackName} av {artistName}",
    "button:prev": "Föregående",
    "button:next": "Nästa",
    "button:pause": "Pausa",
    "button:resume": "Spela",
    "button:end": "Avsluta",
    "text:buzzed": "{name} buzzade!",
    "button:incorrect": "Fel svar",
    "button:correct": "Rätt svar",
    "button:help": "Hjälp",
    "title:help": "Hjälp",
    "text:help": "En hjälptext.",
    "text:leave-warning": "Om du lämnar nu kommer quizet avslutas och du får ej se något resultat!",
    "button:leave": "Lämna quiz",
    "title:players": "Spelare"
  }
}
</i18n>
