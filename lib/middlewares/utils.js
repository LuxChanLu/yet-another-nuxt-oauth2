const isHTTPS = require('is-https')
const Keyv = require('keyv')
const CookieUniversal = require('cookie-universal')
const JWT = require('jsonwebtoken')
const Fetch = require('node-fetch')

module.exports = (options, req, res) => {
  const caches = {
    request: new Keyv(options.cache, { namespace: 'yano:request' }),
    refresh: options.routes.refresh ? new Keyv(options.cache, { namespace: 'yano:refresh' }) : null
  }
  const cookies = CookieUniversal(req, res)
  const getTokenFromCookie = () => (cookies.get(options.cookie) || cookies.get(options.cookie, { fromRes: true }))

  return {
    host() {
      return `http${isHTTPS(req) ? 's' : ''}://${req.headers.host}`
    },
    currentUrl() {
      return `${this.host()}${req.url}`
    },
    token() {
      const token = getTokenFromCookie()
      if (token && token.length > 0) {
        const decoded = JWT.decode(token)
        return decoded.exp >= Math.floor(Date.now() / 1000) ? { ...decoded, token } : null
      }
    },
    async login(state, nonce, redirect) {
      await this.clear()
      await caches.request.set(state, { nonce, redirect }, options.login.expiry)
    },
    async validateState(state) {
      return caches.request.get(state)
    },
    async validateLogin(state, tokens) {
      const access = JWT.decode(tokens.access_token)
      if (!access.nonce || access.nonce === (await caches.request.get(state)).nonce) {
        await caches.request.delete(state)
        return this.saveTokens(tokens)
      }
    },
    async saveTokens({ access_token, refresh_token, expires_in = 60 * 5 }) {
      if (refresh_token && caches.refresh) {
        await caches.refresh.set(access_token, refresh_token, expires_in * 1000)
      }
      cookies.set(options.cookie, access_token)
    },
    async refreshToken() {
      const token = getTokenFromCookie()
      if (caches.refresh && token) {
        const refreshToken = await caches.refresh.get(token)
        if (refreshToken) {
          await caches.refresh.delete(token)
          return refreshToken
        }
      }
    },
    async clear() {
      const token = getTokenFromCookie()
      if (caches.refresh && token) {
        await caches.refresh.delete(token)
      }
      cookies.remove(options.cookie)
    },
    async tokensRequest(body) {
      return (await Fetch(options.endpoints(req).token_endpoint, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      })).json()
    }
  }
}
