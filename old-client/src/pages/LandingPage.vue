<template lang="pug">
  .landing
    .menu
      h1.title.has-text-centered
        | Quizify
        span.tag.is-dark ALPHA
      input.key-input.is-medium(
        type="text"
        :placeholder="$t('key-placeholder')"
        :class="{ invalid: invalidKey }"
        :value="quizKey.toUpperCase()"
        @keydown.enter="join"
        @input="inputQuizKey"
      )
      a.button.is-dark.is-fullwidth(
        :class="{ 'is-loading': isJoining }"
        @click="join"
      ) {{ $t('join-button') }}
      horizontal-line-heading {{ $t('or-heading') }}
      router-link.button.is-white.is-outlined.is-fullwidth(:to="{ name: createButtonInfo.pathName }") {{ createButtonInfo.text }}
    .foot
      a {{ $t('about-button') }}
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
    test () {
      console.log('t')
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
        text: this.$store.getters.hasCreatedQuiz ? this.$t('rejoin-button') : this.$t('create-button')
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
      @include default-input();
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

<i18n>
{
  "en": {
    "about-button": "About",
    "or-heading": "or",
    "create-button": "Create quiz",
    "rejoin-button": "Back to your quiz",
    "join-button": "Enter",
    "key-placeholder": "Enter quiz key.."
  },
  "sv": {
    "about-button": "Om Quizify",
    "or-heading": "eller",
    "create-button": "Skapa quiz",
    "rejoin-button": "Tillbaka till ditt quiz",
    "join-button": "Gå med",
    "key-placeholder": "Fyll i nyckel.."
  }
}
</i18n>
