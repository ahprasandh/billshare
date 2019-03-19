<template>
  <div id="app" v-bind:class="[settings.theme]">
    <MenuBar v-if="currentUser && currentUser.displayName" />
    <router-view v-if="!show.loading" />
    <FullLoading v-else :message="getLoadingMessage" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import MenuBar from "@/views/MenuBar";
import serverUtils from "@/serverUtils";
import FullLoading from "@/components/FullLoading.vue";
export default {
  name: "App",
  components: { MenuBar, FullLoading },
  computed: {
    ...mapState(["currentUser", "settings"]),
    getLoadingMessage() {
      return "Hi " + (this.currentUser && this.currentUser.displayName!==null?this.currentUser.displayName:'') + ", Loading your App";
    }
  },
  data() {
    return { show: { loading: true } };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.date = new Date();
      if(this.currentUser && this.currentUser.displayName){
        serverUtils.getSettings(this.initSettings);
      }else{
        this.show.loading=false;
      }
    },
    initSettings(data) {
      var settings = null;
      if (data.exists) {
        settings = data.data();
      } else {
        settings = {
          show: {
            help: true,
            showExpenseMonth: true,
            guestImage: true
          },
          theme: "themeblue",
          currency: "₹",
          cursiveFont: true
        };
        serverUtils.saveSettings(settings, this.saveSettingsCallback);
      }
      this.$store.commit("saveSettings", settings);
      this.show.loading = false;
      this.initPhotos();
    },
    saveSettingsCallback() {},
    initPhotos() {
      serverUtils.getPhotos(this.commitToStore);
    },
    commitToStore(photoArray) {
      var photos = {};
      for (var i = -0; i < photoArray.length; i++) {
        photos[photoArray[i].id] = photoArray[i].data;
      }
      this.$store.commit("savePhotos", photos);
    },
    hideLoading() {
      this.show.loading = false;
    }
  }
};
</script>

<style>
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font: inherit;
  vertical-align: baseline;
}

/* HTML5 display-role reset for older browsers */

article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}

body {
  line-height: 1;
}

ol,
ul {
  list-style: none;
}

blockquote,
q {
  quotes: none;
}

blockquote:before,
blockquote:after,
q:before,
q:after {
  content: "";
  content: none;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

body {
  top: 0;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="date"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

::placeholder {
  color: #2c3e50;
  opacity: 1;
  /* Firefox */
}

:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #2c3e50;
}

::-ms-input-placeholder {
  /* Microsoft Edge */
  color: #2c3e50;
}

@font-face {
  font-family: Hari;
  src: url(../public/fonts/Hari.ttf);
}

* {
  font-family: "Lato" sans-serif;
}

html,
body {
  height: 100%;
  width: 100%;
}

::-webkit-scrollbar {
  width: 1px;
  height: 10px;
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--hard);
  height: 10px;
}

#app {
  height: 100%;
  width: 100%;
  font-family: var(--fontfamily);
  color: var(--textcolor);
  overflow: hidden;
}

.mC {
  height: 95vh;
  width: 100vw;
}

.pName {
  width: fit-content;
  font-size: var(--normalSize);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 15vw;
}

input {
  padding-left: 0.6em;
  border: none;
  border-bottom: 0.06em solid #e0e0e0;
  background: none;
}

input:focus {
  outline: none;
  border-bottom-color: #1e88e5;
}

input:disabled {
  background: none;
  border-bottom-color: #fff;
}

.err {
  position: absolute;
  top: 45%;
  width: calc(100% - 1.2em);
  text-align: center;
  z-index: 2;
}

.err span {
  text-overflow: clip;
  color: #fff;
  height: auto;
  margin: 0 auto;
  padding: 0.6em;
  position: relative;
  background: #ef5350;
  font-size: 1.5em;
  border-radius: 0.24em;
  padding: 0.6em;
  box-shadow: 0.06em 0.06em 0.54em 0.3em rgba(223, 141, 141, 0.34);
  width: 100%;
  white-space: nowrap;
  word-break: break-all;
}

/* Font Icons  */

@font-face {
  font-family: "billshare";
  src: url("../public/fonts/billshare.eot?r0vfju");
  src: url("../public/fonts/billshare.eot?r0vfju#iefix")
      format("embedded-opentype"),
    url("../public/fonts/billshare.ttf?r0vfju") format("truetype"),
    url("../public/fonts/billshare.woff?r0vfju") format("woff"),
    url("../public/fonts/billshare.svg?r0vfju#billshare") format("svg");
  font-weight: normal;
  font-style: normal;
}

[class^="bs-"],
[class*=" bs-"] {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: "billshare" !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.bs-search:before {
  content: "\e90c";
}

.bs-wallet:before {
  content: "\e906";
}

.bs-save:before {
  content: "\e901";
}

.bs-web:before {
  content: "\e909";
}

.bs-spreadsheet:before {
  content: "\e90a";
}

.bs-settings:before {
  content: "\e905";
}

.bs-more:before {
  content: "\e90b";
}

.bs-logout:before {
  content: "\e904";
}

.bs-preview:before {
  content: "\e902";
}

.bs-edit:before {
  content: "\e900";
}

.bs-help:before {
  content: "\e001";
}

.bs-add:before {
  content: "\e002";
}

.bs-arrow-up:before {
  content: "\e907";
}

.bs-arrow-down:before {
  content: "\e908";
}

.bs-minus:before {
  content: "\e903";
}

.bs-delete:before {
  content: "\e004";
}

.bs-user:before {
  content: "\e003";
}

.bs-delete:before {
  content: "\e004";
}

/* THEME COLORS */

:root {
  --soft: #7b1fa2;
  --hard: #6a1b9a;
  --headingSize: 20px;
  --titleSize: 17px;
  --normalSize: 15px;
  --smallSize: 12px;
  --textcolor: #2c3e50;
  --fontfamily: "Lato", sans-serif;
  --fontbold: 600;
}

.themepink {
  --soft: #c2185b;
  --hard: #ad1457;
}

.themered {
  --soft: #d32f2f;
  --hard: #c62828;
}

.themeblue {
  --soft: #303f9f;
  --hard: #283593;
}

.themepurple {
  --soft: #7b1fa2;
  --hard: #6a1b9a;
}

.themelightblue {
  --soft: #1976d2;
  --hard: #1565c0;
}

.themegreen {
  --soft: #388e3c;
  --hard: #2e7d32;
}

.themedark {
  --soft: #455a64;
  --hard: #37474f;
}
</style>
