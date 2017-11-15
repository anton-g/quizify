<template lang="pug">
  .join-quiz
    h1.title.has-text-centered Join Quiz
    p What should we call you?
    input.name-input(placeholder="Name")
    a.button.is-dark.is-fullwidth Join lobby
</template>

<script>
export default {
  created () {
    const key = this.$route.params.id
    if (!this.$store.state.quizKey) {
      this.$store.dispatch('verifyRoomKey', key)
      .catch(error => {
        console.log(error)
        this.$router.push({ name: 'landing' })
      })
    }

    console.log(key)
  }
}
</script>

<style lang="scss">
@import '../assets/css/mixins.scss';

.join-quiz {
  color: white;

  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: auto;

  h1 {
    font-family: 'Pacifico', cursive;
    color: white;
    font-weight: normal;
    font-size: 3.5rem;

    margin-bottom: 2.5rem;
  }

  .name-input {
    @include transparent-input();

    margin: 0.3rem 0 0.6rem;
  }
}
</style>
