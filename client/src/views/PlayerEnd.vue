<template lang="pug">
  card.results
    h2.title {{ title }}
    player-result-list.result-list(:results="results")
    .field
      .control
        button.button.is-dark.is-pulled-right(@click="home") Home
</template>

<script>
import Card from '@/components/Card.vue'
import PlayerResultList from '@/components/PlayerResultList.vue'

export default {
  name: 'playerend',
  components: {
    Card,
    PlayerResultList
  },
  computed: {
    results () {
      return this.$store.state.player.result.slice().sort((a, b) => b.score - a.score)
    },
    won () {
      return this.results[0].id === this.$store.state.player.me.id
    },
    title () {
      return this.won ? 'You won!' : 'Game ended'
    }
  },
  methods: {
    home () {
      this.$router.push({ name: 'home' })
      this.$store.dispatch('cleanup')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@design';

.result-list {
  margin-bottom: $size-2;
}
</style>
