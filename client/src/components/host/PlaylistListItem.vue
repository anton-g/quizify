<template lang="pug">
  .playlist-list--item(:class="{ selected: selected }")
    .image-container
      img.image.is-32x32(v-show="hasImages", :src="imageUrl")
    span {{ playlist.name }}
    .icon(v-show="selected")
      i.fa.fa-check
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
    display: flex;
    justify-content: left;
    align-items: center;
    cursor: pointer;

    .image-container {
      width: 36px;
      height: 36px;

      img {
        margin: 1px;
        border-radius: 0.3rem;
      }
    }

    span {
      padding-left: 0.3rem;
    }

    &.selected {
      img {
        margin: 0;
        width: 36px;
        height: 36px;
      }

      span {
        font-weight: bold;
      }

      .icon {
        margin-left: auto;
      }
    }
  }
</style>
