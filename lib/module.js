/* eslint-disable no-console */
const { join } = require('path')
require('isomorphic-fetch')

const RefreshServerMiddleware = require('./middlewares/refresh.js')

module.exports = async function (moduleOptions) {
  const defaults = {
    endpoints: null,
    router: false,
    grant: 'authorization_code',
    client: {
      id: null,
      secret: null,
      scope: 'email profile'
    },
    logout: {
      redirect: '/'
    },
    cookie: 'auth',
    refresh: '/tokens/refresh',
    cache: null,
    notice: 1000 * 60
  }

  const options = Object.assign(defaults, this.options.yano, moduleOptions)

  if (options.endpoints) {
    const middlewares = {}
    options.endpoints = typeof options.endpoints === 'string' ? await (await fetch(`${options.endpoints}/.well-known/openid-configuration`)).json() : options.endpoints

    if (verifyEndpoints(options)) {
      middlewares.auth = this.addTemplate({ src: join(__dirname, 'middlewares', 'auth.js'), options }).dst

      if (options.router === true) {
        this.options.router = this.options.router || {}
        this.options.router.middleware = this.options.router.middleware || []
        this.options.router.middleware.push('auth')
      }

      this.addPlugin({ src: join(__dirname, 'plugins', 'server.js'), mode: 'server', options })

      this.addPlugin({ src: join(__dirname, 'plugins', 'main.js'), options: {
        store: join(this.options.buildDir, this.addTemplate({ src: join(__dirname, 'store.js'), options }).dst),
        helper: join(this.options.buildDir, this.addTemplate({ src: join(__dirname, 'helper.js'), options }).dst),
        middleware: join(this.options.buildDir, this.addTemplate({ src: join(__dirname, 'middlewares', 'loader.js'), options: { middlewares } }).dst)
      } })

      if (options.refresh) {
        this.addServerMiddleware({ path: options.refresh, handler: RefreshServerMiddleware(options) })
      }
    } else {
      console.warn('[YANO] Wrong oauth2 configuration (Mandatory : authorization_endpoint, token_endpoint, userinfo_endpoint or unsupported grant type)')
    }
  } else {
    console.warn('[YANO] No oauth2 configuration endpoint (Or configuration object)')
  }
}

const verifyEndpoints = options => {
  const { endpoints, grant } = options
  const verify = endpoints.authorization_endpoint && endpoints.token_endpoint && endpoints.userinfo_endpoint
  if (verify && endpoints.grant_types_supported) {
    return endpoints.grant_types_supported.indexOf(grant) !== -1
  }
  return verify
}
