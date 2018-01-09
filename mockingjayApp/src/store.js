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
    setApp: function (state, payload) {
      state.AppDetails = payload.AppDetails
    },
    setApiSketch: function (state, payload) {
      state.ApiSketch = payload.ApiSketch
    },
    setApiSchema: function (state, payload) {
      state.ApiSchema = payload.ApiSchema
    },
    setApiConfig: function (state, payload) {
      state.ApiConfig = payload.ApiConfig
    }
  },
  plugins: [vuexSession.plugin]
})
