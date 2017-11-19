<template lang="pug">
  .player-quiz
    a.buzzer.button.is-dark Buzz
</template>

<script>
export default {

}
</script>

<style lang="scss">
.player-quiz {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;

  a.buzzer {
    min-width: 300px;
    min-height: 300px;
    border-radius: 4rem;

    font-size: 5rem;
    font-family: 'Pacifico', cursive;
  }
}
</style>
