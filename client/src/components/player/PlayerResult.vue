<template lang="pug">
  .player-result
    h1 {{ result }}
</template>

<script>
export default {
  computed: {
    result () {
      return this.$store.state.player.won ? this.$t('win') : this.$t('loss')
    }
  }
}
</script>

<style lang="scss">

</style>

<i18n>
{
  "en": {
    "win": "You won!",
    "loss": "You lost :("
  },
  "sv": {
    "win": "Du vann!",
    "loss": "Du förlorade :("
  }
}
</i18n>
