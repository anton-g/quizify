<template lang="pug">
  .create-quiz
    h1.title.has-text-centered {{ $t('heading') }}
    .step-bar
      step-bar(:currentStep="currentStep")
    router-view
</template>

<script>
import auth from '@/auth'

import StepBar from '@/components/common/StepBar'

export default {
  name: 'hostnewquiz',
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
@import '../../assets/css/mixins.scss';

.create-quiz {
  .step-bar {
    margin-bottom: 1rem;
  }

  h1 {
    @include branded-heading();

    margin-bottom: 2.5rem;
  }
}
</style>

<i18n>
{
  "en": {
    "heading": "Create Quiz"
  },
  "sv": {
    "heading": "Skapa Quiz"
  }
}
</i18n>
