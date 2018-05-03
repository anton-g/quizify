<template lang="pug">
  h2
    slot
</template>

<script>
export default {
  name: 'HorizontalLineHeading'
}
</script>

<style lang="scss" scoped>
h2 {
  overflow: hidden;
  text-align: center;
  text-transform: uppercase;

  &:before,&:after {
    background-color: white;
    content: "";
    display: inline-block;
    height: 1px;
    position: relative;
    vertical-align: middle;
    width: 50%;
  }

  &:before {
    right: 0.5em;
    margin-left: -50%;
  }

  &:after {
    left: 0.5em;
    margin-right: -50%;
  }
}
</style>
