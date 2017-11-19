<template lang="pug">
.quiz-lobby
  h1 Lobby
  p Waiting for quiz to start..
  player-list.players(:players="players", :current-user-id="currentPlayerId")
  a.button.is-dark.is-fullwidth(@click="leaveQuiz") Leave quiz
</template>

<script>
import PlayerList from '@/components/PlayerList'

export default {
  components: {
    PlayerList
  },
  created () {
    if (!this.$store.state.user.id) {
      this.$router.replace({ name: 'landing' })
    }
  },
  methods: {
    leaveQuiz () {
      this.$store.dispatch('leaveRoom')
      this.$router.push({ name: 'landing' })
    }
  },
  computed: {
    players () {
      return this.$store.state.players
    },
    currentPlayerId () {
      return this.$store.state.user.id
    }
  }
}
</script>

<style lang="scss">
@import '../assets/css/mixins.scss';

.quiz-lobby {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;

  > * {
    margin-bottom: 0.5rem;
  }

  h1 {
    @include branded-heading();
  }

  .players {
    align-self: left;
  }
}
</style>
