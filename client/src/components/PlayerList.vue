<template lang="pug">
  ul.player-list
    li.player(v-for="index in 5", :class="{ connected: true }")
      .connectivity
        FontAwesomeIcon(:icon="circleIcon", transform="shrink-6")
      .name
        | Anton
      .info(v-if="index === 1")
        | You
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { faCircle } from '@fortawesome/fontawesome-free-solid'

export default {
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
