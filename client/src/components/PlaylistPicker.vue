<template lang="pug">
  modal(:active="active", @close="close")
    h2.title Featured playlists
    .featured-playlists-wrapper
      .featured-playlists
        image-button(
          v-for="(playlist, idx) in featuredPlaylists"
          :text="playlist.name",
          :subtext="playlist.length + ' tracks'",
          :img="playlist.img",
          :color="featureColor(idx)"
          :height="$mq | mq({ tablet: '120px', desktop: '190px' })"
          :width="$mq | mq({ tablet: '100%', desktop: '190px' })"
          @click="select(playlist)")
      a.more-link.button.is-text See more
    .user-playlists-wrapper
      h2.title Your playlists
      .user-playlists
        ul
          li.user-playlist(v-for="playlist in playlists")
            a(@click="select(playlist)")
              span.name {{ playlist.name }}
              span.info {{ playlist.length }} tracks
      a.more-link.button.is-text See more
</template>

<script>
import Modal from '../components/Modal.vue'
import ImageButton from '../components/ImageButton.vue'

export default {
  components: {
    Modal,
    ImageButton
  },
  props: [
    'featuredPlaylists',
    'playlists',
    'active'
  ],
  methods: {
    select (playlist) {
      this.$emit('select', playlist)
    },
    close () {
      this.$emit('close')
    },
    featureColor (idx) {
      const colors = [
        '#a4b6dd',
        '#d09292',
        '#c094cc',
        '#2d5b6b',
        '#c47a53',
        '#8f4731',
        '#52494c',
        '#7b7d2a'
      ]

      return colors[idx]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@design';

.featured-playlists-wrapper {
  display: flex;
  flex-direction: column;

  .featured-playlists {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));
    column-gap: $size-2;
  }
}

@media screen and (max-width: 900px) {
  .featured-playlists-wrapper {
    .featured-playlists {
      grid-auto-flow: row;
      grid-template-columns: 1fr;
      grid-template-rows: repeat(auto-fit, minmax(30%, 1fr));
      grid-row-gap: $size-2;
    }
  }
}

.user-playlists-wrapper {
  display: flex;
  flex-direction: column;

  .user-playlists {
    .user-playlist {
      border-radius: $size-1;

      a {
        display: flex;
        justify-content: space-between;
        padding: $size-1;

        .name {
          color: black;
        }

        .info {
          color: rgba(0, 0, 0, 0.5);
        }
      }

      &:hover {
        background-color: whitesmoke;
      }
    }
  }
}

.more-link {
  margin: $size-2 0 0 auto;
}
</style>