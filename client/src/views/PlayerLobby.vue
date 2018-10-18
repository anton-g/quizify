<template lang="pug">
  card.lobby
    h2.title {{ $t('title') }}
    p.subtitle.is-spaced {{ status }}
    .players
      h3.title.is-5 {{ $t('title:players') }}
      player-list(:players="quizInfo.players")
    .settings(v-if="quizInfo")
      h3.title.is-5 {{ $t('title:settings') }}
      p Selected playlist: {{ quizInfo.playlist }}
      p Number of questions: {{ quizInfo.questionCount }}
      confirm-button.is-pulled-right(@click="leave", :text="$t('text:leave')", :confirmText="$t('text:leave-confirm')")
</template>

<script>
import Card from '@/components/Card.vue'
import ConfirmButton from '@/components/ConfirmButton.vue'
import PlayerList from '@/components/PlayerList.vue'

export default {
  name: 'playerlobby',
  components: {
    Card,
    ConfirmButton,
    PlayerList
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
  },
  methods: {
    leave () {
      this.$store.dispatch('leaveQuiz')
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

  .players {
    margin-bottom: $size-2;
  }
}

</style>

<i18n>
{
  "en": {
    "title": "Lobby",
    "text:status": "Waiting for quiz to start..",
    "title:settings": "Settings",
    "title:players": "Players",
    "text:leave": "Leave quiz",
    "text:leave-confirm": "Are you sure?"
  },
  "sv": {
    "title": "Lobby",
    "text:status": "Väntar på att quizet ska starta..",
    "title:settings": "Inställningar",
    "title:players": "Spelare",
    "text:leave": "Lämna quiz",
    "text:leave-confirm": "Är du säker?"
  }
}
</i18n>
