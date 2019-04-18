const Keyv = require('keyv')
const URLSearchParams = require('@ungap/url-search-params')
const CookieUniversal = require('cookie-universal')

module.exports = options => {
  return async (req, res, next) => {
    const keyv = new Keyv(options.cache, { namespace: 'yano' })
    const cookies = CookieUniversal(req, res)
    const oldAccessToken = cookies.get(options.cookie)
    if (oldAccessToken) {
      const refreshToken = await keyv.get(oldAccessToken)
      if (refreshToken) {
        await keyv.delete(oldAccessToken)
        const data = new URLSearchParams()
        data.append('grant_type', 'refresh_token')
        data.append('client_id', options.client.id)
        data.append('client_secret', options.client.secret)
        data.append('refresh_token', refreshToken)
        const tokens = await (await fetch(options.endpoints.token_endpoint, {
          method: 'POST',
          body: data,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          }
        })).json()
        await keyv.set(tokens.access_token, tokens.refresh_token, parseInt(tokens.expires_in) * 1000)
        cookies.set(options.cookie, tokens.access_token)
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ token: tokens.access_token }))
        return
      }
    }
    next()
  }
}
