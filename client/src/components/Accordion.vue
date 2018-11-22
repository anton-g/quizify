<template lang="pug">
  .accordion(:class="{ 'accordion-open': open }")
    a.button.is-fullwidth.is-danger.is-outlined(@click="toggle") {{ title }} {{ open ? '&#9650;' : '&#9660;' }}
    .content(v-show="open")
      slot
</template>

<script>
export default {
  name: 'accordion',
  props: [
    'title'
  ],
  data () {
    return {
      open: false
    }
  },
  methods: {
    toggle () {
      this.open = !this.open
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@design';

.accordion {
  .content {
    padding: $size-1;
  }

  &.accordion-open {
    .button {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    .content {
      border-left: 1px solid red;
      border-right: 1px solid red;
      border-bottom: 1px solid red;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
}
</style>
