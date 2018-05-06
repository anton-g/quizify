<template lang="pug">
  .hello
    h1 {{ msg }}
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
};
</script>

<style lang="scss">
</style>
