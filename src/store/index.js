import Vue from 'vue'
import Vuex from 'vuex'
import Userinfo from "./Userinfo";
Vue.use(Vuex)

export default new Vuex.Store({

  modules: {
    Userinfo: Userinfo
  },

  state: {

        // user:  JSON.parse(localStorage.getItem("loginname"))|| {}
		user:localStorage.getItem("loginname")!==null? JSON.parse(localStorage.getItem("loginname")):{},
  },
  mutations: {

  },
  actions: {
  }

})
