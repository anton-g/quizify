<template lang="pug">
  Card.auth
    h2.title Loading..
</template>

<script>
import Card from '@/components/Card.vue'

export default {
  components: {
    Card
  },
  created () {
    const code = this.$route.query.code
    if (!code) {
      // something went wrong
    }

    console.log(code)
    // do something with code
    this.$router.push({ name: 'host-create' })
  }
}
</script>
