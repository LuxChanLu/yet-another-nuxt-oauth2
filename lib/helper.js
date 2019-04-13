import JWT from 'jsonwebtoken'

export default ({ store, redirect }) => ({
  accessToken() {
    if (store.state.yano.tokens.access) {
      try {
        return JWT.decode(store.state.yano.tokens.access)
      } catch (error) { }
    }
  },
  accessTokenExpiryAt() {
    const token = this.accessToken()
    if (token) {
      return token.exp * 1000
    }
  },
  isAccessTokenExpired(inMinutes = 0) {
    const expiryAt = this.accessTokenExpiryAt()
    if (expiryAt) {
      return expiryAt >= ((new Date()).getTime() - (inMinutes * 60 * 1000))
    }
    return true
  },
  logout() {
    if (this.accessToken()) {
      return redirect(`<%= options.end_session_endpoint %>?redirect_uri=${encodeURIComponent('<%= options.logout.redirect %>')}`)
    }
  },
  setTokens(tokens) {
    return store.dispatch('yano/setTokens', tokens)
  },
  clearTokens() {
    return store.dispatch('yano/clearTokens')
  }
})
