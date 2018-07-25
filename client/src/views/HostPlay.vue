<template lang="pug">
  card.play
    p game
    button.button Prev
    button.button Pause/Play
    button.button Next
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
    }
  },
  methods: {
    incorrect () {
      this.$store.dispatch('resetBuzz')
    },
    correct () {
      this.$store.dispatch('score')
      this.$store.dispatch('resetBuzz')
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
