<template lang="pug">
  .player-list
    h3 Players
    p(v-if="players.length < 1") When your friends join they'll show up here!
    ul
      li(v-for="player in players", :class="{ disconnected: !player.connected }")
        span {{ player.name }}
        span.icon(v-if="currentUserId === player.id")
          i.fa.fa-star
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

  ul li.disconnected {
    text-decoration: line-through;
    color: rgba(255, 255, 255, 0.7);
  }
}
</style>
