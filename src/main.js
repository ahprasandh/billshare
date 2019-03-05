import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import fb from "./firebaseConfig";
Vue.config.productionTip = false;
let app = "";
fb.auth.onAuthStateChanged(() => {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});
