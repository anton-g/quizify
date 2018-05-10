<template lang="pug">
  .home
    .join
      h2 Join quiz
      .field
        .control.has-icons-left
          input.input(type="text", placeholder="Your name", v-model="name")
          span.icon.is-small.is-left
            FontAwesomeIcon(:icon="userIcon")
      .field
        .control.has-icons-left
          input.input.key-input(type="text", placeholder="Input quiz key", maxlength="6", v-model="key")
          span.icon.is-small.is-left
            FontAwesomeIcon(:icon="keyIcon")
      .field
        .control
          button.button.is-dark.is-fullwidth(@click="join") Join
    .create
      h2 Create quiz
      p To create a quiz you have to log in with Spotify.
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { faKey, faUser } from '@fortawesome/fontawesome-free-solid'

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
    }
  },
  methods: {
    join () {
      if (this.key) {
        this.$store.dispatch('joinQuiz', { key: this.key, name: 'nisse' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@design';

h2 {
  font-weight: 900;
}

.join,
.create {
  margin-bottom: $size-3;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba($color: #000000, $alpha: 0.18);
  overflow: hidden;

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

  button {
    border: none;
    border-radius: 0;
  }

  h2 {
    padding: $size-2 0 0 $size-2;
  }
}
</style>
