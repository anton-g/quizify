<template lang="pug">
  #app
    .header
      h1.title Quizify
    .content
      .join
        h2 Join quiz
        .field
          .control.has-icons-left
            input.input(type="text", placeholder="key")
            span.icon.is-small.is-left
              FontAwesomeIcon(:icon="icon")
        .field
          .control
            button.button.is-dark.is-fullwidth Join
      .create
        h2 Create quiz
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { faKey } from '@fortawesome/fontawesome-free-solid'

export default {
  components: {
    FontAwesomeIcon,
  },
  computed: {
    icon () {
      return faKey
    }
  }
}
</script>


<style lang="sass" src="bulma"></style>
<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Pacifico');
@import url('https://fonts.googleapis.com/css?family=Roboto:900');

html, body {
  width: 100%;
  height: 100%;
  font-family: 'Roboto', sans-serif;
}

#app {
  display: grid;
  grid-template-columns: 25% auto 25%;
  grid-template-rows: 96px auto;
  min-height: 100%;
  background:linear-gradient(135deg, #42e695 0%,#3bb2b8 100%);

  .content {
    grid-column: 2;
    grid-row: 2;

    h2 {
      font-weight: 900;
    }

    .join, .create {
      margin-bottom: 24px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0px 2px 4px rgba($color: #000000, $alpha: 0.18);
      overflow: hidden;

      input {
        border: none;
        width: 100%;
        font-size: 16px;
        padding: 8px 32px;
        background-color: hsl(210, 9%, 96%);
        border-radius: 0;

        &::placeholder {
          color: hsl(210, 9%, 66%);
        }
      }

      button {
        border: none;
        border-radius: 0;
      }

      h2 {
        padding: 16px 0 0 16px;
      }
    }
  }

  .header {
    grid-column: 2;
    grid-row: 1;
    padding: 8px;

    .title {
      font-family: 'Pacifico', cursive;
      font-weight: normal;
      color: white;
      text-shadow: 1px 1px black;
      font-size: 3.5rem;
      text-align: center;
    }
  }
}

@media screen and (max-width: 900px) {
  #app {
    grid-template-columns: 8px auto 8px;
  }
}
</style>
