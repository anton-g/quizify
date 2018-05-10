<template lang="pug">
  #app
    .header
      h1.title Quizify
    .content
      router-view
</template>

<style lang="sass" src="bulma"></style>
<style lang="scss">
@import '~@design';

html, body {
  width: 100%;
  height: 100%;
  font-family: $font-family-default;
}

#app {
  display: grid;
  grid-template-columns: 28% auto 28%;
  grid-template-rows: $size-12 auto;
  min-height: 100%;
  background:linear-gradient(135deg, #42e695 0%,#3bb2b8 100%);

  .content {
    grid-column: 2;
    grid-row: 2;
  }

  .header {
    grid-column: 2;
    grid-row: 1;
    padding: $size-1;

    .title {
      font-family: $font-family-heading-branded;
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
    grid-template-columns: $size-1 auto $size-1;
  }
}
</style>
