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
      .field.join-button
        .control
          button.button.is-fullwidth.is-dark(@click="join") {{ $t('join:button') }}
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
      h2.title {{ $t('settings:title') }}
      locale-switcher
    .social
      a(href="http://github.com/anton-g/quizify")
        span.is-sr-only GitHub repository
        FontAwesomeIcon(:icon="githubIcon")
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faKey, faUser } from '@fortawesome/free-solid-svg-icons'
import { faSpotify, faGithub } from '@fortawesome/free-brands-svg-icons'
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
    },
    githubIcon () {
      return faGithub
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

    .field:not(:last-child) {
      margin-bottom: $size-2;
    }

    .title {
      margin: $size-2;
    }

    .join-button {
      margin: $size-2;

      button {
        font-weight: 700;
      }
    }
  }

  .create {
    margin-bottom: $size-3;

    .subtitle {
      margin-bottom: $size-2;
    }

    button {
      margin-bottom: $size-2;
      background-color: #10893C;
      border-color: transparent;
      color: white;
      font-weight: 700;

      &:hover {
        background-color: #119240;
      }

      svg {
        margin-left: $size-1;
      }
    }
  }

  .settings {
    margin-bottom: $size-3;
  }

  .social {
    display: flex;
    justify-content: center;

    a {
      color: rgba(255, 255, 255, 0.8);

      &:hover {
        color: rgba(255, 255, 255, 1);
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
    "create:text:login": "By logging in with Spotify we can access your playlists and help you control the music from Quizify.",
    "settings:title": "Settings"
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
    "create:text:login": "Genom att logga in med Spotify så kan du hämta dina spellistor och styra musiken direkt från Quizify.",
    "settings:title": "Inställningar"
  }
}
</i18n>
