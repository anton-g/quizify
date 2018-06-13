<template lang="pug">
  card.lobby
    h2.title Lobby
    button.button Start
    h3.title.is-4 Players
    player-list
</template>

<script>
import Card from '../components/Card.vue'
import PlayerList from '../components/PlayerList.vue'

export default {
  components: {
    Card,
    PlayerList
  }
}
</script>

<style lang="scss" scoped>

</style>
