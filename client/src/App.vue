<template lang="pug">
  #app
    header.header
      h1.title.has-text-centered
        | Quizify
        span.beta.tag.is-dark BETA
    main.main
      router-view
</template>

<script>
export default {
  created () {
    const lang = localStorage.getItem('lang')
    if (lang) {
      this.$store.dispatch('changeLocale', lang)
    }
  }
}
</script>

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

    .title {
      font-family: $font-family-heading-branded;
      font-weight: normal;
      color: white;
      text-shadow: 1px 1px rgba(0, 0, 0, 0.35);
      font-size: 3.5rem;

      .beta {
        position: absolute;
        font-size: .75rem;
        height: 2em;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1.5;
        padding: 0 .75em;
        border-radius: 4px;
        color: #555555;
        background-color: #f5f5f5;
        font-family: $font-family-default;
        text-shadow: none;
        box-shadow: 1px 1px rgba(0, 0, 0, 0.25);
      }
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
