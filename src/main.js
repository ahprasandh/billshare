import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import fb from "./firebaseConfig";
import FullLoading from "@/components/FullLoading.vue";
Vue.config.productionTip = false;
let app = "";
fb.auth.onAuthStateChanged(() => {
  console.log("hhh");
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});
new Vue({ render: h => h(FullLoading) }).$mount("#initLoading");
