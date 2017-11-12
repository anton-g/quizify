<template lang="pug">
  .create-quiz--login
    a.button.is-dark.is-medium(@click="login")
      span Login with Spotify
      span.icon
        i.fa.fa-spotify
    .why-spotify
      h2 Why do I have to log in?
      p Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras quis sapien ut elit pretium porta nec sit amet eros. Donec ullamcorper imperdiet sapien, lacinia placerat orci finibus vitae. Pellentesque vestibulum nulla ac turpis suscipit faucibus. Suspendisse ultricies lacus quis enim auctor, sit amet consequat tellus porta. Phasellus a turpis mi.
    router-link.back-button(:to="{ name: 'landing' }") No thanks
</template>

<script>
import auth from '@/auth'

export default {
  name: 'createquizlogin',
  methods: {
    login () {
      auth.login()
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
    max-width: 500px;
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
