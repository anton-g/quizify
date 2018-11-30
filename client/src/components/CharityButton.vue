<template lang="pug">
  a.charity-button(:href="link", target="_blank")
    img(:alt="imgAlt", :src="logo", style="max-height: 100px;")
    span.name {{ $t('text') }} {{ this.name }}
</template>

<script>
export default {
  props: [
    'name',
    'link',
    'logo'
  ],
  computed: {
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
    padding-top: $size-1;
  }

  &:hover .name {
    text-decoration: underline;
  }
}
</style>

<i18n>
{
  "en": {
    "text": "Donate to"
  },
  "sv": {
    "text": "Donera till"
  }
}
</i18n>
