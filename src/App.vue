<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  import {
    mapState
  } from "vuex";
  import fb from "@/firebaseConfig";
  import FullLoading from "@/components/FullLoading.vue"
  export default {
    name: "App"
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
    font-size: 100%;
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
    content: '';
    content: none;
  }
  
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  
  body {
    top: 0;
  }
  
  input[type=number]::-webkit-inner-spin-button,
  input[type=date]::-webkit-inner-spin-button {
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
    font-family: Hari;
  }
  
  html,
  body {
    height: 100%;
    width: 100%;
  }
  
   ::-webkit-scrollbar {
    width: 0px;
    /* remove scrollbar space */
    background: transparent;
    /* optional: just make scrollbar invisible */
  }
  
  
  /* optional: show position indicator in red */
  
  ::-webkit-scrollbar-thumb {
    background: var(--hard);
  }
  
  .pMt {
    padding: 0!important;
    margin: -0.6em 0.5em!important;
    height: 2em;
  }
  
  .pMt span {
    background: url(./assets/guest.svg) no-repeat center;
    font-weight: var(--fontbold);
    color: #fff;
    border-radius: 5em;
    padding: 0.4em 0.3em 0.2em 0.3em;
    background-size: cover!important;
    min-height: 1em;
    min-width: 1em;
    display: block;
  }
  
  .pName {
    width: 25%;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0.3em 0.3em;
    margin: 0.3em 0;
    text-align: center;
    font-size: 1.5em;
  }
  
  input {
    padding-left: 0.6em;
    border: none;
    border-bottom: 0.06em solid #E0E0E0;
    background: none;
  }
  
  input:focus {
    outline: none;
    border-bottom-color: #1E88E5;
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
    background: #EF5350;
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
    font-family: 'billshare';
    src: url('../public/fonts/billshare.eot?r0vfju');
    src: url('../public/fonts/billshare.eot?r0vfju#iefix') format('embedded-opentype'), url('../public/fonts/billshare.ttf?r0vfju') format('truetype'), url('../public/fonts/billshare.woff?r0vfju') format('woff'), url('../public/fonts/billshare.svg?r0vfju#billshare') format('svg');
    font-weight: normal;
    font-style: normal;
  }
  
  [class^="bs-"],
  [class*=" bs-"] {
    /* use !important to prevent issues with browser extensions that change fonts */
    font-family: 'billshare' !important;
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
    --soft: #7B1FA2;
    --hard: #6A1B9A;
    --normal: 20px;
    --textcolor: #2c3e50;
    --fontfamily: Hari;
    --fontbold: 600
  }
  
  .themepink {
    --soft: #C2185B;
    --hard: #AD1457;
  }
  
  .themered {
    --soft: #D32F2F;
    --hard: #C62828;
  }
  
  .themeblue {
    --soft: #303F9F;
    --hard: #283593;
  }
  
  .themepurple {
    --soft: #7B1FA2;
    --hard: #6A1B9A;
  }
  
  .themelightblue {
    --soft: #1976D2;
    --hard: #1565C0;
  }
  
  .themegreen {
    --soft: #388E3C;
    --hard: #2E7D32;
  }
  
  .themedark {
    --soft: #455A64;
    --hard: #37474F;
  }
</style>

