import CookieUniversal from 'cookie-universal'

const isNoticeEnable = parseInt('<%= options.notice %>', 10) > 0

export default async ({ store, req, res, redirect }) => {
  const helper = {
    async init(token) {
      if (token) {
        await store.dispatch('yano/setToken', token)
        if (isNoticeEnable && process.client && !this.isTokenExpired()) {
          const notice = () => store.dispatch('yano/notice', (this.tokenExpiration = undefined))
          if (!this.isTokenExpireSoon()) {
            if (this.tokenExpiration) {
              clearTimeout(this.tokenExpiration)
            }
            this.tokenExpiration = setTimeout(notice, this.tokenExpiryAt() - (new Date()).getTime() - parseInt('<%= options.notice %>', 10))
          } else {
            notice()
          }
        }
      }
      return this
    },
    accessToken() {
      return store.getters['yano/token']
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
    isTokenExpireSoon() {
      return this.isTokenExpired() || (this.tokenExpiryAt() - (new Date()).getTime() - parseInt('<%= options.notice %>', 10)) <= 0
    },
    async refreshToken() {
      try {
        await this.init((await (await fetch('<%= options.routes.refresh %>')).json()).token)
      } catch (error) {
        this.logout()
      }
    },
    logout() {
      if (process.server) {
        return redirect('<%= options.routes.logout %>')
      }
      // To force server middleware call (Otherwise vue-router will load like one route)
      window.location.replace('<%= options.routes.logout %>')
    }
  }
  const cookies = CookieUniversal(req, res)
  return helper.init(cookies.get('<%= options.cookie %>') || cookies.get('<%= options.cookie %>', { fromRes: true }))
}
