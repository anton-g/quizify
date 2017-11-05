<template lang="pug">
  .create-quiz
    h1.title.has-text-centered Create Quiz
    step-bar
    a.button.is-dark.is-medium
      span Log in with Spotify
      span.icon
        i.fa.fa-spotify
    .why-spotify
      h2 Why do I have to log in?
      p Det är ett välkänt faktum att läsare distraheras av läsbar text på en sida när man skall studera layouten. Poängen med Lorem Ipsum är att det ger ett normalt ordflöde, till skillnad från "Text här, Text här", och ger intryck av att vara läsbar text. Många publiseringprogram och webbutvecklare använder Lorem Ipsum som test-text.
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
