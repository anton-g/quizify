<template lang="pug">
  modal-base(:active="active", :hideCloseButton="true")
    .wrapper.animated.fadeInDown
      .box
        h1.title.has-text-centered {{ $t('buzzed', { name: user.name }) }}
        .columns.is-mobile
          .column
            button.button.is-large.is-danger.is-fullwidth(@click="incorrect") {{ $t('incorrect-button') }}
          .column
            button.button.is-large.is-success.is-fullwidth.is-pulled-right(@click="correct") {{ $t('correct-button') }}
        div.has-text-centered
          button.button.is-outlined.is-dark.is-small(@click="resume") {{ $t('resume-button') }}
</template>

<script>
import ModalBase from '@/components/common/ModalBase'

export default {
  name: 'modalbuzzed',
  props: {
    active: {
      type: Boolean,
      required: true
    },
    user: {
      type: Object,
      default: () => {
        return {
          name: ''
        }
      }
    }
  },
  components: {
    ModalBase
  },
  methods: {
    correct () {
      this.$emit('correct')
    },
    incorrect () {
      this.$emit('incorrect')
    },
    resume () {
      this.$emit('resume')
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  .title {
    color: black;
    text-shadow: none;
  }
}
</style>

<i18n>
{
  "en": {
    "buzzed": "{name} buzzed!",
    "incorrect-button": "Incorrect",
    "correct-button": "Correct",
    "resume-button": "Resume"
  },
  "sv": {
    "buzzed": "{name} buzzade!",
    "incorrect-button": "Fel svar",
    "correct-button": "Rätt svar",
    "resume-button": "Återgå"
  }
}
</i18n>
