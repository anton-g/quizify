import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

let lang = ((navigator.languages && navigator.languages.length
  ? navigator.languages[0]
  : navigator.userLanguage) || navigator.language).split('-')[0]

export default new VueI18n({
  locale: lang,
  fallbackLocale: 'en',
  messages: {
    'en': {
      'questions': {
        'artist': 'What\'s the name of the artist?',
        'song': 'What\'s the name of the song?'
      }
    },
    'sv': {
      'questions': {
        'artist': 'Vad heter artisten?',
        'song': 'Vad heter låten?'
      }
    }
  }
})
