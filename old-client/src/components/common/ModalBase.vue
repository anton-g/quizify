<template lang="pug">
  .modal(v-bind:class="{ 'is-active': this.active }")
    .modal-background(@click="$emit('close')")
      slot(name="background")
    .modal-content
      slot
    .modal-close(v-if="!hideCloseButton", @click="$emit('close')")
</template>

<script>
export default {
  name: 'modalbase',
  props: {
    active: {
      type: Boolean,
      required: true
    },
    hideCloseButton: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
