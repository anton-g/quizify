<template lang="pug">
  card.results
    h2.title {{ title }}
    player-result-list.result-list(:results="results")
    .field
      .control
        button.button.is-dark.is-pulled-right(@click="home") {{ $t('button:home') }}
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
      return this.won ? this.$t('title:win') : this.$t('title:loss')
    }
  },
  methods: {
    home () {
      this.$router.push({ name: 'home' })
      this.$store.dispatch('cleanupPlayer')
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

<i18n>
{
  "en": {
    "title:win": "You won!",
    "title:loss": "Game ended",
    "button:home": "Home"
  },
  "sv": {
    "title:win": "Du vann!",
    "title:loss": "Slut",
    "button:home": "Hem"
  }
}
</i18n>
