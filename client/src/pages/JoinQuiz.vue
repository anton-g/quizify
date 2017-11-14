<template lang="pug">
  .join-quiz
</template>

<script>
export default {
  created () {
    const key = this.$route.params.id
    if (!this.$store.state.quizKey) {
      this.$store.dispatch('verifyRoomKey', key)
      .catch(error => {
        console.log(error)
        this.$router.push({ name: 'landing' })
      })
    }

    console.log(key)
  }
}
</script>

<style lang="scss">

</style>
