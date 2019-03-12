<template>
  <div v-if="render" class="home" v-bind:style="{ 'font-family':settings.cursiveFont?'Hari':'sans-serif'}">
    <div class="tb" v-bind:class="[settings.theme]">
      <div class="tbT">
        <div class="pT" v-if="date" v-text="getTitle"></div>
      </div>
      <div class="tbB">
        <div class="pN" @mouseleave="show.settings=false">
          <div class="pNTI" @click.stop="show.settings=true" >
            <i title="Settings" class="bs-settings" ></i>
            <Settings v-show="show.settings"></Settings>
          </div>
          <div class="pNTI"><i title="My Account" class="bs-user"></i>{{ currentUser.displayName }}</div>
          <div class="pNTI" title="Logout" @click="logout"><i class="bs-logout"></i></div>
        </div>
      </div>
    </div>
    <div v-show="!show.loading" class="cW" v-bind:class="[settings.theme]">
      <PersonListing class="uW" />
      <ExpenseListing class="eW" />
    </div>
    <div v-if="show.loading" class="cW">
      <FullLoading message="Wait while We prepare your Expenses..." />
    </div>
  </div>
  <FullLoading v-else :message="getLoadingMessage" />
</template>

<script>
  import {
    mapState
  } from "vuex";
  import fb from "@/firebaseConfig";
  import PersonListing from "@/components/PersonListing.vue";
  import ExpenseListing from "@/components/ExpenseListing.vue";
  import FullLoading from "@/components/FullLoading.vue"
  import Settings from "@/components/Settings.vue"
  
  export default {
    name: "home",
    computed: {
      ...mapState(["currentUser", "isAdmin", "settings"]),
      getTitle: function() {
        return (
          this.getMonth(this.date.getMonth() - 1) +
          " " +
          this.date.getFullYear() +
          " Expense"
        );
      },
      getLoadingMessage() {
        return "Hi " + this.currentUser.displayName + ", Loading your App";
      }
    },
    components: {
      PersonListing,
      ExpenseListing,
      FullLoading,
      Settings
    },
    mounted() {
      this.init();
    },
    data() {
      return {
        date: null,
        personCollection: [],
        show: {
          loading: true,
          settings:false
        },
        render:false
      };
    },
    methods: {
      logout: function() {
        fb.auth.signOut().then(() => {
          this.$store.commit("setCurrentUser", null);
          this.$router.replace("login");
        });
      },
      init() {
        this.date = new Date();
        fb.settings.get().then(this.initSettings)
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
          }
          fb.settings.set(settings, {
            merge: true
          });
        }
        this.$store.commit("saveSettings", settings);
        this.render = true;
        this.initPhotos()
      },
      initPhotos() {
        var _this = this
        fb.photos.onSnapshot(querySnapshot => {
          var photoCollection = []
          querySnapshot.forEach(doc => {
            photoCollection.push({
              data: doc.data().data,
              id: doc.id
            })
            if (photoCollection.length === querySnapshot.size) {
              _this.commitToStore(photoCollection)
            }
          });
        });
      },
      commitToStore(photoArray) {
        var photos = {};
        for (var i = -0; i < photoArray.length; i++) {
          photos[photoArray[i].id] = photoArray[i].data
        }
        this.$store.commit("savePhotos", photos);
      },
      hideLoading() {
        this.show.loading = false
      },
      getMonth(month) {
        var months = ["Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jue",
          "Jul",
          "Aug",
          "Sept",
          "Oct",
          "Nov",
          "Dec"
        ];
        if (month === -1) {
          month = months.length - 1;
        }
        return months[month];
      }
    }
  };
</script>

<style>
  #app,
  .home {
    height: 100%;
    width: 100%;
    font-family: var(--fontfamily);
    color: var(--textcolor);
    overflow: hidden;
  }
  
  .tb {
    width: 100%;
    height: 6em;
    color: #fff;
    overflow: visible;
    background: var(--soft);
  }
  
  .tbT {
    height: calc(100% - 2.1em);
    background: transparent;
    overflow: hidden;
  }
  
  .tbB {
    height: 2.1em;
    background: var(--hard);
    overflow: visible;
  }
  
  .tbT img {
    height: inherit;
    top: 0.3em;
    margin-left: 0.3em;
    float: left;
    position: relative;
  }
  
  .pN {
    position: absolute;
    margin-right: 0.6em;
    cursor: pointer;
    right: 0;
  }
  
  .pNTI {
    float: left;
    margin-left: 0.6em;
    padding-top: 0.3em;
    height: 2em;
    overflow: visible;
    font-size: 23px;
    position: relative;
  }
  
  .pN i {
    margin-right: 0.5em;
  }
  
  .pT {
    font-size: 2em;
    letter-spacing: 0.5em;
    text-transform: uppercase;
    /* color: #5c5edc; */
    text-align: center;
    float: left;
    padding: 2% 2%;
    font-weight: 100;
  }
  
  .cW {
    height: calc(100% - 6em);
    overflow: auto;
  }
  
  .uW,
  .eW {
    border-radius: 0.036em;
    position: relative;
    -webkit-box-shadow: 0em 0em 0.6em 0.6em rgba(202, 202, 202, 0.34);
    -moz-box-shadow: 0em 0em 0.6em 0.6em rgba(202, 202, 202, 0.34);
    box-shadow: 0em 0em 0.6em 0.6em rgba(202, 202, 202, 0.34);
    background: #fff;
    float: left;
    margin: 3vw 1vw;
    width: 33vw;
    background: #f5f5f5;
    height: calc(100% - 6em);
  }
  
  .eW {
    background: #f5f5f5;
    width: 60vw;
    max-width: unset;
  }
</style>
