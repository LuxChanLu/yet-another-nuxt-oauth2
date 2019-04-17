import 'isomorphic-fetch'
import isHTTPS from 'is-https'
import JWT from 'jsonwebtoken'
import CookieUniversal from 'cookie-universal'

export default ({ store, req, res, redirect, app }) => ({
  async init(token) {
    const cookies = CookieUniversal(req, res)
    const cookie = cookies.get('<%= options.cookie %>')
    const actual = token || cookie
    if (actual) {
      await store.dispatch('yano/setToken', actual)
      if (!cookie) {
        cookies.set('<%= options.cookie %>', store.state.yano.token, { expires: new Date(this.tokenExpiryAt()) })
      }
    <% if (options.notice) { %>
      if (process.client && !this.isTokenExpired()) {
        const notice = async () => {
          this.tokenExpiration = undefined
          return store.dispatch('yano/notice')
        }
        if (!this.isTokenExpireSoon()) {
          if (this.tokenExpiration) {
            clearTimeout(this.tokenExpiration)
          }
          this.tokenExpiration = setTimeout(notice, this.tokenExpiryAt() - (new Date()).getTime() - <%= options.notice %>)
        } else {
          notice()
        }
      }
    <% } %>
    }
    return this
  },
  accessToken() {
    if (store.state.yano.token) {
      try {
        return JWT.decode(store.state.yano.token)
        // eslint-disable-next-line no-empty
      } catch (error) { }
    }
  },
  tokenExpiryAt() {
    const token = this.accessToken()
    if (token) {
      return token.exp * 1000
    }
  },
  isTokenExpired(inMinutes = 0) {
    const expiryAt = this.tokenExpiryAt()
    if (expiryAt) {
      return expiryAt <= ((new Date()).getTime() - (inMinutes * 60 * 1000))
    }
    return true
  },
<% if (options.notice) { %>
  isTokenExpireSoon() {
    return this.isTokenExpired() || (this.tokenExpiryAt() - (new Date()).getTime() - <%= options.notice %>) <= 0
  },
<% } %>
<% if (options.refresh) { %>
  async refreshToken() {
    try {
      await this.init((await (await fetch('<%= options.refresh %>')).json()).token)
    } catch (error) {
      this.logout()
    }
  },
<% } %>
  logout() {
    if (this.accessToken()) {
      const host = process.server ? `http${isHTTPS(app.context.req) ? 's' : ''}://${app.context.req.headers.host}` : window.location.protocol + '//' + window.location.host
      const url = /^(?:[a-z]+:)?/i.test('<%= options.logout %>') ? '<%= options.logout %>' : `${host}<%= options.logout %>`
      this.clearToken()
    <% if (options.endpoints.end_session_endpoint) { %>
      return redirect(`<%= options.endpoints.end_session_endpoint %>?redirect_uri=${encodeURIComponent(url)}`)
    <% } else { %>
      return redirect(url)
    <% } %>
      }
  },
  clearToken() {
    return store.dispatch('yano/clearToken')
  }
})
