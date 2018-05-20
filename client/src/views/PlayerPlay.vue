<template lang="pug">
  .play
    card.buzzer
      h2.title Buzzer
      button.button.is-fullwidth.is-danger(@click="buzz", :disabled="paused")
    card.stats
      h2.title Stats
      p Score: {{ playerScore }}
</template>

<script>
import Card from '@/components/Card.vue'

export default {
  components: {
    Card
  },
  methods: {
    buzz () {
      if (!this.paused) {
        this.$socket.emit('BUZZ', this.$store.state.player.me.id)
      }
    }
  },
  computed: {
    paused () {
      return this.$store.getters.paused
    },
    playerScore () {
      return this.$store.state.player.me.score
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@design';

.play {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 1fr 150px;
  min-height: 100%;

  .buzzer {
    margin-bottom: $size-2;
    display: flex;
    flex-direction: column;

    button {
      flex: 1;
      border-radius: $size-2;
    }
  }

  .stats {
    margin-bottom: $size-2;
  }
}
</style>
