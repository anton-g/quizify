<template lang="pug">
  .player-list
    h3 Players
    p(v-if="players.length < 1") {{ $t('no-players') }}
    ul
      li(v-for="player in players")
        span(:class="{ disconnected: !player.connected }") {{ player.name }}
        span(v-if="currentUserId === player.id")  ({{ $t('you-indicator') }})
        span.icon(v-if="!player.connected")
          i.fa.fa-user-times
</template>

<script>
export default {
  props: {
    players: {
      type: Array,
      default: () => {
        return []
      }
    },
    currentUserId: {
      type: String
    }
  }
}
</script>

<style lang="scss">
.player-list {
  h3 {
    font-weight: bold;
  }

  .disconnected {
    text-decoration: line-through;
    color: rgba(255, 255, 255, 0.8);
  }
}
</style>

<i18n>
{
  "en": {
    "no-players": "When your friends join they'll show up here!",
    "you-indicator": "you"
  },
  "sv": {
    "no-players": "Här syns dina vänner när de ansluter!",
    "you-indicator": "du"
  }
}
</i18n>
