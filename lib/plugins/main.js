// Import middleware loader into nuxt via a plugin
<%= `import '${options.middleware}'` %>
<%= `import YanoStore from '${options.store}'` %>
<%= `import YanoHelper from '${options.helper}'` %>

export default async (ctx, inject) => {
  if (ctx.store) {
    ctx.store.registerModule('yano', YanoStore)
    inject('yano', await YanoHelper(ctx).init())
  }
}
