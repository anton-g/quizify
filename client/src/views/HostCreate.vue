<template lang="pug">
  card.create
    h2.title {{ $t('title') }}
    p.intro {{ $t('text:intro') }}
    .field
      .control
        button.button.is-dark.is-fullwidth(@click="showPlaylistSelection = true") {{ selectedPlaylist ? selectedPlaylist.name : $t('button:playlist') }}
    label.is-sr-only(for="select-device") {{ $t('select:device:sr') }}
    .field.has-addons
      .control.is-expanded
        .select.is-fullwidth
          select(v-model="selectedDevice", id="select-device", required)
            option(value="", disabled, selected) {{ $t('select:device') }}
            option(v-for="device in devices", :key="device.id", :value="device") {{ device.name }}
      .control
        button.button(@click="refreshDevices", aria-label="Refresh device list")
          FontAwesomeIcon(
            :icon="loadDevicesIcon",
            :class="{ 'fa-spin': isLoadingDevices }")
    .field.is-grouped
      .control
        button.button.is-danger.is-outlined(@click="cancel") {{ $t('button:cancel') }}
      .control
        button.button.is-dark.is-fullwidth(@click="create") {{ $t('button:create') }}
    .field
      accordion(title="Experimental settings")
        small These settings are very experimental and not guaranteed to work in any way.
    playlist-picker(
      :active="showPlaylistSelection",
      :featuredPlaylists="featuredPlaylists",
      :playlists="userPlaylists"
      @close="showPlaylistSelection = false",
      @select="select")
</template>

<script>
import Card from '../components/Card.vue'
import PlaylistPicker from '../components/PlaylistPicker.vue'
import Accordion from '../components/Accordion.vue'
import { reconnectOnCreation } from '../mixins/reconnect.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'

export default {
  mixins: [reconnectOnCreation],
  components: {
    Card,
    PlaylistPicker,
    Accordion,
    FontAwesomeIcon
  },
  data () {
    return {
      showPlaylistSelection: false,
      selectedPlaylist: undefined,
      selectedDevice: undefined,
      isLoadingDevices: false
    }
  },
  created () {
    const jwt = this.getJwt()
    if (jwt) {
      this.$store.dispatch('loadFeaturedPlaylists')
      this.$store.dispatch('loadUserPlaylists')
      this.$store.dispatch('loadUserDevices')
    } else {
      this.$router.push({ name: 'home' })
    }
  },
  computed: {
    featuredPlaylists () {
      return this.$store.state.host.featuredPlaylists.slice(0, 3)
    },
    userPlaylists () {
      return this.$store.state.host.playlists
    },
    devices () {
      return this.$store.state.host.devices
    },
    loadDevicesIcon () {
      return faSyncAlt
    }
  },
  methods: {
    getJwt () {
      if (this.$store.state.host.jwt) return this.$store.state.host.jwt

      const [key, jwt] = this.$route.hash.slice(1).split('=')
      if (key === 'jwt') {
        this.$store.dispatch('successfulLogin', jwt)
        this.$router.replace({ name: 'host-create' })
        return this.$store.state.host.jwt
      }

      return undefined
    },
    select (playlist) {
      this.selectedPlaylist = playlist
      this.showPlaylistSelection = false
    },
    cancel () {
      this.$router.push({ name: 'home' })
    },
    create () {
      if (this.selectedPlaylist && this.selectedDevice) {
        const options = {
          playlist: this.selectedPlaylist,
          device: this.selectedDevice
        }
        this.$store.dispatch('create', options)
      }
    },
    async refreshDevices () {
      this.isLoadingDevices = true
      await this.$store.dispatch('loadUserDevices')
      setTimeout(() => {
        // Spin for atleast 500 ms
        this.isLoadingDevices = false
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@design';

.create {
  .title {
    margin-bottom: $size-1;
  }
}

.intro {
  margin-bottom: $size-1;
}
</style>

<i18n>
{
  "en": {
    "title": "Create Quiz",
    "text:intro": "Select which playlist and Spotify connected device you'd like to use in the quiz.",
    "button:playlist": "Select playlist",
    "select:device": "Select device",
    "select:device:sr": "Select device",
    "button:cancel": "Cancel",
    "button:create": "Create"
  },
  "sv": {
    "title": "Skapa Quiz",
    "text:intro": "Välj vilken spellista och enhet du vill använda i quizet.",
    "button:playlist": "Välj spellista",
    "select:device": "Välj enhet",
    "select:device:sr": "Välj enhet",
    "button:cancel": "Avbryt",
    "button:create": "Skapa"
  }
}
</i18n>
