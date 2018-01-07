import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexSession = new VuexPersistence({
  storage: window.sessionStorage
})

export default new Vuex.Store({
  state: {
  },
  mutations: {
    setDetails: function (state, payload) {
      state.apiDetails = payload.details
    }
  },
  plugins: [vuexSession.plugin]
})
