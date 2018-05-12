<template lang="pug">
  card.lobby
    h2.title Lobby
    p.subtitle.is-spaced {{ status }}
    .settings(v-if="quizInfo")
      h3.title.is-5 Settings
      p Selected playlist: {{ quizInfo.playlist }}
      p Number of questions: {{ quizInfo.questionCount }}
</template>

<script>
import Card from '../components/Card.vue'

export default {
  name: 'playerlobby',
  components: {
    Card
  },
  data () {
    return {
      status: 'Waiting for quiz to start..'
    }
  },
  computed: {
    quizInfo () {
      return this.$store.state.player.quizInfo
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@design';

.lobby {
  h3 {
    margin-bottom: $size-1;
  }
}

</style>
