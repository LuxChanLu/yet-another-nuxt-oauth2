const { resolve } = require('path')
const { OAuth2Server } = require('oauth2-mock-server')

const oauth2server = new OAuth2Server()

module.exports = {
  server: {
    port: 3000
  },
  yano: {
    endpoints: 'http://localhost:3001',
    router: false,
    grant: 'authorization_code',
    client: {
      id: 'id',
      secret: 'test',
      scope: 'email profile openid'
    },
    routes: {
      login: '/auth/login',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      clear: true
    },
    cache: 'redis://localhost/9',
    logout: {
      redirect: '/logout'
    },
    notice: 2000
  },
  modules: [resolve(__dirname, '..', '..', '..', 'lib', 'module.js')],
  hooks: {
    modules: {
      async before() {
        await oauth2server.issuer.keys.generateRSA()
        await oauth2server.start(3001, 'localhost')
      }
    },
    async close() {
      return oauth2server.stop()
    }
  }
}
