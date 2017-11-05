import Vue from 'vue'
import LandingPage from '@/pages/LandingPage'

describe('LandingPage.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(LandingPage)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelectorAll('.pin-input').length)
      .to.equal(1)
  })
})
