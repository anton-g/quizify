import Vue from 'vue'

if (process.env.NODE_ENV !== 'production') {
  import(/* webpackChunkName: "dev" */ 'vue-axe').then(({ default: VueAxe }) => {
    Vue.use(VueAxe, {
      config: {
        rules: []
      }
    })
  })
}
