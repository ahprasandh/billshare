<template>
  <div class="logC" @mousemove="mouseOver($event)">
    <div class="logW">
      <div class="logLogo">
        <div class="logTit">
          <div>Expense Share</div>
        </div>
        <div class="logLogoW">
          <div id="logLogoDiv" class="logLogoDiv">
            <img
              src="../assets/logo.svg"
              v-bind:style="{
                transform:
                  'perspective(100px) rotateX(' +
                  xTransform +
                  'deg) rotateY(' +
                  yTransform +
                  'deg) scale3d(' +
                  scale +
                  ',' +
                  scale +
                  ',' +
                  scale +
                  ')'
              }"
            />
          </div>
        </div>
      </div>
      <div class="logFW">
        <FullLoading message="Signing you in..." v-show="loading" />
        <div class="logFC" @keypress.enter="login()">
          <span class="logFT">Login</span>
          <div class="logFIC">
            <div class="logFIG">
              <label class="logFILab">Email</label>
              <input class="logFI" type="text" v-model="email" />
            </div>
            <div class="logFIG">
              <label class="logFILab">Password</label>
              <input class="logFI" type="password" v-model="password" />
            </div>
          </div>
          <div class="logFB" @click="login">
            Sign In
          </div>
          <div class="logFsG" @click="loginAsGuest">
            Sign In As Guest
          </div>
        </div>
        <div class="logErr" v-if="error" v-text="error" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.logC {
  width: 100%;
  height: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  background: #311b92;
  background: linear-gradient(135deg, #311b92, #303f9f, #3f51b5, #5c6bc0);
}

.logTit {
  display: table-row;
  font-size: 50px;
  height: fit-content;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 5px;
}

.logTit div {
  height: fit-content;
  padding-top: 50px;
  color: #2e1395;
}

.logW {
  width: calc(100% - 40vw);
  height: calc(100% - 45vh);
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  margin: 12.5vh 12.5vw;
  position: relative;
}

.logLogo {
  width: 50%;
  display: table;
  top: 0;
  left: 0;
  height: 100%;
}

.logLogoW {
  display: table-cell;
  vertical-align: middle;
}

.logLogoT {
  text-align: center;
}

.logLogoDiv {
  width: 50%;
  max-width: 200px;
  max-height: 200px;
  height: 50%;
  margin: 0 auto;
  /* background: url(/billshare/img/logo.png) no-repeat; */
  position: relative;
  background-size: cover;
}

.logLogoDiv img {
  max-width: 200px;
  max-height: 200px;
}

.logFW {
  width: 50%;
  height: 100%;
  position: relative;
  background: #2e1395;
  background: url("../assets/login.png") no-repeat center;
  background-size: cover;
  box-shadow: 0 12px 15px 0 rgba(0, 0, 0, 0.24),
    0 17px 50px 0 rgba(0, 0, 0, 0.19);
}

.logFC {
  width: calc(100% - 140px);
  height: calc(100% - 140px);
  position: relative;
  padding: 90px 70px 50px 70px;
  background: rgba(40, 57, 101, 0.9);
}

.logFT {
  font-size: 22px;
  padding-bottom: 5px;
  margin: 0 0 25px 0;
  display: inline-block;
  border-bottom: 2px solid #fff;
  text-transform: uppercase;
  color: #fff;
  font-weight: 600;
  letter-spacing: 5px;
  cursor: default;
}

.logFI {
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 20px;
  width: calc(100% - 40px);
  font: 400 13.3333px Arial;
}

.logFILab {
  color: #aaa;
  font: 600 12px/10px "Open Sans", sans-serif;
  text-transform: uppercase;
  box-sizing: border-box;
}

.logFIG {
  margin-bottom: 15px;
  box-sizing: border-box;
}

.logFB {
  text-align: center;
  color: #fff;
  font-size: 25px;
  background: #1161ee;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  width: fit-content;
  margin: auto;
}

.logFsG {
  color: #cacaca;
  text-align: center;
  margin-top: 20px;
  cursor: pointer;
  font-size: 25px;
}

.logFsG:hover {
  color: #fff;
}

.logErr {
  color: #fff;
  font-size: 20px;
  position: relative;
  top: -25%;
  text-align: center;
  width: fit-content;
  margin: auto;
}
</style>

<script>
import FullLoading from "@/components/FullLoading.vue";
import serverUtils from "@/serverUtils";
export default {
  name: "login",
  components: {
    FullLoading
  },
  data() {
    return {
      email: "",
      password: "",
      xTransform: 0,
      yTransform: 0,
      scale: 1,
      loading: false,
      height: document.body.offsetHeight,
      width: document.body.offsetWidth,
      error: null
    };
  },
  methods: {
    mouseOver(event) {
      var y = event.pageX / this.height;
      var x = event.pageY / this.width;
      var scaleRatio = 10;
      this.xTransform = scaleRatio * (x - 0.5);
      this.yTransform = -(scaleRatio * (y - 0.5));
      this.scale = 1.1;
    },
    login() {
      this.loginToFB(this.email, this.password);
    },
    loginToFB: function(email, password, errCallback) {
      this.loading = true;
      if (!errCallback) {
        errCallback = this.loginErrorCallBack;
      }
      serverUtils.login(
        email,
        password,
        this.loginSuccessCallBack,
        errCallback
      );
    },
    loginSuccessCallBack(user) {
      serverUtils.getSettings(this.$parent.initSettings);
      this.$router.replace("dashboard");
    },
    loginErrorCallBack() {
      this.loading = false;
      this.error = "Email & password do not match";
    },
    loginAsGuest: function() {
      this.loginToFB("guest@domain.com", "guest@123", this.createGuest);
    },
    createGuest(err) {
      serverUtils.createGuest(this.loginAsGuest, () => {
        this.error = err.message;
      });
    }
  }
};
</script>
