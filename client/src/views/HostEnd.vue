<template lang="pug">
  card.host-end
    h2.title {{ $t('title') }}
    player-result-list.result-list(:results="result")
    .charities
      h2.title.is-4 {{ $t('charity:title') }}
      p {{ $t('charity:text') }}
      charity-button.charity(v-for="charity in charities", :key="charity.name", :name="charity.name", :link="charity.link", :logo="charity.img")
    .field
      .control
        button.button.is-dark.is-pulled-right(@click="home") {{ $t('button:home') }}
</template>
<script>
import Card from '@/components/Card.vue'
import PlayerResultList from '@/components/PlayerResultList.vue'
import CharityButton from '@/components/CharityButton.vue'

export default {
  components: {
    CharityButton,
    Card,
    PlayerResultList
  },
  data () {
    return {
      charities: []
    }
  },
  async created () {
    this.charities = await this.$store.dispatch('getCharities')
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

.charities {
  .title {
    margin-bottom: $size-1;
  }

  .charity {
    max-height: 135px;
    max-width: 80%;
    margin: $size-2 auto;
  }
}
</style>

<i18n>
{
  "en": {
    "title": "Result",
    "button:home": "Home",
    "charity:title": "Thanks for playing!",
    "charity:text": "Quizify is completely free to play, but if you like it please consider donating to one of the charities below:"
  },
  "sv": {
    "title": "Resultat",
    "button:home": "Tillbaka",
    "charity:title": "Tack för att du spelade!",
    "charity:text": "Quizify är helt gratis, men om du tycker om Quizify får du gärna överväga att donera en slant till någon av dessa organisationer:"
  }
}
</i18n>
