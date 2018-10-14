<template lang="pug">
  .cookie-consent
</template>

<script>
import izitoast from 'izitoast'

export default {
  created () {
    const cookieConsent = localStorage.getItem('cc')
    if (cookieConsent) return

    izitoast.show({
      title: this.$t('title'),
      message: this.$t('text'),
      theme: 'dark',
      close: false,
      drag: false,
      timeout: false,
      position: 'bottomCenter',
      buttons: [
        [`<button>${this.$t('button')}</button>`, (instance, toast) => {
          instance.hide({ transitionOut: 'fadeOutDown' }, toast)
          localStorage.setItem('cc', true)
        }]
      ]
    })
  }
}
</script>

<style>
</style>

<i18n>
{
  "en": {
    "title": "Cookies",
    "text": "This site uses cookies to enable the best possible experience.",
    "button": "Okay!"
  },
  "sv": {
    "title": "Kakor",
    "text": "Denna site använder kakor ('Cookies') för att tillhandahålla en så bra tjänst som möjligt.",
    "button": "Ok!"
  }
}
</i18n>
