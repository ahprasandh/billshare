<template>
  <div class="home">
    <div class="tb">
      <div class="tbT">
        <div class="pT" v-if="date" v-text="getTitle"></div>
      </div>
      <div class="tbB">
        <div class="pN">
           <div><i title="Settings" class="bs-settings" /></div>
           <div><i title="My Account" class="bs-user"></i>{{ currentUser.displayName }}</div>
          <div title="Logout" class="lo" @click="logout"><i class="bs-logout"></i></div>
        </div>
      </div>
    </div>
    <div v-show="!show.loading" class="cW">
      <PersonListing class="uW" />
      <ExpenseListing class="eW" />
    </div>
    <div v-if="show.loading" class="cW">
      <FullLoading message="Wait while We prepare your Expenses..." />
    </div>
  </div>
</template>

<script>
  import {
    mapState
  } from "vuex";
  import fb from "@/firebaseConfig";
  import PersonListing from "@/components/PersonListing.vue";
  import ExpenseListing from "@/components/ExpenseListing.vue";
  import FullLoading from "@/components/FullLoading.vue"
  
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
      }
    },
    components: {
      PersonListing,
      ExpenseListing,
      FullLoading
    },
    mounted() {
      this.init();
    },
    data() {
      return {
        date: null,
        personCollection: [],
        show: {
          loading: true
        }
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
        var settings = {
          show: {
            help: false
          },
          expenseMonth: this.date.getFullYear() + "" + this.getMonth(this.date.getMonth() - 1),
          currency: "₹"
        }
        this.$store.commit("saveSettings", settings)
        // this.initExpenses();
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
    font-family: Hari;
    color: #2c3e50;
    overflow: hidden;
  }
  
  .tb {
    width: 100%;
    height: 6em;
    color: #fff;
    overflow: hidden;
    background: #5E34B0;
  }
  
  .tbT {
    height: calc(100% - 2.1em);
    background: #5E34B0;
    overflow: hidden;
  }
  
  .tbB {
    height: 2.1em;
    background: #45239E;
    overflow: hidden;
  }
  
  .tbT img {
    height: inherit;
    top: 0.3em;
    margin-left: 0.3em;
    float: left;
    position: relative;
  }
  
  .pN {
    float: right;
    margin-right: 0.6em;
    cursor: pointer;
  }
  
  .pN div {
    float: left;
    margin-left: 0.6em;
    padding-top: 0.3em;
    height: 2em;
    overflow: hidden;
    font-size: 23px;
    letter-spacing: 5px;
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
    margin:3vw 1vw;
    width: 33vw;
    background: #f5f5f5;
  }
  
  .eW {
    height: calc(100% - 6em);
    background: #f5f5f5;
    width: 60vw;
    max-width: unset;
  }
</style>
