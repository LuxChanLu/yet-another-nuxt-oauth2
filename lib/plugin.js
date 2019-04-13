// Import middleware loader into nuxt via a plugin
<%= `import '${options.middleware}'` %>
<%= `import YanoStore from '${options.store}'` %>
<%= `import YanoHelper from '${options.helper}'` %>

export default (ctx, inject) => {
  if (ctx.store) {
    ctx.store.registerModule('yano', YanoStore, { preserveState: false })
    inject('yano', YanoHelper(ctx))
  }
}
