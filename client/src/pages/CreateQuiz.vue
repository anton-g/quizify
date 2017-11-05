<template lang="pug">
  .create-quiz
    h1.title.has-text-centered Create Quiz
    step-bar
    a.button.is-info Log in with Spotify
    a Why?
</template>

<script>
import StepBar from '@/components/StepBar'

export default {
  name: 'CreateQuiz',
  data () {
    return {
    }
  },
  components: {
    StepBar
  }
}
</script>

<style lang="scss">
.create-quiz {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;

  margin-top: auto;
  font-weight: bold;

  h1 {
    font-family: 'Pacifico', cursive;
    color: white;
    font-weight: normal;
    font-size: 3.5rem;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.20);

    margin-bottom: 2.5rem;
  }

  h2 {
    color: white;
    font-weight: normal;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.20);
    font-size: 2rem;
  }

  .button {
    margin: 1rem 0;
  }
}
</style>
