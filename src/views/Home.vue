<template>
  <div class="home">
    <div class="tb">
      <div class="tbT">
        <div class="pT" v-if="date" v-text="getTitle"></div>
      </div>
      <div class="tbB">
        <div class="pN">
          <div><i class="bs-user"></i>Hi {{ currentUser.displayName }}</div>
          <div class="lo" @click="logout">Logout</div>
        </div>
      </div>
    </div>
    <div class="cW">
      <PersonListing class="uW" />
      <ExpenseListing class="eW" :settings="settings" />
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
  
  export default {
    name: "home",
    computed: {
      ...mapState(["currentUser", "isAdmin"]),
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
      ExpenseListing
    },
    mounted() {
      this.init();
    },
    data() {
      return {
        date: null,
        personCollection: [],
        settings:{show:{help:false},currency:"₹"}
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
        // this.initExpenses();
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
