<template lang="pug">
  #app
    header.header
      h1.title.has-text-centered Quizify
    main.main
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

// Remove when bulma 0.7.2 is released https://github.com/jgthms/bulma/issues/150
.is-sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  border: 0 !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  clip-path: inset(50%) !important;
  white-space: nowrap !important;
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
