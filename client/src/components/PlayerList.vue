<template lang="pug">
  .player-list
    h3 Players
    p(v-if="players.length < 1") When your friends join they'll show up here!
    ul(v-if="players.length > 0")
      li Anton
      li Amanda
      li Sofia
      li Malin
</template>

<script>
export default {
  props: {
    players: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>

<style lang="scss">
.player-list {
  h3 {
    font-weight: bold;
  }
}
</style>
