const Url = require('url')
const Utils = require('./utils.js')

module.exports = options => async (req, res, next) => {
  const params = Url.parse(req.url, true).query
  if (params.state && !params.error) {
    const utils = Utils(options, req, res)
    if (params.code && await utils.validateState(params.state)) {
      const data = new URLSearchParams()
      data.append('grant_type', options.grant)
      data.append('client_id', options.client.id)
      data.append('client_secret', options.client.secret)
      data.append('code', params.code)
      data.append('redirect_uri', utils.currentUrl())
      const tokens = await utils.tokensRequest(data)
      if (!tokens.error) {
        await utils.validateLogin(params.state, tokens)
      }
    } // TODO Error screen ?
  }
  next()
}

