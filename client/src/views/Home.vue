<template lang="pug">
  .home
    card.join
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
    card.create
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
import { SOCKET_STORAGE_ITEM } from '../common/constants'

import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { faKey, faUser } from '@fortawesome/fontawesome-free-solid'
import { faSpotify } from '@fortawesome/fontawesome-free-brands'
import Card from '../components/Card.vue'

export default {
  name: 'home',
  data () {
    return {
      name: '',
      key: ''
    }
  },
  components: {
    FontAwesomeIcon,
    Card
  },
  created () {
    console.log('Checking if previous connected quiz exists..')
    const socket = localStorage.getItem(SOCKET_STORAGE_ITEM)
    if (!socket) {
      console.log('Could not find any previous game.')
      return
    }

    console.log(`Found previous socket ${socket}, trying to reconnect..`)
    this.$store.dispatch('reconnectQuiz', socket)
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
    async join () {
      if (this.key) {
        await this.$store.dispatch('joinQuiz', { key: this.key, name: this.name })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@design';

.home {
  .join {
    margin-bottom: $size-3;
    padding: 0;

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
      padding: $size-2;
      margin-bottom: 0;
    }

    button {
      border: none;
      border-radius: 0;
    }

    .field:not(:last-child) {
      margin-bottom: $size-2;
    }
  }

  .create {
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
}
</style>
