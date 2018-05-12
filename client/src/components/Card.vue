<template lang="pug">
  .q-card
    slot
</template>

<style lang="scss" scoped>
@import '~@design';

.q-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba($color: #000000, $alpha: 0.18);
  overflow: hidden;
  padding: $size-2;
}
</style>
