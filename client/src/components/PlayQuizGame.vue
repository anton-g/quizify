<template lang="pug">
  .player-quiz
    a.buzzer.button.is-dark(@click="buzz", :disabled="isPaused") Buzz
</template>

<script>
export default {
  methods: {
    buzz () {
      if (!this.isPaused) {
        this.$socket.emit('buzz')
      }
    }
  },
  computed: {
    isPaused () {
      return this.$store.state.join.isPaused
    }
  }
}
</script>

<style lang="scss">
.player-quiz {
  a.buzzer {
    min-width: 300px;
    min-height: 300px;
    border-radius: 4rem;

    font-size: 5rem;
    font-family: 'Pacifico', cursive;
  }
}
</style>
