<template>
  <div>
    {{ $yano.accessToken() }}
    <br/>
    {{ new Date($yano.tokenExpiryAt()) }}
    <br/>
    <button v-if="!notice" @click="$yano.refreshToken()"> test </button>
  </div>
</template>

<script>
export default {
  computed: {
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
  }
}
</script>

