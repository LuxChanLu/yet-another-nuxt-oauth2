module.exports = {
  namespaced: true,
  state: () => ({ token: undefined, notice: false }),
  mutations: {
    token(state, token) {
      state.token = token
    },
    notice(state, notice) {
      state.notice = notice
    }
  },
  actions: {
    setToken(store, token) {
      store.commit('token', token)
    },
    clearToken(store) {
      return store.dispatch('setToken')
    },
    notice(store) {
      store.commit('notice', true)
    }
  }
}
