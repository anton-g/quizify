<template lang="pug">
  card.play
    p game
    button.button(@click="prev") Prev
    button.button(@click="togglePlayState") {{ isPaused ? 'Resume' : 'Pause' }}
    button.button(@click="next") {{ lastQuestion ? 'End' : 'Next' }}
    modal.buzz-info(:active="buzzed", v-if="buzzed")
      h2.title {{ playerName }} buzzed
      .question What's the name of the artist?
      .artist Haddaway
      .song What is love
      .actions
        button.button.is-danger.is-fullwidth(@click="incorrect") Incorrect
        button.button.is-outlined.is-dark.is-fullwidth(@click="correct") Correct
      span(slot="close")
</template>

<script>
import Card from '../components/Card.vue'
import Modal from '../components/Modal.vue'

export default {
  components: {
    Card,
    Modal
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