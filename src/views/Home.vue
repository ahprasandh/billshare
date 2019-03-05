<template>
  <div class="home">
    <div class="tb">
      <div class="tbT">
        <!-- <img src="../assets/logo.png" /> -->
        <div
          class="pT"
          v-if="date"
          v-text="
            getMonth(date.getMonth() - 1) +
              ' ' +
              date.getFullYear() +
              ' Expense'
          "
        ></div>
      </div>
      <div class="tbB">
        <div class="pN">
          <div>Hi {{ currentUser.displayName }}</div>
          <div class="lo" @click="logout">Logout</div>
        </div>
      </div>
    </div>
    <div class="cW">
      <Person class="uW" :personCollection="personCollection"></Person>
      <Expense
        class="eW"
        :personCollection="personCollection"
        :expenseCollection="expenseCollection"
      ></Expense>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import fb from "../firebaseConfig";
import Person from "@/components/Person.vue";
import Expense from "@/components/Expense.vue";

export default {
  name: "home",
  computed: {
    ...mapState(["currentUser", "isAdmin"])
  },
  components: {
    Person,
    Expense
  },
  mounted() {
    this.init();
  },
  data() {
    return {
      date: null,
      personCollection: [],
      expenseCollection: []
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
      fb.personCollection.orderBy("name", "asc").onSnapshot(querySnapshot => {
        // console.log(querySnapshot)
        var personCollection = [];
        querySnapshot.forEach(doc => {
          let person = doc.data();
          person.id = doc.id;
          person.modified = false;
          personCollection.push(person);
        });
        this.personCollection = personCollection;
      });
      fb.expenseCollection
        .orderBy("createdOn", "desc")
        .onSnapshot(querySnapshot => {
          // console.log(querySnapshot)
          var expenseCollection = [];
          querySnapshot.forEach(doc => {
            let expense = doc.data();
            expense.id = doc.id;
            expenseCollection.push(expense);
          });
          this.expenseCollection = expenseCollection;
        });
      // this.personCollection=[{"createdOn":{"seconds":1551755372,"nanoseconds":440000000},"name":"Hari","photo":null,"expenses":{},"modified":false,"toPay":0,"id":"c1EWlrtEXQURuYc6XNvi"},{"createdOn":{"seconds":1551755412,"nanoseconds":699000000},"name":"Hari 2","photo":null,"expenses":{},"modified":false,"toPay":0,"id":"XO1WQUh6mE3ALI9bhfYF"},{"createdOn":{"seconds":1551755508,"nanoseconds":213000000},"name":"Hari 3","photo":null,"expenses":{},"modified":false,"toPay":0,"id":"Hk8MhHaVI4mmgZCFzNOc"},{"createdOn":{"seconds":1551755511,"nanoseconds":490000000},"name":"Hari 4","photo":null,"expenses":{},"modified":false,"toPay":0,"id":"Dfl2KF4MPMX3tkRGodvc"}]
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
