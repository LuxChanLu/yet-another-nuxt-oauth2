const Keyv = require('keyv')

export default ctx => {
  ctx.app.$yano.keyv = new Keyv('<%= options.cache %>', { namespace: 'yana' })
  ctx.app.$yano.client = {
    secret: '<%= options.client.secret %>'
  }
}
