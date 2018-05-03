<template lang="pug">
  button.media-control(@click="toggle", :class="{ paused: isPlaying }")
</template>

<script>
export default {
  name: 'playpausebutton',
  props: {
    playing: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    toggle () {
      this.$emit('press')
    }
  },
  computed: {
    isPlaying () {
      return this.playing
    }
  }
}
</script>

<style lang="scss">
@import "~bulma/sass/utilities/initial-variables";

.media-control {
  border: 0;
  background: transparent;
  box-sizing: border-box;
  width: 0;
  height: 74px;
  padding: 0;
  border-radius: 0;
  outline: none;

  border-color: transparent transparent transparent $grey-darker;
  transition: 125ms all ease;
  cursor: pointer;

  // play state
  border-style: solid;
  border-width: 37px 0 37px 60px;

  &.paused {
    border-style: double;
    border-width: 0px 0 0px 60px;
  }

  &:hover {
    border-color: transparent transparent transparent $grey-dark;
  }
}
</style>
