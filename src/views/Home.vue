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
      <PersonListing class="uW" :personCollection="personCollection" />
      <ExpenseListing class="eW" :personCollection="personCollection" :settings="settings" />
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
        this.initPersons();
      },
      initPersons() {
        // fb.personCollection.orderBy("name", "asc").onSnapshot(querySnapshot => {
        //   // console.log(querySnapshot)
        //   var personCollection = [];
        //   querySnapshot.forEach(doc => {
        //     let person = doc.data();
        //     person.id = doc.id;
        //     person.modified = false;
        //     personCollection.push(person);
        //   });
        //   this.personCollection = personCollection;
        // });
        this.personCollection=[{"createdOn":{"seconds":1551755372,"nanoseconds":440000000},"expenses":{"JUKFvvgzQ19QX6xFCj9P":{"cost":10,"date":{"seconds":1551761945,"nanoseconds":449000000},"id":"JUKFvvgzQ19QX6xFCj9P"}},"name":"Hari","photo":null,"toPay":10,"id":"c1EWlrtEXQURuYc6XNvi","modified":false},{"createdOn":{"seconds":1551755412,"nanoseconds":699000000},"expenses":{"JUKFvvgzQ19QX6xFCj9P":{"cost":45,"date":{"seconds":1551761945,"nanoseconds":452000000},"id":"JUKFvvgzQ19QX6xFCj9P"}},"name":"Hari 2","photo":null,"toPay":45,"id":"XO1WQUh6mE3ALI9bhfYF","modified":false},{"createdOn":{"seconds":1551755508,"nanoseconds":213000000},"expenses":{"JUKFvvgzQ19QX6xFCj9P":{"cost":45,"date":{"seconds":1551761945,"nanoseconds":453000000},"id":"JUKFvvgzQ19QX6xFCj9P"}},"name":"Hari 3","photo":null,"toPay":45,"id":"Hk8MhHaVI4mmgZCFzNOc","modified":false},{"createdOn":{"seconds":1551755511,"nanoseconds":490000000},"expenses":{},"name":"Hari 4","photo":null,"toPay":0,"id":"Dfl2KF4MPMX3tkRGodvc","modified":false},{"createdOn":{"seconds":1551755511,"nanoseconds":490000000},"expenses":{},"name":"Hari 5","photo":null,"toPay":0,"id":"DadsF4MPMX3tkRGodcc","modified":false}]
      },
      deletePeople(id) {
        fb.personCollection
          .doc(id)
          .delete()
          .then(function() {
            alert("Person successfully deleted!");
          })
          .catch(function(error) {
            console.error("Error removing Person: ", error);
          });
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
