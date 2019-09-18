/* eslint-disable no-console */
const { resolve } = require('path')
const Fetch = require('node-fetch')
const DeepAssign = require('assign-deep')
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
    const endpoints = typeof options.endpoints === 'string' ? await (await Fetch(`${options.endpoints}/.well-known/openid-configuration`)).json() : options.endpoints
    options.endpoints = typeof endpoints !== 'function' ? () => endpoints : endpoints

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
        store: resolve(__dirname, 'store.js').replace(/\\/g, '\\\\'),
        helper: resolve(this.options.buildDir, this.addTemplate({ src: resolve(__dirname, 'helper.js'), options: clientOptions }).dst).replace(/\\/g, '\\\\')
      }
    })

    this.addServerMiddleware({ path: options.routes.login, handler: LoginServerMiddleware(options) })
    this.addServerMiddleware(AuthServerMiddleware(options))
    this.addServerMiddleware({ path: options.routes.logout, handler: LogoutServerMiddleware(options) })
    if (options.routes.refresh) {
      this.addServerMiddleware({ path: options.routes.refresh, handler: RefreshServerMiddleware(options) })
    }
  } else {
    console.warn('[YANO] No oauth2 configuration endpoint (Or configuration object)')
  }
}

