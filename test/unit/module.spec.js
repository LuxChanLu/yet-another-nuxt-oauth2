/* eslint-disable no-console */
const fetchMock = require('fetch-mock')
const { buildNuxt } = require('../utils.js')

describe('Module config', () => {
  jest.setTimeout(30000) // Maybe find a faster way to nuxt build ?

  it('should not init yano (Missing config)', async () => {
    console.warn = jest.fn()
    await buildNuxt()
    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(console.warn).toHaveBeenCalledWith('[YANO] No oauth2 configuration endpoint (Or configuration object)')
  })

  it('should not init yano (With wrong inline object config)', async () => {
    console.warn = jest.fn()
    await buildNuxt({
      yano: {
        endpoints: {
          missing_endpoint: 'not'
        }
      }
    })
    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(console.warn).toHaveBeenCalledWith('[YANO] Wrong oauth2 configuration (Mandatory : authorization_endpoint, token_endpoint, userinfo_endpoint or unsupported grant type)')
  })

  it('should not init yano (With unsupported grant - via http autoconfigure)', async () => {
    console.warn = jest.fn()
    fetchMock.get('http://this.is.not.a.server/auth', { authorization_endpoint: 'http://authorization', token_endpoint: 'http://token', userinfo_endpoint: 'http://userinfo', grant_types_supported: ['password'] })
    await buildNuxt({
      yano: {
        endpoints: 'http://this.is.not.a.server/auth',
        grant: 'implicit'
      }
    })
    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(console.warn).toHaveBeenCalledWith('[YANO] Wrong oauth2 configuration (Mandatory : authorization_endpoint, token_endpoint, userinfo_endpoint or unsupported grant type)')
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
    expect(plugins.length).toBe(1)
    expect(plugins[0].src).toContain('middlewares')
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
    expect(nuxt.options.router.middleware.length).toBe(1)
    expect(nuxt.options.router.middleware[0]).toBe('auth')
  })
})
