<template lang="pug">
.quiz-lobby
  h1 Lobby
  p Waiting for quiz to start..
  player-list.players(:players="players", :current-user-id="currentPlayerId")
  a.button.is-dark.is-fullwidth Leave quiz
</template>

<script>
import PlayerList from '@/components/PlayerList'

export default {
  components: {
    PlayerList
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
