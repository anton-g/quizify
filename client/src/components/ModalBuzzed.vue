<template lang="pug">
  modal-base(:active="active", :hideCloseButton="true")
    .wrapper.animated.fadeInDown
      .box
        h1.title.has-text-centered {{ user.name }} buzzed!
        .columns.is-mobile
          .column
            button.button.is-large.is-danger.is-fullwidth(@click="incorrect") Incorrect
          .column
            button.button.is-large.is-success.is-fullwidth.is-pulled-right(@click="correct") Correct
        div.has-text-centered
          button.button.is-outlined.is-dark.is-small(@click="resume") Resume
</template>

<script>
import ModalBase from '@/components/ModalBase'

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
