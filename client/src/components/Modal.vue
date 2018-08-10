<template lang="pug">
  focus-trap(:active="active")
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
import FocusTrap from './FocusTrap.vue'
import Card from './Card.vue'

export default {
  components: {
    FocusTrap,
    Card
  },
  props: {
    active: Boolean
  },
  name: 'modal'
}
</script>
