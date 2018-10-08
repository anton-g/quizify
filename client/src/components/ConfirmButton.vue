<template lang="pug">
  .confirm-button
    button.button.is-danger(@click="confirmedClick") {{ confirmed ? confirmText : text }}
</template>

<script>
export default {
  name: 'ConfirmButton',
  props: ['text', 'confirmText'],
  data () {
    return {
      confirmed: false
    }
  },
  methods: {
    confirmedClick () {
      if (this.confirmed) this.$emit('click')
      this.confirmed = true
    }
  }
}
</script>

<style>

</style>
