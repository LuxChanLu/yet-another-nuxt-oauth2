<template>
  <div>
    <span>Current date : {{ new Date() }}</span>
    <template v-if="token">
      <br/>
      <span data-cy="token-sub" v-text="token.sub" />
      <br/>
      <span data-cy="token-scope" v-text="token.scope" />
      <br/>
      <pre data-cy="token" v-text="token"/>
    </template>
    <br/>
    <span v-if="expiry" data-expiry="token-expiry" v-text="expiry" />
    <br/>
    <button v-show="notice" data-cy="token-refresh" @click="$yano.refreshToken()">Refresh token</button>
    <br/>
    <span v-show="isTokenExpired" data-cy="expired">Token expired</span>
    <br/>
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
    isTokenExpired() {
      return this.$yano.isTokenExpired()
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

