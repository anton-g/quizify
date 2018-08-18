<template lang="pug">
  card.lobby
    h2.title {{ $t('title') }}
    p.subtitle.is-spaced {{ status }}
    .settings(v-if="quizInfo")
      h3.title.is-5 {{ $t('title:settings') }}
      p Selected playlist: {{ quizInfo.playlist }}
      p Number of questions: {{ quizInfo.questionCount }}
</template>

<script>
import Card from '@/components/Card.vue'

export default {
  name: 'playerlobby',
  components: {
    Card
  },
  data () {
    return {
      status: this.$t('text:status')
    }
  },
  computed: {
    quizInfo () {
      return this.$store.state.player.quizInfo
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@design';

.lobby {
  h3 {
    margin-bottom: $size-1;
  }
}

</style>

<i18n>
{
  "en": {
    "title": "Lobby",
    "text:status": "Waiting for quiz to start..",
    "title:settings": "Settings"
  },
  "sv": {
    "title": "Lobby",
    "text:status": "Väntar på att quizet ska starta..",
    "title:settings": "Inställningar"
  }
}
</i18n>
