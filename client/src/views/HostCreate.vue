<template lang="pug">
  card.create
    h2.title Create quiz
    .field
      .control
        button.button.is-dark.is-fullwidth Select playlist
    .field.is-grouped
      .control
        button.button.is-danger.is-outlined(@click="cancel") Cancel
      .control
        button.button.is-dark.is-fullwidth Create
    modal(:active="showModal", @close="showModal = false")
      h2.title Featured playlists
      .featured-playlists
        a.featured-playlist(:style="{ background: '#a4b6dd' }")
          img(src="https://mosaic.scdn.co/640/11b1054a8d4b86106085ec30073e50e6f584639e6be8b8cd5690385c28304aafc58ace5ce6dbdc977c6ab0bd116e14ecdd58299a1d103df4e195ac2d93e156ad7762357bea213e53cf346e5f8fe3efae")
          span.name Alla ska med
          span.info 23 tracks
        a.featured-playlist(:style="{ background: '#d09292' }")
          img(src="https://i.scdn.co/image/8cb5ccc8a642e06a69dbdb2f0c47d597057cb3b1")
          span.name Dansband gör covers
          span.info 54 tracks
        a.featured-playlist(:style="{ background: '#c094cc' }")
          img(src="https://mosaic.scdn.co/640/2993cba1f3c5e99613b7c5d1cc7df07e7d71cb8679970c9df607f89a5895e9b1aac1f4d1b5281d197c99322cf4f696082b86d92a5e4ab93e6cc49bfafa75bec32c71f5f4339c41b6ca816f4dd4cac111")
          span.name Generationsquiz
          span.info 301 tracks
      h2.title Your playlists
</template>

<script>
import Card from '../components/Card.vue'
import Modal from '../components/Modal.vue'

export default {
  components: {
    Card,
    Modal
  },
  data () {
    return {
      showModal: true
    }
  },
  methods: {
    cancel () {
      // TODO
      console.log('cancel creation')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@design';

.featured-playlists {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));
  column-gap: $size-2;

  .featured-playlist {
    height: 190px;
    width: 190px;
    border-radius: $size-2;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: relative;
    color: white;
    overflow: hidden;

    img {
      position: absolute;
      top: 0;
      width: 190px;
      height: 190px;
      z-index: 1;
      mix-blend-mode: multiply;
      filter: grayscale(100%);
    }

    .name {
      padding-left: $size-1;
      font-weight: bold;
      z-index: 2;
    }

    .info {
      padding-left: $size-1;
      margin-bottom: $size-1;
      z-index: 2;
    }
  }
}
</style>
