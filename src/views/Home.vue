<template>
  <div class="home">
    <div class="tb">
      <div class="tbT">
        <!-- <img src="../assets/logo.png" /> -->
        <div class="pT">Expense Share</div>
      </div>
      <div class="tbB">
        <div class="pN">
          <div>Hi {{ currentUser.displayName }}</div>
          <div class="lo" @click="logout">Logout</div>
        </div>
      </div>
    </div>
    <div class="cW">
      <div v-if="personCollection.length == 0">No Persons Added</div>
      <div class="uW">
        <div v-for="person in personCollection">
          <div v-text="person.name"></div>
          <div v-if="isAdmin" @click="deletePeople(person.id)">&times;</div>
        </div>
        <NewPerson v-if="isAdmin"></NewPerson>
      </div>
      <div class="eW">
        <NewExpense
          v-if="isAdmin"
          :personsCollection="personCollection"
        ></NewExpense>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import fb from "../firebaseConfig";
import NewPerson from "@/components/NewPerson.vue";
import NewExpense from "@/components/NewExpense.vue";

export default {
  name: "home",
  computed: {
    ...mapState(["currentUser", "isAdmin"])
  },
  components: {
    NewPerson,
    NewExpense
  },
  mounted() {
    this.init();
  },
  data() {
    return {
      personCollection: []
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
      // fb.personCollection.orderBy('name', 'desc').onSnapshot(querySnapshot => {
      //   // console.log(querySnapshot)
      //   var personCollection = [];
      //   querySnapshot.forEach(doc => {
      //     let person = doc.data()
      //     person.id = doc.id
      //     personCollection.push(person)
      //   });
      //   this.personCollection = personCollection;
      // });
      this.personCollection = [
        {
          createdOn: {
            seconds: 1551631222,
            nanoseconds: 527000000
          },
          name: "Hari",
          photo: null,
          id: "jljVdu5aKMZs68OFVZlK",
          paid: false,
          expenses: {}
        },
        {
          createdOn: {
            seconds: 1551631222,
            nanoseconds: 527000000
          },
          name: "Hari2",
          photo: null,
          id: "jljVdu5a1MZs68OFVZlK",
          paid: false,
          expenses: {}
        }
      ];
    },
    deletePeople(id) {
      fb.personCollection
        .doc(id)
        .delete()
        .then(function() {
          alert("Document successfully deleted!");
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });
    }
  }
};
</script>
