<template lang="pug">
  .wrapper
    confetti(:run="won", :width="width", :height="height")
    card.results
      h2.title {{ title }}
      player-result-list.result-list(:results="results")
      .charities
        h2.title.is-4 {{ $t('charity:title') }}
        p {{ $t('charity:text') }}
        charity-button.charity(name="UNICEF", link="https://support.unicef.org/donate/now", logo="unicef.svg")
      .field
        .control
          button.button.is-dark.is-pulled-right(@click="home") {{ $t('button:home') }}
</template>

<script>
import Card from '@/components/Card.vue'
import PlayerResultList from '@/components/PlayerResultList.vue'
import Confetti from '@/components/confetti/Confetti.vue'
import CharityButton from '@/components/CharityButton.vue'

export default {
  name: 'playerend',
  components: {
    Card,
    PlayerResultList,
    Confetti,
    CharityButton
  },
  computed: {
    results () {
      return this.$store.state.player.result.slice().sort((a, b) => b.score - a.score)
    },
    won () {
      return this.results[0].id === this.$store.state.player.me.id
    },
    title () {
      return this.won ? this.$t('title:win') : this.$t('title:loss')
    },
    height () {
      return window.innerHeight
    },
    width () {
      return window.innerWidth
    }
  },
  methods: {
    home () {
      this.$router.push({ name: 'home' })
      this.$store.dispatch('cleanupPlayer')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@design';

.results {
  z-index: 3;
  position: relative;
}

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
    "title:win": "You won!",
    "title:loss": "Game ended",
    "button:home": "Home",
    "charity:title": "Thanks for playing!",
    "charity:text": "Quizify is completely free to play, but if you like it please consider donating to one of the charities below:"
  },
  "sv": {
    "title:win": "Du vann!",
    "title:loss": "Slut",
    "button:home": "Hem",
    "charity:title": "Tack för att du spelade!",
    "charity:text": "Quizify är helt gratis, men om du tycker om Quizify får du gärna överväga att donera en slant till någon av dessa organisationer:"
  }
}
</i18n>
