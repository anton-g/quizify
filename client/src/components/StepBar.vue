<template lang="pug">
  .step-bar-container
    ul.step-bar
      li(:class="classesForStep(1)") Login
      li(:class="classesForStep(2)") Songs
      li(:class="classesForStep(3)") Players
</template>

<script>
export default {
  name: 'StepBar',
  props: ['currentStep'],
  methods: {
    classesForStep (step) {
      return {
        'completed': this.currentStep > step,
        'active': this.currentStep === step
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.step-bar-container {
  max-width: 600px;
  width: 100%;
  position: relative;
  z-index: 1;

  .step-bar {
    counter-reset: step;

    li {
      list-style-type: none;
      width: 33%;
      float: left;
      font-size: 12px;
      position: relative;
      text-align: center;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.5);

      &:before {
        width: 30px;
        height: 30px;
        color: rgba(0, 0, 0, 0.5);
        font-weight: bold;
        content: counter(step);
        counter-increment: step;
        line-height: 30px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        display: block;
        text-align: center;
        margin: 0 auto 10px auto;
        border-radius: 50%;
        background-color: #FF9E91;
      }

      &:after {
        width: 100%;
        height: 2px;
        content: '';
        position: absolute;
        background-color: rgba(255, 255, 255, 0.5);
        top: 15px;
        left: -50%;
        z-index: -1;
      }

      &:first-child:after {
        content: none;
      }

      &.completed {
        color: white;

        &:before {
          background-color: white;
          color: black;
          content: '\F00C';
          font-family: FontAwesome;
        }

        + li:after {
          background-color: white;
        }
      }

      &.active {
        color: white;

        &:before {
          color: black;
          background-color: white;
        }
      }
    }
  }
}
</style>
