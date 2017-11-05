<template lang="pug">
  .landing
    .menu
      h1.title.has-text-centered SpotiQuiz
      input.pin-input.is-medium(type="text" placeholder="Game PIN")
      a.button.is-black.is-fullwidth Join
      horizontal-line-heading OR
      a.button.is-white.is-outlined.is-fullwidth Create quiz
    .foot
      p footer
</template>

<script>
import HorizontalLineHeading from '@/components/HorizontalLineHeading'

export default {
  name: 'LandingPage',
  components: {
    HorizontalLineHeading
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Pacifico');

.landing {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.20);

  .menu {
    margin-top: auto;
    font-weight: bold;

    h1 {
      font-family: 'Pacifico', cursive;
      color: white;
      font-weight: normal;
      font-size: 3.5rem;

      margin-bottom: 2.5rem;
    }

    .button {
      margin: 1rem 0;
    }

    .pin-input {
      width: 100%;
      text-align: center;
      font-size: 1.5rem;
      line-height: 1.5;
      padding: .3em 1em;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.20);
      background-color: rgba(255, 255, 255, 0.20);
      border: 1px solid transparent;
      border-radius: .3rem;
      color: white;

      &:focus {
        box-sizing: border-box;
        outline: none;
        background-color: rgba(255, 255, 255, 0.25);
        border-color: rgba(255, 255, 255, 0.35);
      }
    }

    ::-webkit-input-placeholder { /* Chrome */
      color: white;
    }
  }

  .foot {
    margin-top: auto;
  }
}
</style>
