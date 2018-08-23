<template lang="pug">
  ul.player-list
    li.player(v-for="(player, idx) in players", :key="player.id", :class="{ connected: player.connected }")
      .connectivity
        FontAwesomeIcon(:icon="connectivityIcon", transform="shrink-6")
      .name
        | {{ player.name }}
      .actions(v-if="false")
        a.action(href="javascript:void(0);", @click="kick(idx)", @keydown.enter="kick(idx)")
          FontAwesomeIcon(:icon="kickIcon", transform="grow-3")
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { faCircle, faTimesCircle } from '@fortawesome/fontawesome-free-solid'

export default {
  props: [
    'players'
  ],
  components: {
    FontAwesomeIcon
  },
  computed: {
    connectivityIcon () {
      return faCircle
    },
    kickIcon () {
      return faTimesCircle
    }
  },
  methods: {
    kick (idx) {
      console.log(`kicking player ${idx}`)
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
      margin: 0 $size-1;
      color: gray;
    }

    .actions {
      margin-left: auto;

      .action {
        height: 24px;
        color: lightgray;
      }
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
