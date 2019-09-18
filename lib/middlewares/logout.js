const Utils = require('./utils.js')

module.exports = options => {
  return async (req, res, next) => {
    const utils = Utils(options, req, res)
    if (utils.token()) {
      await utils.clear()
      let redirectTo = utils.currentUrl()
      if (options.logout.redirect) {
        redirectTo = `${utils.host()}${options.logout.redirect}`
        if (/^(?:[a-z]+:)?\/\//i.test(options.logout.redirect)) {
          redirectTo = options.logout.redirect
        }
      }
      const { end_session_endpoint } = options.endpoints(req)
      const logoutUrl = end_session_endpoint ? `${end_session_endpoint}?redirect_uri=${encodeURIComponent(redirectTo)}` : redirectTo
      res.writeHead(302, { Location: logoutUrl })
      return res.end()
    }
    next()
  }
}
