<template lang="pug">
  #app
    .container
      router-view
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="sass" src="bulma"></style>
<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Pacifico');

html, body, #app {
  width: 100%;
  height: 100%;
}

h1,h2,h3,h4,h5,p,span {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.20);
}

#app {
  background: linear-gradient(to right, #ee0979, #ff6a00); //linear-gradient(to right, #f2994a, #f2c94c);
  display: flex;
}
</style>
