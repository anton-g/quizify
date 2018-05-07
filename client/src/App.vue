<template lang="pug">
  #app
    .header
      h1.title Quizify
    .content
      router-view
</template>

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
  grid-template-columns: 28% auto 28%;
  grid-template-rows: 96px auto;
  min-height: 100%;
  background:linear-gradient(135deg, #42e695 0%,#3bb2b8 100%);

  .content {
    grid-column: 2;
    grid-row: 2;
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
