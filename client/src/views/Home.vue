<template lang="pug">
  .home
    .join
      h2 Join quiz
      .field
        .control.has-icons-left
          input.input(type="text", placeholder="Input quiz key", maxlength="6")
          span.icon.is-small.is-left
            FontAwesomeIcon(:icon="keyIcon")
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
  name: 'home',
  components: {
    FontAwesomeIcon,
  },
  computed: {
    keyIcon () {
      return faKey
    }
  }
};
</script>

<style lang="scss" scoped>
h2 {
  font-weight: 900;
}

.join,
.create {
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
    text-transform: uppercase;

    &::placeholder {
      color: hsl(210, 9%, 66%);
      text-transform: none;
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
</style>
