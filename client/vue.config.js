const path = require('path')

function resolveSrc (_path) {
  return path.join(__dirname, _path)
}

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@design': resolveSrc('src/design/index.scss')
      }
    },
    module: {
      rules: [
        { resourceQuery: /blocktype=i18n/, loader: '@kazupon/vue-i18n-loader' }
      ]
    }
  },
  pluginOptions: {
    i18n: {
      fallbackLocale: 'en',
      enableInSFC: true
    }
  }
}
