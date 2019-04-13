const { resolve } = require('path')
const { Nuxt, Builder } = require('nuxt')

module.exports = {
  async buildNuxt(config, rootDir = resolve(__dirname, 'test')) {
    return new Builder(new Nuxt({
      dev: true,
      rootDir,
      modules: [resolve(__dirname, '..', 'lib', 'module.js')],
      ...config
    })).build()
  }
}
