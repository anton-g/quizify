<template lang="pug">
  ul.player-list
    li.player(v-for="player in players", :class="{ connected: player.connected }")
      .connectivity
        FontAwesomeIcon(:icon="circleIcon", transform="shrink-6")
      .name
        | {{ player.name }}
      .info(v-if="false")
        | You
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { faCircle } from '@fortawesome/fontawesome-free-solid'

export default {
  props: [
    'players'
  ],
  components: {
    FontAwesomeIcon,
  },
  computed: {
    circleIcon () {
      return faCircle
    }
  }
}
</script>

<style lang="scss">
@import '~@design';

.player-list {
  .player {
    display: flex;

    &:not(:last-child) {
      margin-bottom: $size-2;
    }

    .connectivity {
      color: lightgray;
    }

    .name {
      margin-left: $size-1;
      color: gray;
    }

    .info {
      margin-left: auto;
      color: lightgray;
    }

    &.connected {
      .connectivity {
        color: green;
      }

      .name {
        color: #4a4a4a;
      }
    }
  }
}
</style>
