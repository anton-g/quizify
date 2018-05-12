<template lang="pug">
  .home
    .join
      h2.title Join quiz
      .field
        .control.has-icons-left
          input.input(
            type="text",
            placeholder="Your name",
            v-model="name",
            @keydown.enter="join")
          span.icon.is-small.is-left
            FontAwesomeIcon(:icon="userIcon")
      .field
        .control.has-icons-left
          input.input.key-input(
            type="text",
            placeholder="Input quiz key",
            maxlength="6",
            v-model="key",
            @keydown.enter="join")
          span.icon.is-small.is-left
            FontAwesomeIcon(:icon="keyIcon")
      .field
        .control
          button.button.is-dark.is-fullwidth(@click="join") Join
    .create
      h2.title Create quiz
      p.subtitle Get started by logging in with Spotify
      button.button.is-fullwidth
        | Log in with Spotify
        FontAwesomeIcon(:icon="spotifyIcon", size="lg")
      p
        strong Why do I have to log in?
      p Lorem Ipsum är en utfyllnadstext från tryck- och förlagsindustrin. Lorem ipsum har varit standard ända sedan 1500-talet, när en okänd boksättare tog att antal bokstäver och blandade dem för att göra ett provexemplar av en bok.
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { faKey, faUser } from '@fortawesome/fontawesome-free-solid'
import { faSpotify } from '@fortawesome/fontawesome-free-brands'

export default {
  name: 'home',
  data () {
    return {
      name: '',
      key: ''
    }
  },
  components: {
    FontAwesomeIcon
  },
  computed: {
    keyIcon () {
      return faKey
    },
    userIcon () {
      return faUser
    },
    spotifyIcon () {
      return faSpotify
    }
  },
  methods: {
    join () {
      if (this.key) {
        this.$store.dispatch('joinQuiz', { key: this.key, name: this.name })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@design';

.join,
.create {
  margin-bottom: $size-3;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba($color: #000000, $alpha: 0.18);
  overflow: hidden;

  h2 {
    font-weight: 900;
    margin-bottom: $size-2;
  }

  .field:not(:last-child) {
    margin-bottom: $size-2;
  }
}

.join {
  input {
    border: none;
    width: 100%;
    font-size: 16px;
    padding: $size-1 $size-4;
    background-color: hsl(210, 9%, 96%);
    border-radius: 0;

    &::placeholder {
      color: hsl(210, 9%, 66%);
      text-transform: none;
    }

    &.key-input {
      text-transform: uppercase;
    }
  }

  h2 {
    padding: $size-2 0 0 $size-2;
  }

  button {
    border: none;
    border-radius: 0;
  }
}

.create {
  padding: $size-2;

  .subtitle {
    margin-bottom: $size-2;
  }

  button {
    margin-bottom: $size-2;
    background-color: #1DB954;
    border-color: transparent;
    color: white;
    font-weight: 700;

    svg {
      margin-left: $size-1;
    }
  }
}
</style>
