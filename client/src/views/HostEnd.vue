<template lang="pug">
  card.host-end
    h2.title {{ $t('title') }}
    player-result-list.result-list(:results="result")
    .field
      .control
        button.button.is-dark.is-pulled-right(@click="home") {{ $t('button:home') }}
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

.result-list {
  margin-bottom: $size-2;
}
</style>

<i18n>
{
  "en": {
    "title": "Result",
    "button:home": "Home"
  }
}
</i18n>
