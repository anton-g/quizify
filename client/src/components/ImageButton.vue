<template lang="pug">
  a.image-button(
    @click="$emit('click')",
    :style="style"
  )
    img(:src="img")
    span.text {{ text }}
    span.subtext(v-if="subtext") {{ subtext }}
</template>

<script>
export default {
  props: {
    img: String,
    text: String,
    subtext: String,
    color: String,
    width: String,
    height: String
  },
  computed: {
    style () {
      return {
        background: this.color,
        height: (this.height ? this.height : '190px'),
        width: (this.width ? this.width : '190px')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@design";

.image-button {
  border-radius: $size-2;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.18);

  transition: box-shadow 0.3s, transform 0.3s;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  color: white;
  overflow: hidden;

  padding-bottom: $size-1;

  img {
    position: absolute;
    top: 0;
    width: 190px;
    height: 190px;
    z-index: 1;
    mix-blend-mode: multiply;
    filter: grayscale(100%);
  }

  .text {
    padding-left: $size-1;
    font-weight: bold;
    z-index: 2;
    text-shadow: 1px 1px rgba(0,0,0,0.15);
  }

  .subtext {
    padding-left: $size-1;
    z-index: 2;
    text-shadow: 1px 1px rgba(0,0,0,0.15);
  }

  &:hover {
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.24);
    transform: translate(0px, -4px);
  }
}

@media screen and (max-width: 900px) {
  .image-button {
    img {
      width: 100%;
      height: unset;

      top: -50%;
    }
  }
}
</style>
