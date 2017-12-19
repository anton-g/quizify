<template lang="pug">
  .img-play-button(@click="toggle")
    .play-button
      i.fa(:class="{ 'fa-play-circle': !playing, 'fa-pause-circle': playing }")
    img(:src="url")
</template>

<script>
export default {
  name: 'imageplaybutton',
  props: {
    url: {
      type: String,
      required: true
    },
    playing: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    toggle () {
      this.$emit('toggle')
    }
  }
}
</script>

<style lang="scss">
.img-play-button {
  cursor: pointer;
  width: 300px;
  height: 300px;
  margin: 0 auto 0;

  .play-button {
    font-size: 8em;
    line-height: 0;
    z-index: 1;
    opacity: 0.8;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  img {
    filter: brightness(85%);
    border-radius: 0.4rem;
  }
}
</style>
