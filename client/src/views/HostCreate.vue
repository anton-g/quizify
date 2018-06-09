<template lang="pug">
  card.create
    h2.title Create quiz
    p Playlist
    .field.is-grouped
      .control
        button.button.is-danger.is-outlined(@click="cancel") Cancel
      .control
        button.button.is-dark.is-fullwidth Create
</template>

<script>
import Card from '../components/Card.vue'

export default {
  components: {
    Card
  },
  methods: {
    cancel () {
      // TODO
      console.log('cancel creation')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
