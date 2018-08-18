<template lang="pug">
  .play
    card.buzzer
      h2.title {{ $t('title') }}
      a(href="javascript:void(0);",
        @click="buzz",
        @keydown.enter="buzz",
        :class="{ disabled: paused }")
        span {{ $t('button:buzz') }}
    card.stats
      h2.title {{ $t('text:points', { points: playerScore }) }}
      p.subtitle {{ $t('text:currentquestion', { number: currentQuestionNo, total: questionCount }) }}
</template>

<script>
import Card from '@/components/Card.vue'

export default {
  components: {
    Card
  },
  methods: {
    buzz () {
      if (!this.paused) {
        this.$socket.emit('BUZZ', this.$store.state.player.me.id)
      }
    }
  },
  computed: {
    paused () {
      return this.$store.getters.paused
    },
    playerScore () {
      return this.$store.state.player.me.score
    },
    currentQuestionNo () {
      return this.$store.state.player.quizInfo.currentQuestionNo
    },
    questionCount () {
      return this.$store.state.player.quizInfo.questionCount
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@design';

.play {
  display: flex;
  flex-direction: column;

  .buzzer {
    margin-bottom: $size-2;

    a {
      cursor: pointer;
      user-select: none;
      display: inline-block;
      border-radius: 8px;
      box-shadow: 0 8px 0 #c53737, 0 15px 20px rgba(0, 0, 0, .35);
      transition: box-shadow .05s ease-in-out;
      transition: filter .1s ease-in-out;
      font-size: 60px;
      color: #fff;
      width: 100%;
      text-align: center;
      margin-bottom: $size-2;

      span {
        width: 100%;
        display: inline-block;
        padding: 100px 30px;
        background-color: #ec5252;
        background-image: linear-gradient(rgba(249, 158, 158, 0.8), rgba(247, 109, 109, 0.2));
        border-radius: 8px;
        box-shadow: inset 0 -1px 1px rgba(255, 255, 255, .15);
        font-family: 'Pacifico', Arial, sans-serif;
        line-height: 1;
        text-shadow: 0 -1px 1px rgba(175, 49, 95, .7);
        transition: background-color .2s ease-in-out, transform .1s ease-in-out;
      }

      &:hover span {
        background-color: #ec6a6a;
        text-shadow: 0 -1px 1px rgba(175, 49, 49, 0.9), 0 0 5px rgba(255, 255, 255, .8);
      }

      &:active, &:focus {
        box-shadow: 0 8px 0 #c53737, 0 12px 10px rgba(0, 0, 0, .3);
      }

      &:active span {
        transform: translate(0, 6px);
      }

      &.disabled {
        box-shadow: 0 8px 0 #c53737, 0 12px 10px rgba(0, 0, 0, .3);
        cursor: not-allowed;
        filter: opacity(70%);

        span {
          transform: translate(0, 6px);
        }

        &:hover span {
          background-color: #ec5252;
          text-shadow: 0 -1px 1px rgba(175, 49, 95, .7);;
        }
      }
    }
  }

  .stats {
    margin-bottom: $size-2;
  }
}
</style>

<i18n>
{
  "en": {
    "title": "Buzzer",
    "button:buzz": "Buzz!",
    "text:points": "{points} points",
    "text:currentquestion": "Question {number} of {total}"
  },
  "sv": {
    "title": "Buzzer",
    "button:buzz": "Buzz!",
    "text:points": "{points} poäng",
    "text:currentquestion": "Fråga {number} av {total}"
  }
}
</i18n>
