<template lang="pug">
  card.lobby
    h2.selection-none.title
      | {{ $t('title') }}
      span.key {{ $t('text:key') }}: {{ key }}
    ImageButton(
      :img="selectedPlaylist.img",
      :text="selectedPlaylist.name",
      :subtext="$t('button:playlist')"
      height="70px",
      width="100%",
      color="#237032",
      @click="showPlaylistPicker = true"
    )
    button.button.is-dark.is-fullwidth.start-button(@click="start") {{ $t('button:start') }}
    h3.title.is-4 {{ $t('title:players') }}
    p.subtitle(v-show="players.length < 1") {{ $t('text:no-players') }}
    player-list(:players="players")
    playlist-picker(
      :active="showPlaylistPicker",
      :featuredPlaylists="featuredPlaylists",
      :playlists="userPlaylists"
      @close="showPlaylistPicker = false",
      @select="select")
</template>

<script>
import Card from '../components/Card.vue'
import PlayerList from '../components/PlayerList.vue'
import ImageButton from '../components/ImageButton.vue'
import PlaylistPicker from '../components/PlaylistPicker.vue'

export default {
  components: {
    Card,
    PlayerList,
    ImageButton,
    PlaylistPicker
  },
  data () {
    return {
      showPlaylistPicker: false
    }
  },
  created () {
    if (this.userPlaylists.length < 1) {
      this.$store.dispatch('loadUserPlaylists')
    }
    if (this.featuredPlaylists.length < 1) {
      this.$store.dispatch('loadFeaturedPlaylists')
    }
  },
  computed: {
    featuredPlaylists () {
      return this.$store.state.host.featuredPlaylists.slice(0, 3)
    },
    userPlaylists () {
      return this.$store.state.host.playlists
    },
    selectedPlaylist () {
      return this.$store.state.host.quiz.playlist
    },
    players () {
      return this.$store.state.host.quiz.players
    },
    key () {
      return this.$store.state.host.quiz.key
    }
  },
  methods: {
    select (playlist) {
      this.$store.dispatch('updatePlaylist', playlist)
      this.showPlaylistPicker = false
    },
    start () {
      this.$store.dispatch('start')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@design';

.start-button {
  margin: $size-2 0;
}

.key {
  user-select: text;
  font-family: $font-family-default;
  font-weight: normal;
  background-color: #EEE;
  border-radius: $size-1;
  padding: $size-1;
  font-size: $size-3;
  margin-left: $size-1;
}
</style>

<i18n>
{
  "en": {
    "title": "Lobby",
    "text:key": "Key",
    "button:playlist": "Click to change playlist",
    "button:start": "Start",
    "title:players": "Players",
    "text:no-players": "Give your friends the key and tell them to join!"
  },
  "sv": {
    "title": "Lobby",
    "text:key": "Nyckel",
    "button:playlist": "Klicka för att byta spellista",
    "button:start": "Starta",
    "title:players": "Spelare",
    "text:no-players": "Säg åt dina vänner att gå med genom att använda nyckeln ovan!"
  }
}
</i18n>
