<template lang="pug">
  .create-quiz--login
    a.button.is-dark.is-medium(@click="login")
      span {{ $t('spotify-button') }}
      span.icon
        i.fa.fa-spotify
    .why-spotify
      h2 {{ $t('why-heading') }}
      p {{ $t('why-body') }}
    router-link.back-button(:to="{ name: 'landing' }") {{ $t('back-button') }}
</template>

<script>
import auth from '@/auth'

export default {
  name: 'HostLogin',
  methods: {
    login () {
      auth.login()
    }
  },
  created () {
    if (this.$store.getters.isAuthorized) {
      this.$router.replace({ name: 'create-quiz-playlist' })
    }
  }
}
</script>

<style lang="scss">
.create-quiz--login {
  text-align: center;

  .button {
    margin-bottom: 1rem;
    font-weight: bold;
  }

  .why-spotify {
    text-align: left;
    padding: 0 30px;

    h2 {
      font-weight: bold;
    }
  }

  .back-button {
    margin-top: 1rem;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: underline;

    &:hover {
      color: white;
    }
  }
}
</style>

<i18n>
{
  "en": {
    "spotify-button": "Login with Spotify",
    "why-heading": "Why do I have to log in?",
    "why-body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras quis sapien ut elit pretium porta nec sit amet eros. Donec ullamcorper imperdiet sapien, lacinia placerat orci finibus vitae. Pellentesque vestibulum nulla ac turpis suscipit faucibus. Suspendisse ultricies lacus quis enim auctor, sit amet consequat tellus porta. Phasellus a turpis mi.",
    "back-button": "No thanks"
  },
  "sv": {
    "spotify-button": "Logga in med Spotify",
    "why-heading": "Varför måste jag logga in?",
    "why-body": "Lorem ipsum",
    "back-button": "Tillbaka"
  }
}
</i18n>
