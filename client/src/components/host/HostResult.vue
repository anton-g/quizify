<template lang="pug">
  .host-result
    h1.has-text-centered Result
    .players
      .winner
        .columns.is-mobile.is-vcentered.is-gapless
          .column
            span.icon.is-medium.is-pulled-right
              i.fa.fa-trophy.fa-2x
          .column.has-text-centered.is-narrow
            span.name {{ winner.name }} ({{ winner.score }})
          .column
            span.icon.is-medium
              i.fa.fa-trophy.fa-2x
      .losers.has-text-centered
        li(v-for="player in losers")
          span.name {{ player.name }} ({{ player.score }})
    .questions
      .has-text-centered
        a(@click="toggleQuestions") {{ showQuestions ? 'Hide questions' : 'Show questions' }}
          span.icon
            i.fa(:class="{ 'fa-caret-up': showQuestions, 'fa-caret-down': !showQuestions }")
      li.question(v-for="question in questions", v-show="showQuestions")
        span {{ question.question }}
        .track
          .track-image
            img.image.is-32x32(:src="question.track.album.images[2].url")
          .track-text
            | {{ question.track.artists[0].name }} - {{ question.track.name }}
</template>

<script>
export default {
  name: 'hostresult',
  data () {
    return {
      showQuestions: false
    }
  },
  computed: {
    players () {
      return this.$store.state.common.players
        .slice()
        .sort((p1, p2) => p1.score - p2.score)
    },
    questions () {
      return this.$store.state.game.questions
    },
    winner () {
      return this.players[0]
    },
    losers () {
      return this.players.slice(1)
    }
  },
  methods: {
    toggleQuestions () {
      this.showQuestions = !this.showQuestions
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/css/mixins.scss';

.host-result {
  max-width: 600px;
  width: 95%;
  margin: 0 auto 0;

  h1 {
    @include branded-heading();
  }

  .winner {
    .name {
      padding: 0 1rem;
      font-size: 1.5rem;
    }
  }

  .losers {
    margin-top: 0.3rem;

    li {
      list-style: none;
    }
  }

  .questions {
    list-style: none;
    margin: 2.5rem auto 0;
    max-width: 350px;

    a {
      color: white;
    }

    .question {
      margin-top: 0.7rem;
      width: 100%;

      span {
        font-weight: 700;
      }

      .image {
        border-radius: 15%;
        margin-right: 0.5rem;
      }

      .track {
        display: flex;

        .track-image {
          flex: none;
        }

        .track-text {
          flex-grow: auto;
        }
      }
    }
  }
}
</style>
