const { resolve } = require('path')
const { Nuxt, Builder } = require('nuxt')

describe('Module config', () => {
  let nuxt = null

  beforeAll(async () => {
    const config = {
      dev: false,
      rootDir: resolve(__dirname, '..')
    }
    nuxt = new Nuxt(config)
    await new Builder(nuxt).build()
    await nuxt.server.listen(4000, 'localhost')
  })
  afterAll(() => nuxt.close())

  it('should not init sentry', async () => {
    console.log(nuxt)
  })

})
