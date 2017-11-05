<template lang="pug">
  .landing
    .menu
      h1.title.has-text-centered SpotiQuiz
      input.pin-input.is-medium(
        type="text"
        placeholder="Quiz PIN"
        :class="{ invalid: invalidPin }"
        :value="quizPin.toUpperCase()"
        @keydown.enter="join"
        @input="inputQuizPin"
      )
      a.button.is-dark.is-fullwidth(
        :class="{ 'is-loading': isJoining }"
        @click="join"
      ) Enter
      horizontal-line-heading OR
      router-link.button.is-white.is-outlined.is-fullwidth(:to="{ name: 'create' }") Create quiz
    .foot
      a About
</template>

<script>
import HorizontalLineHeading from '@/components/HorizontalLineHeading'

export default {
  name: 'LandingPage',
  data () {
    return {
      quizPin: '',
      isJoining: false,
      invalidPin: false
    }
  },
  methods: {
    join () {
      if (this.quizPin.length < 1) {
        this.invalidPin = true
        return
      }

      this.isJoining = true
      setTimeout(() => {
        this.isJoining = false
      }, 1000)
    },
    inputQuizPin (event) {
      this.invalidPin = false
      this.quizPin = event.target.value.toUpperCase()
    }
  },
  components: {
    HorizontalLineHeading
  }
}
</script>

<style lang="scss">
.landing {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;

  .menu {
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

      &.invalid {
        animation: shake .4s linear;
      }

      @keyframes shake {
        8%, 41% {
          -webkit-transform: translateX(-10px);
        }
        25%, 58% {
          -webkit-transform: translateX(10px);
        }
        75% {
          -webkit-transform: translateX(-5px);
        }
        92% {
          -webkit-transform: translateX(5px);
        }
        0%, 100% {
          -webkit-transform: translateX(0);
        }
      }
    }

    ::-webkit-input-placeholder { /* Chrome */
      color: white;
    }
  }

  .foot {
    margin-top: auto;
    margin-bottom: 1rem;

    a {
      color: white;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
