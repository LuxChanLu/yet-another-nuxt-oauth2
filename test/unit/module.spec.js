/* eslint-disable no-console */
const { buildNuxt } = require('../utils.js')

describe('Module config', () => {
  jest.setTimeout(30000) // Maybe find a faster way to nuxt build ?

  it('should not init yano (Missing config)', async () => {
    console.warn = jest.fn()
    await buildNuxt()
    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(console.warn).toHaveBeenCalledWith('[YANO] No oauth2 configuration endpoint (Or configuration object)')
  })

  it('should init yano', async () => {
    console.warn = jest.fn()
    const { plugins } = await buildNuxt({
      yano: {
        endpoints: {
          authorization_endpoint: 'http://authorization',
          token_endpoint: 'http://token',
          userinfo_endpoint: 'http://userinfo'
        },
        grant: 'implicit'
      }
    })
    expect(console.warn).not.toHaveBeenCalledTimes(1)
    expect(plugins).toHaveLength(1)
    expect(plugins[0].src).toContain('plugin')
    expect(plugins[0].mode).toBe('all')
  })

  it('should init yano with function', async () => {
    console.warn = jest.fn()
    const { plugins } = await buildNuxt({
      yano: {
        endpoints: () => ({
          authorization_endpoint: 'http://authorization',
          token_endpoint: 'http://token',
          userinfo_endpoint: 'http://userinfo'
        }),
        grant: 'implicit'
      }
    })
    expect(console.warn).not.toHaveBeenCalledTimes(1)
    expect(plugins).toHaveLength(1)
    expect(plugins[0].src).toContain('plugin')
    expect(plugins[0].mode).toBe('all')
  })

  it('should init yano with auto router', async () => {
    console.warn = jest.fn()
    const { nuxt } = await buildNuxt({
      yano: {
        endpoints: {
          authorization_endpoint: 'http://authorization',
          token_endpoint: 'http://token',
          userinfo_endpoint: 'http://userinfo'
        },
        grant: 'implicit',
        router: true
      }
    })
    expect(console.warn).not.toHaveBeenCalledTimes(1)
    expect(nuxt.options.router).toBeDefined()
    expect(nuxt.options.router.middleware).toBeDefined()
    expect(nuxt.options.router.middleware).toHaveLength(1)
    expect(nuxt.options.router.middleware[0]).toBe('auth')
  })
})
