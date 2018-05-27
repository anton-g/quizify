<template lang="pug">
  card
    h2.title {{ title }}
    ul
      li.player(v-for="player in results")
        .name {{ player.name }}
        .score {{ player.score }} points
</template>

<script>
import Card from '@/components/Card.vue'

export default {
  name: 'playerend',
  components: {
    Card
  },
  computed: {
    results () {
      return this.$store.state.player.result.slice().sort((a, b) => a - b)
    },
    won () {
      return this.results[0].id === this.$store.state.player.me.id
    },
    title () {
      return this.won ? 'You won!' : 'Game ended'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@design';

.player {
  display: flex;

  &:not(:last-child) {
    margin-bottom: $size-2;
  }

  .name {
    margin-left: $size-1;
  }

  .score {
    margin-left: auto;
    margin-right: $size-1;
  }
}
</style>
