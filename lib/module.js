const { join } = require('path')
const fetch = require('node-fetch')

module.exports = async function (moduleOptions) {
  const defaults = {
    endpoints: null,
    middleware: false
  }

  const options = Object.assign(defaults, this.options.yano, moduleOptions)
  const middlewares = {}

  if (options.endpoints) {
    const endpoints = typeof options.endpoints === 'string' ? await fetch(options.endpoints) : options.endpoints
    console.log(endpoints)
  } else {
    console.warn('[YANO] No oauth2 configuration endpoint (Or configuration object)')
  }

  // if (options.auth) {
  //   this.options.router = this.options.router || {}
  //   this.options.router.middleware = this.options.router.middleware || []
  //   middlewares.auth = this.addTemplate({ src: join(__dirname, 'middlewares', 'auth.js'), options: { ...options, ...await authInfo() } }).dst
  //   this.options.router.middleware.push('auth')
  // }

  const middleware = join(this.options.buildDir, this.addTemplate({ src: join(__dirname, 'middleware.js'), options: { middlewares } }).dst)

  this.addPlugin({ src: join(__dirname, 'plugins', 'middlewares.js'), options: { ...options, middleware } })
}
