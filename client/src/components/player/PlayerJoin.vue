<template lang="pug">
  .join-quiz
    h1.title.has-text-centered {{ $t('heading') }}
    p {{ $t('name-question') }}
    input.name-input(
      :placeholder="$t('name-placeholder')",
      :class="{ invalid: invalidName }",
      v-model="username",
      @keydown.enter="join")
    a.button.is-dark.is-fullwidth(@click="join") {{ $t('join-button') }}
</template>

<script>
export default {
  data () {
    return {
      username: '',
      invalidName: false
    }
  },
  created () {
    const key = this.$route.params.id
    if (!this.$store.state.player.selectedQuizKey) {
      this.$store.dispatch('verifyQuizKey', key)
      .catch(error => {
        console.log(error)
        this.$router.push({ name: 'landing' })
      })
    }
  },
  methods: {
    join () {
      if (this.username.length < 1) {
        this.invalidName = true
        return
      }

      this.$store.dispatch('joinSelectedQuiz', this.username)
      .then(() => {
        console.log('joining')
        this.$router.push({ name: 'lobby' })
      })
      .catch(() => {
        console.log('error')
      })
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/css/mixins.scss';

.join-quiz {
  h1 {
    @include branded-heading();

    margin-bottom: 2.5rem;
  }

  .name-input {
    @include default-input();

    margin: 0.3rem 0 0.6rem;
  }
}
</style>

<i18n>
{
  "en": {
    "heading": "Join Quiz",
    "name-question": "What should we call you?",
    "name-placeholder": "Your namn..",
    "join-button": "Join lobby"
  },
  "sv": {
    "heading": "Välj namn",
    "name-question": "Vad ska vi kalla dig?",
    "name-placeholder": "Skriv namn..",
    "join-button": "Anslut"
  }
}
</i18n>
