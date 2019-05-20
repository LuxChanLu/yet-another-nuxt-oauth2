// Import middleware loader into nuxt via a plugin
import Middleware from './middleware'
import YanoStore from '<%= options.store %>'
import YanoHelper from '<%= options.helper %>'

// Auth middleware
Middleware.auth = async ctx => {
  const { isHMR, redirect, app } = ctx
  if (isHMR || !app.$yano) {
    return
  }
  if (app.$yano.isTokenExpired()) {
    const authUrl = `<%= options.routes.login %>?to=${ctx.route.path}`
    if (process.server) {
      return redirect(authUrl)
    }
    // To force server middleware call (Otherwise vue-router will load like one route)
    window.location.replace(authUrl)
  }
}

// Store/helper injection
export default async (ctx, inject) => {
  if (ctx.store) {
    ctx.store.registerModule('yano', YanoStore)
    inject('yano', await YanoHelper(ctx))
  }
  // Clear url parameter after auth
  if (process.client) {
    const params = new URLSearchParams(window.location.search)
    if (params.has('state') && params.has('scope')) {
      window.history.replaceState({}, document.title, ctx.route.path)
    }
  }
}
