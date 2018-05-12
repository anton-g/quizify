<template lang="pug">
  card.lobby
    h2.title Lobby
    p.subtitle.is-spaced Waiting for quiz to start..
    h3.title.is-5 Settings
    p Selected playlist: asdf
    p Number of questions: 20
</template>

<script>
import Card from '../components/Card.vue'

export default {
  name: 'playerlobby',
  components: {
    Card
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
