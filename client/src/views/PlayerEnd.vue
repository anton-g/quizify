<template lang="pug">
  card
    h2.title {{ title }}
    ul
      li.player(v-for="(player, idx) in results")
        .fill(:style="{ width: fillWidth(player) + '%' }")
        .icon-wrapper(:style="{ visibility: idx > 0 ? 'hidden' : 'visible' }")
          FontAwesomeIcon(:icon="trophyIcon")
        .name {{ player.name }}
        .score {{ player.score }} p
</template>

<script>
import Card from '@/components/Card.vue'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { faTrophy } from '@fortawesome/fontawesome-free-solid'

export default {
  name: 'playerend',
  components: {
    Card,
    FontAwesomeIcon
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
    },
    maxScore () {
      return this.results[0].score
    },
    trophyIcon () {
      return faTrophy
    }
  },
  methods: {
    fillWidth (player) {
      return (player.score / this.maxScore) * 100
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@design';

.player {
  display: flex;
  background-color: rgba(235, 235, 235, 1.0);
  border-radius: $size-1;
  position: relative;
  overflow: hidden;

  &:not(:last-child) {
    margin-bottom: $size-1;
  }

  .fill {
    position: absolute;
    height: 100%;
    background-color: #42e695;
    z-index: 1;
    outline: 4px solid white;
  }

  .name {
    padding: $size-1;
    z-index: 2;
    font-weight: bold;
  }

  .score {
    margin-left: auto;
    padding: $size-1 $size-2;
    z-index: 2;
  }

  .icon-wrapper {
    padding: $size-1 0 $size-1 $size-1;
    z-index: 2;
  }
}
</style>
