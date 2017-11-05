<template lang="pug">
  .create-quiz
    h1.title.has-text-centered Create Quiz
    step-bar(:currentStep="1")
    a.button.is-dark.is-medium
      span Login with Spotify
      span.icon
        i.fa.fa-spotify
    .why-spotify
      h2 Why do I have to log in?
      p Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras quis sapien ut elit pretium porta nec sit amet eros. Donec ullamcorper imperdiet sapien, lacinia placerat orci finibus vitae. Pellentesque vestibulum nulla ac turpis suscipit faucibus. Suspendisse ultricies lacus quis enim auctor, sit amet consequat tellus porta. Phasellus a turpis mi.
    router-link.back-button(:to="{ name: 'landing' }") No thanks
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

  h1 {
    font-family: 'Pacifico', cursive;
    color: white;
    font-weight: normal;
    font-size: 3.5rem;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.20);

    margin-bottom: 2.5rem;
  }

  .button {
    margin: 1rem 0;
    font-weight: bold;
  }

  .why-spotify {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.20);
    h2 {
      font-weight: bold;
    }

    max-width: 500px;
    padding: 0 30px;
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
