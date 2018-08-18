<template lang="pug">
  .player-result-list
    ul.result-list
      li.player(v-for="(player, idx) in sortedResults", :key="player.id")
        .fill(:style="{ width: fillWidth(player) + '%' }")
        .icon-wrapper(:style="{ visibility: idx > 0 ? 'hidden' : 'visible' }")
          FontAwesomeIcon(:icon="trophyIcon")
        .name {{ player.name }}
        .score {{ player.score }}
          span {{ $t('text:points') }}
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { faTrophy } from '@fortawesome/fontawesome-free-solid'

export default {
  name: 'playerresultlist',
  components: {
    FontAwesomeIcon
  },
  props: ['results'],
  computed: {
    sortedResults () {
      return this.results.slice().sort((a, b) => b.score - a.score)
    },
    maxScore () {
      return this.sortedResults[0].score
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
    padding: 0 $size-2;
    z-index: 2;
    font-size: $size-3;

    span {
      margin-left: 2px;
      font-size: $size-2;
      color: rgba(0, 0, 0, 0.6)
    }
  }

  .icon-wrapper {
    padding: $size-1 0 $size-1 $size-1;
    z-index: 2;
  }
}
</style>

<i18n>
{
  "en": {
    "text:points": "pts"
  }
}
</i18n>
