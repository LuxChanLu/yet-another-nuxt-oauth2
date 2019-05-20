const JWT = require('jsonwebtoken')

export default {
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
      store.commit('notice', false)
    },
    clearToken(store) {
      return store.dispatch('setToken')
    },
    notice(store) {
      store.commit('notice', true)
    }
  },
  getters: {
    token(state) {
      return JWT.decode(state.token)
    }
  }
}
