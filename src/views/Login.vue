<template>
  <div class="login">
    <img src="../assets/logo.png" />
    <h3>Sign In</h3>
    <input type="text" v-model="email" placeholder="Email" /><br />
    <input type="password" v-model="password" placeholder="Password" /><br />
    <button @click="login">Sign In</button>
    <button @click="loginAsGuest">Sign In As Guest</button>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
export default {
  name: "login",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    login: function() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            this.$router.replace("home");
            this.$store.commit("setCurrentUser", user);
          },
          err => {
            alert("Oops. " + err.message);
          }
        );
    },
    loginAsGuest: function() {
      firebase
        .auth()
        .signInWithEmailAndPassword("guest@domain.com", "guest@123")
        .then(
          () => {
            this.$router.replace("home");
          },
          () => {
            firebase
              .auth()
              .createUserWithEmailAndPassword("guest@domain.com", "guest@123")
              .then(
                () => {
                  this.$router.replace("home");
                },
                err => {
                  alert("Oops. " + err.message);
                }
              );
          }
        );
    }
  }
};
</script>

<style scoped>
/* "scoped" attribute limit the CSS to this component only */
.login {
  margin-top: 40px;
}

input {
  margin: 10px 0;
  width: 20%;
  padding: 15px;
}

button {
  margin-top: 20px;
  width: 10%;
  cursor: pointer;
}
</style>
