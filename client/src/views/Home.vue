<template lang="pug">
  .home
    card.join
      h2.title {{ $t('join:title') }}
      label.is-sr-only(for="join-name-input") {{ $t('join:input:name:sr') }}
      .field
        .control.has-icons-left
          input.input(
            id="join-name-input",
            type="text",
            :placeholder="$t('join:input:name:placeholder')",
            v-model="name",
            @keydown.enter="join")
          span.icon.is-small.is-left
            FontAwesomeIcon(:icon="userIcon")
      label.is-sr-only(for="join-key-input") {{ $t('join:input:key:sr') }}
      .field
        .control.has-icons-left
          input.input.key-input(
            id="join-key-input",
            type="text",
            :placeholder="$t('join:input:key:placeholder')",
            maxlength="6",
            v-model="key",
            @keydown.enter="join")
          span.icon.is-small.is-left
            FontAwesomeIcon(:icon="keyIcon")
      .field
        .control
          button.button.is-dark.is-fullwidth(@click="join") {{ $t('join:button') }}
    card.create
      h2.title {{ $t('create:title') }}
      p.subtitle {{ $t('create:subtitle' )}}
      button.button.is-fullwidth(@click="create")
        | {{ $t('create:button:login') }}
        FontAwesomeIcon(:icon="spotifyIcon", size="lg")
      p
        strong {{ $t('create:title:login') }}
      p {{ $t('create:text:login') }}
    card.settings
      locale-switcher
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { faKey, faUser } from '@fortawesome/fontawesome-free-solid'
import { faSpotify } from '@fortawesome/fontawesome-free-brands'
import Card from '../components/Card.vue'
import { reconnectOnCreation } from '../mixins/reconnect.js'
import LocaleSwitcher from '../components/LocaleSwitcher.vue'

export default {
  name: 'home',
  mixins: [reconnectOnCreation],
  data () {
    return {
      name: '',
      key: ''
    }
  },
  components: {
    FontAwesomeIcon,
    Card,
    LocaleSwitcher
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
    },
    create () {
      this.$store.dispatch('login')
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
    margin-bottom: $size-3;

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

<i18n>
{
  "en": {
    "join:title": "Join Quiz",
    "join:input:name:placeholder": "Your name",
    "join:input:name:sr": "Your name",
    "join:input:key:placeholder": "Input quiz key",
    "join:input:key:sr": "Quiz key",
    "join:button": "Join",
    "create:title": "Create Quiz",
    "create:subtitle": "Get started by logging in with Spotify",
    "create:button:login": "Log in with Spotify",
    "create:title:login": "Why do I have to log in?",
    "create:text:login": "Lorem Ipsum är en utfyllnadstext från tryck- och förlagsindustrin. Lorem ipsum har varit standard ända sedan 1500-talet, när en okänd boksättare tog att antal bokstäver och blandade dem för att göra ett provexemplar av en bok."
  },
  "sv": {
    "join:title": "Gå med",
    "join:input:name:placeholder": "Ditt namn",
    "join:input:name:sr": "Fyll i ditt namn",
    "join:input:key:placeholder": "Nyckel",
    "join:input:key:sr": "Fyll i nyckeln till quizet",
    "join:button": "Gå med",
    "create:title": "Skapa Quiz",
    "create:subtitle": "Kom igång genom att logga in med Spotify",
    "create:button:login": "Logga in med Spotify",
    "create:title:login": "Varför måste jag logga in?",
    "create:text:login": "Lorem Ipsum är en utfyllnadstext från tryck- och förlagsindustrin. Lorem ipsum har varit standard ända sedan 1500-talet, när en okänd boksättare tog att antal bokstäver och blandade dem för att göra ett provexemplar av en bok."
  }
}
</i18n>
