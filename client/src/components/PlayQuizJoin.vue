<template lang="pug">
  .join-quiz
    h1.title.has-text-centered Join Quiz
    p What should we call you?
    input.name-input(placeholder="Name", v-model="username", @keydown.enter="join")
    a.button.is-dark.is-fullwidth(@click="join") Join lobby
</template>

<script>
export default {
  data () {
    return {
      username: ''
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
@import '../assets/css/mixins.scss';

.join-quiz {
  h1 {
    @include branded-heading();

    margin-bottom: 2.5rem;
  }

  .name-input {
    @include transparent-input();

    margin: 0.3rem 0 0.6rem;
  }
}
</style>
