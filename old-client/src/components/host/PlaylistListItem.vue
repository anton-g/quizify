<template lang="pug">
  .playlist-list--item(:class="{ selected: selected }")
    .columns.is-mobile.is-vcentered.is-gapless
      .column.is-narrow
        img.image.is-32x32(v-show="hasImages", :src="imageUrl")
      .column.playlist-name
        span(:title="playlist.name") {{ playlist.name }}
      .column.is-narrow
        .icon
          i.fa.fa-check(v-show="selected")
</template>

<script>
// TODO vad gör man med för långa spellistenamn?
export default {
  props: {
    playlist: {
      type: Object
    },
    selected: {
      type: Boolean
    }
  },
  computed: {
    hasImages () {
      return this.playlist.images.length > 0
    },
    imageUrl () {
      return this.playlist.images[this.playlist.images.length - 1].url
    }
  }
}
</script>

<style lang="scss" scoped>
  .playlist-list--item {
    cursor: pointer;
    width: 100%;

    img {
      margin: 1px;
      border-radius: 0.3rem;
    }

    .playlist-name {
      margin-left: 0.5rem;
    }

    &.selected {
      img {
        margin: 0;
        width: 36px;
        height: 36px;
      }

      span::after {
        display: block;
        content: attr(title);
        font-weight: bold;
        height: 1px;
        color: transparent;
        overflow: hidden;
        visibility: hidden;
      }
    }
  }
</style>
