<template lang="pug">
  canvas(
    :width="width",
    :height="height",
    ref="canvas"
  )
</template>

<script>
import confetti from './confetti'

export default {
  props: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    numberOfPieces: {
      type: Number,
      default: 200
    },
    confettiSource: {
      type: Object,
      default: () => {}
    },
    friction: {
      type: Number,
      default: 0.99
    },
    wind: {
      type: Number,
      default: 0
    },
    gravity: {
      type: Number,
      default: 0.1
    },
    colors: {
      type: Array,
      default: () => {
        return [
          '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
          '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
          '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
          '#FF5722', '#795548',
        ]
      }
    },
    opacity: {
      type: Number,
      default: 1.0
    },
    recycle: {
      type: Boolean,
      default: true
    },
    run: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      confetti: undefined
    }
  },
  mounted () {
    this.confetti = confetti(this.$refs.canvas)
      .numberOfPieces(this.numberOfPieces)
      .confettiSource(this.confettiSource)
      .friction(this.friction)
      .wind(this.wind)
      .gravity(this.gravity)
      .colors(this.colors)
      .opacity(this.opacity)
      .recycle(this.recycle)
      .run(this.run)()
  },
  beforeUpdate () {
    this.confetti = confetti(this.$refs.canvas)
      .numberOfPieces(this.numberOfPieces)
      .confettiSource(this.confettiSource)
      .friction(this.friction)
      .wind(this.wind)
      .gravity(this.gravity)
      .colors(this.colors)
      .opacity(this.opacity)
      .recycle(this.recycle)
      .run(this.run)
  }
}
</script>

<style lang="scss" scoped>
canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  pointer-events: none;
}
</style>
