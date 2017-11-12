<template lang="pug">
  .create-quiz
    h1.title.has-text-centered Create Quiz
    step-bar(:currentStep="currentStep")
    router-view
</template>

<script>
import auth from '@/auth'

import StepBar from '@/components/StepBar'

export default {
  name: 'CreateQuiz',
  components: {
    StepBar
  },
  created () {
    if (auth.loginCallback(this.$route.hash)) {
      this.$router.push({ name: 'create-quiz-songs' })
    }
  },
  computed: {
    currentStep () {
      return this.$route.matched[this.$route.matched.length - 1].meta.step
    }
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

  h1 {
    font-family: 'Pacifico', cursive;
    color: white;
    font-weight: normal;
    font-size: 3.5rem;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.20);

    margin-bottom: 2.5rem;
  }
}
</style>
