<template>
  <div class="tb" v-bind:class="[settings.theme]">
    <div class="tbT">
      <router-link to="/dashboard" tag="i">
        <img src="../assets/logo.svg"
      /></router-link>
      <!-- <div v-text="'Expense Tracker'"></div> -->
    </div>
    <ul class="tbL">
      <router-link to="/dashboard" tag="li" class="navL">Dashboard</router-link>
      <!-- <router-link to="/expenses" tag="li" class="navL">Expenses</router-link>
      <router-link to="/todos" tag="li" class="navL">Todo's</router-link> -->
    </ul>
    <div
      class="pN"
      @mouseleave="
        show.settings = false;
        show.profile = false;
      "
    >
      <div class="pNTI">
        <i title="Search" class="bs-search"></i>
      </div>
      <div class="pNTI" @click.stop="show.settings = true">
        <i title="Settings" class="bs-settings"></i>
        <Settings v-if="show.settings"></Settings>
      </div>
      <div class="pNTI" @click.stop="show.profile = true">
        <Photo
          v-if="settings.show"
          :photo="photos[currentUser.uid]"
          :showAsGuest="settings.show.guestImage"
          :text="currentUser.displayName"
        />
        <Profile v-show="show.profile" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Settings from "@/components/Settings.vue";
import Photo from "@/components/Photo.vue";
import Profile from "@/components/Profile";
export default {
  name: "MenuBar",
  components: {
    Settings,
    Photo,
    Profile
  },
  computed: {
    ...mapState(["currentUser", "isAdmin", "settings", "photos"])
  },
  mounted() {
    this.init();
  },
  data() {
    return {
      date: null,
      show: {
        loading: true,
        settings: false,
        profile: false
      }
    };
  },
  methods: {
    init() {
      this.date = new Date();
    },
    getMonth(month) {
      var months = [
        "Jan",
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
.tb {
  width: 100%;
  height: 5vh;
  overflow: visible;
  color: var(--soft);
  background: #fff;
  box-shadow: 0px 0px 2px 1px var(--soft);
}

.tbT {
  float: left;
  height: 100%;
  width: fit-content;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-align: center;
  color: var(--hard);
  display: flex;
  justify-content: center;
  margin-left: 1vw;
  visibility: hidden;
}

.tbT img {
  width: 4vh;
  padding: 0.5vh;
  height: 4vh;
  cursor: pointer;
}

.tbT div {
  align-self: center;
}

.tbL {
  display: flex;
  flex-direction: row;
  height: 100%;
  float: left;
}

.navL {
  cursor: pointer;
  position: relative;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  padding: 0 20px;
  letter-spacing: 2px;
  color: #5f5f5f;
}

.navL:hover {
  color: #000;
}

.navL:hover.navL::after {
  transform: translate(-50%, 0) scaleX(1) !important;
}

.lAct {
  color: var(--hard) !important;
}

.lAct::after {
  transform: translate(-50%, 0) scaleX(1) !important;
}

.navL::after {
  position: absolute;
  content: "";
  bottom: -1px;
  left: 50%;
  height: 2px;
  width: calc(100% - 20px);
  background-color: var(--hard);
  transform: translate(-50%, 0) scaleX(0);
  transition: -webkit-transform 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);

  transition: transform 0.2s cubic-bezier(0.215, 0.61, 0.355, 1),
    -webkit-transform 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);
}

.pN {
  display: flex;
  float: right;
  cursor: pointer;
  right: 0;
  height: 100%;
}

.pNTI {
  float: left;
  margin-left: 1vw;
  overflow: visible;
  font-size: var(--headingsize);
  position: relative;
  align-self: center;
}

.pN i {
  margin-right: 0.5vw;
}

.pN .bs-search {
  font-size: 24px;
}
</style>
