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
    }
  }
}
