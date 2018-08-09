<template lang="pug">
  .modal(:class="{ 'is-active': active }")
    .modal-background
    .modal-content
      slot(name="content")
        card
          slot
    slot(name="close")
      button.modal-close.is-large(aria-label="close", @click="$emit('close')", @keydown.enter="$emit('close')")
</template>

<script>
import Card from './Card.vue'

export default {
  components: {
    Card
  },
  props: {
    active: Boolean
  },
  name: 'modal'
}
</script>
