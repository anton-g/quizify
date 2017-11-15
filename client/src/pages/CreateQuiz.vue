<template lang="pug">
  .create-quiz
    h1.title.has-text-centered Create Quiz
    step-bar.stepbar(:currentStep="currentStep")
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
    this.$store.dispatch('createQuiz')

    let params = auth.getHashParams(this.$route.hash)
    if (params.access_token) {
      this.$store.dispatch('login', params)
      this.$router.push({ name: 'create-quiz-playlist' })
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

  .stepbar {
    margin-bottom: 1rem;
  }
}
</style>
