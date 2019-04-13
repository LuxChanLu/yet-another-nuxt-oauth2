import QS from 'qs'
import JWT from 'jsonwebtoken'
import isHTTPS from 'is-https'
import SuperAgent from 'superagent'

const AUTH_TOKEN_NAME = 'apollo-token'
const AUTH_TOKEN_EXPIRES = 7

const superAgentPromise = req => new Promise((resolve, reject) => req.end((err, res) => err ? reject(err) : resolve(res.body)))

export default async (ctx) => {
  const { isHMR, app: { context, $cookies, $apolloHelpers, $env }, store, route, redirect } = ctx
  if (isHMR) return
  const params = process.server ? QS.parse(context.req._parsedUrl.query) : QS.parse(window.location.search)
  const from = process.server ? `http${isHTTPS(context.req) ? 's' : ''}://${context.req.headers.host + context.req._parsedUrl.pathname}` : window.location.protocol + '//' + window.location.host + window.location.pathname
  if (!$apolloHelpers.getToken() && process.server && params.state && params.state) {
    if (params.error) {
      // TODO: Error catch params.error_description
    } else if (params.code) {
      const auth = await superAgentPromise(SuperAgent
        .post('<%= options.token_endpoint %>')
        .type('form')
        .send({
          grant_type: 'authorization_code',
          client_id: $env.AUTH_CLIENT,
          client_secret: process.env.AUTH_SECRET,
          code: params.code,
          redirect_uri: from
        }))
      $cookies.set(AUTH_TOKEN_NAME, auth.access_token, { path: '/', maxAge: 60 * 60 * 24 * AUTH_TOKEN_EXPIRES })
      await $apolloHelpers.onLogin(auth.access_token)
      $apolloHelpers.token = auth.access_token
    }
  } else if ((!$apolloHelpers.getToken() || (new Date()).getTime() >= (JWT.decode($apolloHelpers.getToken()).exp * 1000))) {
    await $apolloHelpers.onLogout()
    $cookies.remove(AUTH_TOKEN_NAME)
    const from = process.server ? `http${isHTTPS(context.req) ? 's' : ''}://${context.req.headers.host + context.req.originalUrl}` : window.location.href
    const oauthRequest = QS.stringify({
      protocol: 'oauth2',
      response_type: 'code',
      response_mode: 'query',
      client_id: $env.AUTH_CLIENT,
      redirect_uri: from,
      scope: 'email profile openid',
      state: Math.random().toString(36).substring(7),
      nonce: Math.random().toString(36).substring(7)
    })
    return redirect(`<%= options.authorization_endpoint %>?${oauthRequest}`)
  } else if ($apolloHelpers.getToken() && route.path === '/logout') {
    await $apolloHelpers.onLogout()
    $cookies.remove(AUTH_TOKEN_NAME)
    return redirect(`<%= options.end_session_endpoint %>?redirect_uri=${encodeURIComponent('https://www.yoursoft.run/?disconnect=true')}`)
  }
  <% if (options.consumer) { %>
    await store.dispatch('consumer/init', ctx)
  <% } %>
}
