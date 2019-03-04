import Vue from "vue";
import Vuex from "vuex";
import fb from "./firebaseConfig";
import constants from "./constants";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentUser: null,
    isAdmin: false
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
      state.isAdmin = user && user.uid === constants.adminUid;
    }
  },
  actions: {}
});

fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit("setCurrentUser", user);
  }
});

export default store;
