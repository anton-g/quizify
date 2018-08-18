<template lang="pug">
  .locale-switcher
    .field
      .control.has-icons-left
        .select
          select(@change="updateLang", v-model="selectedLocale")
            option(v-for="(lang, i) in langs", :key="`Lang${i}`", :value="lang.locale") {{ lang.name }}
        .icon.is-left
          FontAwesomeIcon(:icon="icon")
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { faGlobe } from '@fortawesome/fontawesome-free-solid'

export default {
  data () {
    return {
      selectedLocale: 'en',
      langs: [{
        name: 'English',
        locale: 'en'
      }, {
        name: 'Svenska',
        locale: 'sv'
      }]
    }
  },
  computed: {
    icon () {
      return faGlobe
    }
  },
  methods: {
    updateLang () {
      this.$store.dispatch('changeLocale', this.selectedLocale)
    }
  },
  created () {
    this.selectedLocale = this.$store.state.common.currentLocale
  },
  components: {
    FontAwesomeIcon
  }
}
</script>

<style lang="scss">
</style>
