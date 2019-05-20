const URLSearchParams = require('@ungap/url-search-params')
const Fetch = require('node-fetch')
const Utils = require('./utils.js')

module.exports = options => async (req, res, next) => {
  const utils = Utils(options, req, res)
  const refreshToken = await utils.refreshToken()
  if (refreshToken) {
    const data = new URLSearchParams()
    data.append('grant_type', 'refresh_token')
    data.append('client_id', options.client.id)
    data.append('client_secret', options.client.secret)
    data.append('refresh_token', refreshToken)
    const tokens = await utils.tokensRequest(data)
    await utils.saveTokens(tokens)
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ token: tokens.access_token }))
  }
  next()
}
