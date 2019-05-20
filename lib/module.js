/* eslint-disable no-console */
const { resolve } = require('path')
const Fetch = require('node-fetch')
const DeepAssign = require('lodash.merge')
const LoginServerMiddleware = require('./middlewares/login.js')
const AuthServerMiddleware = require('./middlewares/auth.js')
const LogoutServerMiddleware = require('./middlewares/logout.js')
const RefreshServerMiddleware = require('./middlewares/refresh.js')

const defaults = {
  endpoints: null,
  router: false,
  grant: 'authorization_code',
  client: {
    id: null,
    secret: null,
    scope: 'email profile'
  },
  routes: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    clear: true
  },
  login: {
    expiry: 1000 * 120
  },
  logout: {
    redirect: null
  },
  cookie: 'auth',
  cache: null,
  notice: 1000 * 60
}

module.exports = async function (moduleOptions) {
  const options = DeepAssign(defaults, this.options.yano, moduleOptions)

  if (options.endpoints) {
    options.endpoints = typeof options.endpoints === 'string' ? await (await Fetch(`${options.endpoints}/.well-known/openid-configuration`)).json() : options.endpoints

    if (verifyEndpoints(options)) {
      if (options.router === true) {
        this.options.router = this.options.router || {}
        this.options.router.middleware = this.options.router.middleware || []
        this.options.router.middleware.push('auth')
      }

      const clientOptions = {
        routes: options.routes,
        cookie: options.cookie,
        notice: options.notice
      }
      this.addPlugin({
        src: resolve(__dirname, 'plugin.js'),
        options: {
          ...clientOptions,
          store: resolve(__dirname, 'store.js'),
          helper: resolve(this.options.buildDir, this.addTemplate({ src: resolve(__dirname, 'helper.js'), options: clientOptions }).dst)
        }
      })

      this.addServerMiddleware({ path: options.routes.login, handler: LoginServerMiddleware(options) })
      this.addServerMiddleware(AuthServerMiddleware(options))
      this.addServerMiddleware({ path: options.routes.logout, handler: LogoutServerMiddleware(options) })
      if (options.routes.refresh) {
        this.addServerMiddleware({ path: options.routes.refresh, handler: RefreshServerMiddleware(options) })
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
