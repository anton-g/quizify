<template lang="pug">
.quiz-lobby
  h1 Lobby
  p Waiting for quiz to start..
  player-list.players(:players="players", :current-user-id="currentPlayerId")
  a.button.is-light.is-outlined.is-fullwidth(@click="leaveQuiz") Leave quiz
</template>

<script>
import PlayerList from '@/components/PlayerList'

export default {
  components: {
    PlayerList
  },
  created () {
    console.log('joined')
    if (!this.$store.state.join.user.id) {
      this.$router.replace({ name: 'landing' })
    }
  },
  methods: {
    leaveQuiz () {
      this.$store.dispatch('leaveQuiz')
      this.$router.push({ name: 'landing' })
    }
  },
  computed: {
    players () {
      return this.$store.state.common.players
    },
    currentPlayerId () {
      return this.$store.state.join.user.id
    },
    quizStarted () {
      return this.$store.getters.isQuizStarted
    }
  },
  watch: {
    quizStarted (val) {
      if (val) {
        this.$router.push({ name: 'game' })
      }
    }
  }
}
</script>

<style lang="scss">
@import '../assets/css/mixins.scss';

.quiz-lobby {
  > * {
    margin-bottom: 0.5rem;
  }

  h1 {
    @include branded-heading();
  }

  .players {
    align-self: left;
    margin-bottom: 2rem;
  }
}
</style>
