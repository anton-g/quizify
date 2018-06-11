<template lang="pug">
  card.create
    h2.title Create quiz
    .field
      .control
        button.button.is-dark.is-fullwidth(@click="showPlaylistSelection = true") {{ selectedPlaylist ? selectedPlaylist.name : 'Select playlist' }}
    .field.is-grouped
      .control
        button.button.is-danger.is-outlined(@click="cancel") Cancel
      .control
        button.button.is-dark.is-fullwidth Create
    modal(:active="showPlaylistSelection", @close="showPlaylistSelection = false")
      h2.title Featured playlists
      .featured-playlists-wrapper
        .featured-playlists
          a.featured-playlist(
            v-for="(playlist, idx) in featuredPlaylists",
            :style="{ background: featureColor(idx) }",
            @click="select(playlist)"
          )
            img(:src="playlist.img")
            span.name {{ playlist.name }}
            span.info {{ playlist.length }} tracks
        a.more-link.button.is-text See more
      .user-playlists-wrapper
        h2.title Your playlists
        .user-playlists
          ul
            li.user-playlist(v-for="playlist in userPlaylists")
              a(@click="select(playlist)")
                span.name {{ playlist.name }}
                span.info {{ playlist.length }} tracks
        a.more-link.button.is-text See more
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
      showPlaylistSelection: false
    }
  },
  computed: {
    featuredPlaylists () {
      return [
        {
          name: 'Alla ska med',
          length: 23,
          img: 'https://mosaic.scdn.co/640/11b1054a8d4b86106085ec30073e50e6f584639e6be8b8cd5690385c28304aafc58ace5ce6dbdc977c6ab0bd116e14ecdd58299a1d103df4e195ac2d93e156ad7762357bea213e53cf346e5f8fe3efae'
        },
        {
          name: 'Dansband gör covers',
          length: 54,
          img: 'https://i.scdn.co/image/8cb5ccc8a642e06a69dbdb2f0c47d597057cb3b1'
        },
        {
          name: 'Generationsquiz',
          length: 301,
          img: 'https://mosaic.scdn.co/640/2993cba1f3c5e99613b7c5d1cc7df07e7d71cb8679970c9df607f89a5895e9b1aac1f4d1b5281d197c99322cf4f696082b86d92a5e4ab93e6cc49bfafa75bec32c71f5f4339c41b6ca816f4dd4cac111'
        }
      ].slice(0, 3)
    },
    userPlaylists () {
      return [
        {
          name: 'Julquiz',
          length: 10
        },
        {
          name: 'Amanda 25',
          length: 18
        },
        {
          name: 'Lajvet',
          length: 22
        },
        {
          name: 'Always bushes of seagulls',
          length: 10
        },
        {
          name: 'Sümmer',
          length: 199
        },
        {
          name: 'Och vi ska också glömmas bort',
          length: 98
        }
      ]
    },
    selectedPlaylist () {
      return this.$store.state.host.playlist
    }
  },
  methods: {
    cancel () {
      // TODO
      console.log('cancel creation')
    },
    select (playlist) {
      console.log('selected playlist', playlist)
      this.showPlaylistSelection = false
      this.$store.dispatch('selectPlaylist', playlist)
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

    .featured-playlist {
      height: 190px;
      width: 190px;
      border-radius: $size-2;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.18);

      transition: box-shadow 0.3s, transform 0.3s;

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
        text-shadow: 1px 1px rgba(0,0,0,0.15);
      }

      .info {
        padding-left: $size-1;
        margin-bottom: $size-1;
        z-index: 2;
        text-shadow: 1px 1px rgba(0,0,0,0.15);
      }

      &:hover {
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.24);
        transform: translate(0px, -4px);
      }
    }
  }
}

@media screen and (max-width: 900px) {
  .featured-playlists-wrapper {
    .featured-playlists {
      grid-auto-flow: row;
      grid-template-columns: 1fr;
      grid-template-rows: repeat(auto-fit, minmax(30%, 1fr));
      grid-row-gap: $size-2;

      .featured-playlist {
        width: 100%;
        height: 120px;

        img {
          width: 100%;
          height: unset;

          top: -50%;
        }
      }
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
