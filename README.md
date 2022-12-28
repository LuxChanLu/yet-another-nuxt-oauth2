# YANO : Yet another nuxt oauth2 module

[![Build Status](https://travis-ci.org/LuxChanLu/yet-another-nuxt-oauth2.svg?branch=master)](https://travis-ci.org/LuxChanLu/yet-another-nuxt-oauth2)
<!-- [![Coverage Status](https://coveralls.io/repos/github/LuxChanLu/yet-another-nuxt-oauth2/badge.svg?branch=master)](https://coveralls.io/github/LuxChanLu/yet-another-nuxt-oauth2?branch=master) -->
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/683d1198ec0e4c50a2b0c58174244d5e)](https://www.codacy.com/app/LuxChanLu/yet-another-nuxt-oauth2?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=LuxChanLu/yet-another-nuxt-oauth2&amp;utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/2f19318b8b78081f0506/maintainability)](https://codeclimate.com/github/LuxChanLu/yet-another-nuxt-oauth2/maintainability)
[![David](https://img.shields.io/david/LuxChanLu/yet-another-nuxt-oauth2.svg)](https://david-dm.org/LuxChanLu/yet-another-nuxt-oauth2)
[![Known Vulnerabilities](https://snyk.io/test/github/LuxChanLu/yet-another-nuxt-oauth2/badge.svg)](https://snyk.io/test/github/LuxChanLu/yet-another-nuxt-oauth2)

[![Downloads](https://img.shields.io/npm/dm/yet-another-nuxt-oauth2.svg)](https://www.npmjs.com/package/yet-another-nuxt-oauth2)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FYourSoftRun%2Fyet-another-nuxt-oauth2.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FYourSoftRun%2Fyet-another-nuxt-oauth2?ref=badge_shield)

## Features

- Configuration by object or `.well-known/openid-configuration`
- Full SSR compatible
- JWT Tokens
- Expiration/Refresh token

### Grant type support

|  Grant              |   |
|---------------------|---|
| Authorization code  | ✓ |
| Implicit            | ✓ |
| Password            | ✓ |
| Device code         |   |

## Module options
```js
{
  endpoints: {
    authorization_endpoint: 'http://auth.server/authorization',
    token_endpoint: 'http://auth.server/token'
    userinfo_endpoint: 'http://auth.server/userinfo'
  }, // Object or 'http://auth.my.server/.well-known/openid-configuration'
  router: false // Auto add auth middleware to the router
}
```

## How to use it

If you want a great open source auth/IAM server : <https://www.keycloak.org/> (This one is :fireworks:)

/!\ Store need to be enable (See <https://nuxtjs.org/guide/vuex-store/#activate-the-store>) /!\

```js
// TODO
```
