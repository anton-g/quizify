<template lang="pug">
  .landing
    .menu
      h1.title.has-text-centered
        | Quizify
        span.tag.is-dark ALPHA
      transition(type="animation")
        input.key-input.is-medium(
          type="text"
          placeholder="Quiz key"
          :class="{ invalid: invalidKey }"
          :value="quizKey.toUpperCase()"
          @keydown.enter="join"
          @input="inputQuizKey"
        )
      a.button.is-dark.is-fullwidth(
        :class="{ 'is-loading': isJoining }"
        @click="join"
      ) Enter
      horizontal-line-heading OR
      router-link.button.is-white.is-outlined.is-fullwidth(:to="{ name: createButtonInfo.pathName }") {{ createButtonInfo.text }}
    .foot
      a About
</template>

<script>
import HorizontalLineHeading from '@/components/common/HorizontalLineHeading'

export default {
  name: 'LandingPage',
  data () {
    return {
      quizKey: '',
      isJoining: false,
      invalidKey: false
    }
  },
  methods: {
    join () {
      if (this.quizKey.length < 1) {
        this.invalidKey = true
        return
      }

      this.isJoining = true

      this.$store.dispatch('verifyQuizKey', this.quizKey)
      .then(() => {
        this.$router.push({ name: 'play', params: { id: this.quizKey } })
      })
      .catch(error => {
        console.log(error)
        this.invalidKey = true
        this.isJoining = false
      })
    },
    inputQuizKey (event) {
      this.invalidKey = false
      this.quizKey = event.target.value.toUpperCase()
    }
  },
  computed: {
    createButtonInfo () {
      return {
        pathName: this.$store.getters.hasCreatedQuiz ? 'create-quiz-lobby' : 'create',
        text: this.$store.getters.hasCreatedQuiz ? 'Back to your quiz' : 'Create quiz'
      }
    }
  },
  components: {
    HorizontalLineHeading
  }
}
</script>

<style lang="scss">
@import '../assets/css/mixins.scss';

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
      @include branded-heading();

      position: relative;
      margin-bottom: 2.5rem;

      span {
        font-family: Arial, Helvetica, sans-serif;
        text-shadow: none;

        position: absolute;
        top: 0.5rem;
        margin-left: -1rem;
        transform: rotateZ(25deg);
      }
    }

    .button {
      margin: 1rem 0;
    }

    .key-input {
      @include transparent-input();

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
