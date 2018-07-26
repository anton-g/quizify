<template lang="pug">
  card.host-end
    h2.title Result
    player-result-list(:results="result")
    .field
      .control
        button.button.is-dark.is-pulled-right(@click="home") Home
</template>

<script>
import Card from '@/components/Card.vue'
import PlayerResultList from '@/components/PlayerResultList.vue'

export default {
  components: {
    Card,
    PlayerResultList
  },
  computed: {
    result () {
      return this.$store.state.host.result
    }
  },
  methods: {
    home () {
      this.$router.push({ name: 'home' })
      this.$store.dispatch('cleanupHost')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@design';

</style>
