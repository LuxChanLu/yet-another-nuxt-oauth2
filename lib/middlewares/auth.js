import QS from 'qs'
import isHTTPS from 'is-https'
import URLSearchParams from 'url-search-params'

/*
** =================================================================
** Redirect user to auth server if not logged or token expired
** =================================================================
*/
const RedirectIfNotLogged = (ctx, currentUrl) => {
  if (!ctx.app.$yano.accessToken() || ctx.app.$yano.isTokenExpired()) {
    ctx.app.$yano.clearToken()
    const request = QS.stringify({
      protocol: 'oauth2',
      response_type: 'code', // TODO : From grant type : options.grant
      response_mode: 'query',
      client_id: '<%= options.client.id %>',
      redirect_uri: currentUrl,
      scope: '<%= options.client.scope %>',
      state: Math.random().toString(36).substring(7), // Find a way to use...
      nonce: Math.random().toString(36).substring(7) // Find a way to use...
    })
    return ctx.redirect(`<%= options.endpoints.authorization_endpoint %>?${request}`)
  }
}

/*
** =================================================================
** Return from the auth server with login result
** =================================================================
*/
const LoginUser = async (ctx, currentUrl, params) => {
  if (!ctx.app.$yano.accessToken() && process.server && params.state) {
    if (params.error) {
      return ctx.error(params.error)
    } else if (params.code) {
      const data = new URLSearchParams()
      data.append('grant_type', '<%= options.grant %>')
      data.append('client_id', '<%= options.client.id %>')
      data.append('client_secret', ctx.app.$yano.client.secret)
      data.append('code', params.code)
      data.append('redirect_uri', currentUrl)
      const tokens = await (await fetch('<%= options.endpoints.token_endpoint %>', {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      })).json()
      if (tokens.error) {
        return ctx.error(tokens.error)
      }
      await ctx.app.$yano.init(tokens.access_token)
      <% if (options.refresh) { %>
        if (process.server && tokens.refresh_token) {
          await ctx.app.$yano.keyv.set(tokens.access_token, tokens.refresh_token, parseInt(tokens.expires_in) * 1000)
        }
      <% } %>
      return true
    }
  }
}

export default async ctx => {
  const { context } = ctx.app
  if (ctx.isHMR || !ctx.app.$yano) {
    return
  }
  const currentUrl = process.server ? `http${isHTTPS(context.req) ? 's' : ''}://${context.req.headers.host + context.req._parsedUrl.pathname}` : window.location.protocol + '//' + window.location.host + window.location.pathname
  const params = process.server ? QS.parse(context.req._parsedUrl.query) : QS.parse(window.location.search)
  return (await LoginUser(ctx, currentUrl, params)) ||
         RedirectIfNotLogged(ctx, currentUrl, params)
}
