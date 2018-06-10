<template lang="pug">
  .modal
    .modal-background
    .modal-content
      slot(name="content")
        card
          slot
    slot(name="close")
      button.modal-close.is-large(aria-label="close", @click="$emit('close')")
</template>

<script>
import Card from './Card.vue'

export default {
  components: {
    Card
  },
  name: 'modal'
}
</script>
