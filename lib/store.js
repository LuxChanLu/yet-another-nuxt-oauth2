module.exports = {
  namespaced: true,
  state: () => ({ tokens: { access: undefined, refresh: undefined } }),
  mutations: {
    access(state, access) {
      state.tokens.access = access
    },
    refresh(state, refresh) {
      state.tokens.refresh = refresh
    }
  },
  actions: {
    setTokens(store, { access_token, refresh_token }) {
      store.commit('access', access_token)
      store.commit('refresh', refresh_token)
    },
    clearTokens(store) {
      return store.dispatch('setTokens', {})
    }
  }
}
