<template lang="pug">
  card.privacy
    h2.title Privacy
    p.subtitle
      strong What information do we collect?
    p.paragraph Quizify is built on the premise to only collect the minimum amount of information needed.
    p.paragraph If you <strong>join</strong> a quiz we will save the following information:
    ul
      li The name you use in the quiz
    p.paragraph If you <strong>create</strong> a quiz by logging in with Spotify we will save the following information:
    ul
      li Spotify username
      li OAuth tokens
    p.subtitle
      strong What do we do with your information?
    p.paragraph We don't use the information for anything else than providing and improving the service. We will <strong>never</strong> provide your information to third parties in promotional or advertising purposes.
    router-link.button.is-pulled-right(tag="button", :to="{ name: 'home' }") {{ $t('button:home') }}
</template>

<script>
import Card from '@/components/Card.vue'

export default {
  components: {
    Card
  }
}
</script>

<style lang="scss" scoped>
@import "~@design";

.privacy {
  .subtitle {
    margin-bottom: $size-1;
  }

  .paragraph {
    margin-bottom: $size-1;
  }

  ul {
    list-style: disc inside;
    margin-bottom: $size-2;
  }
}
</style>

<i18n>
{
  "en": {
    "button:home": "Home"
  },
  "sv": {
    "button:home": "Home"
  }
}
</i18n>
