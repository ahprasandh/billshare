import firebase from "firebase/app";
import "firebase/auth";
import Vue from "vue";
import Router from "vue-router";

// import Shared from "@/views/Shared";
import Login from "@/views/Login";
import SignUp from "@/views/SignUp";
import Expenses from "@/views/Expenses";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "*",
      redirect: "/login"
    },
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/signup",
      name: "SignUp",
      component: SignUp
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: Expenses,
      meta: {
        requiresAuth: true
      }
    }
    // {
    //   path: "/expenses",
    //   name: "Expenses",
    //   component: Expenses,
    //   meta: {
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: "/todos",
    //   name: "Todos",
    //   component: ComingSoon,
    //   meta: {
    //     requiresAuth: true
    //   }
    // }
  ],
  linkActiveClass: "lAct"
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next("login");
  else if (!requiresAuth && currentUser) next("dashboard");
  else next();
});

export default router;
