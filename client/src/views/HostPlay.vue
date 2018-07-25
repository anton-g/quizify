<template lang="pug">
  card.play
    p game
    button.button Prev
    button.button Pause/Play
    button.button Next
</template>

<script>
import Card from '../components/Card.vue'

export default {
  components: {
    Card
  }
}
</script>

<style lang="scss" scoped>

</style>
