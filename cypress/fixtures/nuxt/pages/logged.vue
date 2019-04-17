<template>
  <div>
    <span>Current date : {{ new Date() }}</span>
    <template v-if="token">
      <br/>
      <span data-cy="token-sub">{{ token.sub }}</span>
      <br/>
      <span data-cy="token-scope">{{ token.scope }}</span>
    </template>
    <br/>
    <span v-if="expiry" data-expiry="token-expiry">{{ expiry }}</span>
    <br/>
    <button v-show="notice" data-cy="token-refresh" @click="$yano.refreshToken()">Refresh token</button>
    <br/>
    <span v-show="$yano.isTokenExpired()" data-cy="expired">Token expired</span>
    <br/>
    <button data-cy="logout" @click="$yano.logout()">Quit the beautiful world of logged users</button>
    <br/>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data: () => ({ expiry: 10 }),
  computed: {
    token() {
      return this.$yano.accessToken()
    },
    notice() {
      return this.$store.state.yano.notice
    }
  },
  watch: {
    notice(value) {
      if (value)  {
        alert("Token gonna expire !")
      }
    }
  },
  mounted() {
    this.expiryInterval = setInterval(() => (this.expiry = this.$yano.tokenExpiryAt() - (new Date()).getTime()), 1000)
  },
  beforeDestroy() {
    clearInterval(this.expiryInterval)
  }
}
</script>

