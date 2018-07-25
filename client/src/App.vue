<template lang="pug">
  #app
    section.header
      h1.title.has-text-centered Quizify
    section.main
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

h1, h2, h3, h4, h5 {
  font-family: $font-family-heading;
}

#app {
  display: grid;
  grid-template-columns: auto 400px auto;
  grid-template-rows: $size-12 auto;
  min-height: 100%;
  background:linear-gradient(135deg, #42e695 0%,#3bb2b8 100%);

  .main {
    grid-column: 2;
    grid-row: 2;

    margin-bottom: $size-3;
  }

  .header {
    grid-column: 2;
    grid-row: 1;
    padding: $size-1;

    h1 {
      font-family: $font-family-heading-branded;
      font-weight: normal;
      color: white;
      text-shadow: 1px 1px black;
      font-size: 3.5rem;
    }
  }
}

.selection-none {
  user-select: none;
}

@media screen and (max-width: 900px) {
  #app {
    grid-template-columns: $size-1 auto $size-1;
  }
}
</style>
