const Crypto = require('crypto')
const UUID = require('uuid/v4')
const Url = require('url')
const QS = require('qs')
const Utils = require('./utils.js')

module.exports = options => async (req, res, next) => {
  const params = Url.parse(req.url, true).query
  if (params.to) {
    const utils = Utils(options, req, res)
    const request = {
      protocol: 'oauth2',
      response_type: 'code', // TODO : From grant type : options.grant
      response_mode: 'query',
      client_id: options.client.id,
      redirect_uri: `${utils.host()}${params.to}`,
      scope: options.client.scope,
      nonce: Crypto.randomBytes(16).toString('hex').toLowerCase(),
      state: UUID()
    }
    await utils.login(request.state, request.nonce, request.redirect_uri)
    res.writeHead(302, { Location: `${options.endpoints(req).authorization_endpoint}?${QS.stringify(request)}` })
    return res.end()
  }
  return next()
}
