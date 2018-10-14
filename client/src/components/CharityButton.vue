<template lang="pug">
  a.charity-button(:href="link", target="_blank")
    img(:alt="imgAlt", :src="img")
    span.name Donate to {{ this.name }}
</template>

<script>
export default {
  props: [
    'name',
    'link',
    'logo'
  ],
  computed: {
    img () {
      return require(`../assets/${this.logo}`)
    },
    imgAlt () {
      return `${this.name} logotype`
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@design";

.charity-button {
  display: flex;
  flex-direction: column;
  align-items: center;

  .name {
    font-size: $size-2;
    color: black;
    font-weight: bold;
  }

  &:hover .name {
    text-decoration: underline;
  }
}
</style>
