<template>
     <div class="pSettings">
          <div class="pSettingsC">
               <div class="pSettingsDiv">
                    <div class="setT">Help Text</div>
                    <div class="iW"> <label class="switch"> <input type="checkbox" v-model="settings.show.help" class="icB" > <span class="slider round"></span> </label></div>
               </div>
               <div class="pSettingsDiv">
                    <div class="setT">Theme</div>
                    <div id="themeLister" class="iW">
                         <label class="container">Pink
                                   <input type="radio" checked="checked" name="theme" v-model="settings.theme" value="themepink">
                                   <span class="checkmark"></span>
                                   </label>
                         <label class="container">Red
                                   <input type="radio" name="theme" v-model="settings.theme" value="themered">
                                   <span class="checkmark"></span>
                                   </label>
                         <label class="container">Blue
                                   <input type="radio" name="theme" v-model="settings.theme" value="themeblue">
                                   <span class="checkmark"></span>
                                   </label>
                         <label class="container">Purple
                                   <input type="radio" name="theme" v-model="settings.theme" value="themepurple">
                                   <span class="checkmark"></span>
                                   </label>
                         <label class="container">Light Blue
                                   <input type="radio" name="theme" v-model="settings.theme" value="themelightblue">
                                   <span class="checkmark"></span>
                                   </label>
                         <label class="container">Green
                                   <input type="radio" name="theme" v-model="settings.theme" value="themegreen">
                                   <span class="checkmark"></span>
                                   </label>
                         <label class="container">Dark
                                   <input type="radio" name="theme" v-model="settings.theme" value="themedark">
                                   <span class="checkmark"></span>
                                   </label>
                    </div>
               </div>
               <div class="pSettingsDiv">
                    <div class="setT">Cursive Font</div>
                    <div class="iW"> <label class="switch"> <input type="checkbox" class="icB" v-model="settings.cursiveFont"> <span class="slider round"></span> </label></div>
               </div>
               <div class="pSettingsDiv">
                    <div class="setT">Guest Image</div>
                    <div class="iW"> <label class="switch"> <input type="checkbox" class="icB" v-model="settings.show.guestImage"> <span class="slider round"></span> </label></div>
               </div>
               <div v-if="isAdmin" class="pSettingsS">Save</div>
               <div v-if="isAdmin" class="apButW" @click.stop="save"><span class="apBut">Save</span></div>
          </div>
     </div>
</template>

<script>
     import {
          mapState
     } from "vuex";
     import fb from "@/firebaseConfig";
     export default {
          computed: {
               ...mapState(["isAdmin", "settings"]),
          },
          methods: {
               save() {
                    fb.settings.set(this.settings, {
                         merge: true
                    });
               }
          }
     };
</script>

<style>
     .pN .pSettings {
          position: absolute;
          top: 1.4em;
          left: 0;
          background: white;
          -webkit-box-shadow: 0 0 1em 1em rgba(0, 0, 0, 0.1);
          box-shadow: 0 0 0.3em 0.2em rgba(0, 0, 0, 0.5);
          z-index: 10;
          width: 7em;
          font-size: var(--normal);
          color: var(--textcolor);
     }
     
     .pSettingsDiv {
          margin: 0.5em 0.5em;
     }
     
     .pSettingsDiv .setT {
          padding: 0.5em;
          font-weight: var(--fontbold);
     }
     
     .pSettingsDiv .iW {
          padding: 0.5em;
     }
     
     .switch {
          position: relative;
          display: inline-block;
          width: 45px;
          height: 20px;
     }
     
     .switch .icB {
          opacity: 0;
          width: 0;
          height: 0;
     }
     
     .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          -webkit-transition: 0.4s;
          transition: 0.4s;
     }
     
     .slider:before {
          position: absolute;
          content: "";
          height: 15px;
          width: 15px;
          left: 4px;
          bottom: 3.5px;
          background-color: white;
          -webkit-transition: 0.4s;
          transition: 0.4s;
     }
     
     input:checked+.slider {
          background-color: var(--soft);
     }
     
     input:checked+.slider:before {
          -webkit-transform: translateX(24px);
          -ms-transform: translateX(24px);
          transform: translateX(24px);
     }
     
     .slider.round {
          border-radius: 34px;
     }
     
     .slider.round:before {
          border-radius: 50%;
     }
     
     .container {
          display: block;
          position: relative;
          padding-left: 35px;
          margin-bottom: 12px;
          cursor: pointer;
          font-size: 22px;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
     }
     
     
     /* Hide the browser's default radio button */
     
     .container input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
     }
     
     
     /* Create a custom radio button */
     
     .checkmark {
          position: absolute;
          top: 0;
          left: 0;
          height: 25px;
          width: 25px;
          background: linear-gradient(90deg, #c850c0, #4158d0);
          border-radius: 50%;
     }
     
     
     /* When the radio button is checked, add a blue background */
     
     .container input:checked~.checkmark {
          background-color: #2196f3;
     }
     
     
     /* Create the indicator (the dot/circle - hidden when not checked) */
     
     .checkmark:after {
          content: "";
          position: absolute;
          display: none;
     }
     
     
     /* Show the indicator (dot/circle) when checked */
     
     .container input:checked~.checkmark:after {
          display: block;
     }
     
     
     /* Style the indicator (dot/circle) */
     
     .container .checkmark:after {
          top: 9px;
          left: 9px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: white;
     }
     
     #themeLister .container:nth-child(1) .checkmark {
          background: linear-gradient(90deg, #C2185B, #AD1457);
     }
     
     #themeLister .container:nth-child(2) .checkmark {
          background: linear-gradient(90deg, #C62828, #C62828);
     }
     
     #themeLister .container:nth-child(3) .checkmark {
          background: linear-gradient(90deg, #303F9F, #283593);
     }
     
     #themeLister .container:nth-child(4) .checkmark {
          background: linear-gradient(90deg, #7B1FA2, #6A1B9A);
     }
     
     #themeLister .container:nth-child(5) .checkmark {
          background: linear-gradient(90deg, #1976D2, #1976D2);
     }
     
     #themeLister .container:nth-child(6) .checkmark {
          background: linear-gradient(90deg, #388E3C, #2E7D32);
     }
     
     #themeLister .container:nth-child(7) .checkmark {
          background: linear-gradient(90deg, #455A64, #37474F);
     }
     
     #themeLister .container:nth-child(8) .checkmark {
          background: linear-gradient(90deg, #c850c0, #4158d0);
     }
     
     .pSettingsS {
          text-align: center;
          color: var(--soft);
          margin: 1em;
     }
</style>


