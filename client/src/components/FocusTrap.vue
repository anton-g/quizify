<template lang="pug">
  .trap(ref="element")
    slot
</template>

<script>
import createFocusTrap from 'focus-trap'

export default {
  props: [
    'active'
  ],
  data () {
    return {
      focusTrap: undefined
    }
  },
  mounted () {
    this.focusTrap = createFocusTrap(this.$refs.element)
    if(this.active)
      this.focusTrap.activate()
  },
  updated () {
    if (this.active) {
      this.focusTrap.activate()
    } else {
      this.focusTrap.deactivate()
    }
  },
  beforeDestroy () {
    this.focusTrap.deactivate()
  }
}
</script>
