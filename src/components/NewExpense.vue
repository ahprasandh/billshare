<template>
  <div v-if="isAdmin">
    <input type="text" v-model="name" placeholder="Expense Name" />
    <input type="number" v-model="cost" placeholder="Expense Amount" />
    <div class="exPc">
      <div class="exPcL">
        <div class="exPcT">Billed Persons</div>
        <div class="exPcP" v-for="(person, i) in selectedPersons">
          <div class="pCont">
            <img class="pPic" src="../assets/guest.svg" />
          </div>
          <div class="pName" v-text="person.name"></div>
          <span class="currency">₹</span>
          <input type="number" v-model="person.cost" disabled="disabled" />
          <div class="but" @click="removePerson(person, i)">-</div>
        </div>
      </div>
      <div class="exPcR">
        <div class="exPcT">Available Persons</div>
        <div class="exPcP" v-for="(person, i) in availablePersons">
          <div class="pCont">
            <img class="pPic" src="../assets/guest.svg" />
          </div>
          <div class="pName" v-text="person.name"></div>
          <span class="currency">₹</span>
          <input type="number" v-model="person.cost" />
          <div class="but" @click="addPerson(person)">+</div>
        </div>
      </div>
    </div>
    <button @click="addExpense">Add Expense</button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import fb from "../firebaseConfig";
export default {
  name: "ExpenseEditor",
  computed: {
    ...mapState(["isAdmin"])
  },
  props: ["personsCollection"],
  data() {
    return {
      name: "",
      cost: 0,
      split: {
        amount: 0,
        count: 0
      },
      date: null,
      persons: {},
      selectedPersons: [],
      availablePersons: []
    };
  },
  methods: {
    initPersons() {
      if (this.personsCollection) {
        for (var i = 0; i < this.personsCollection.length; i++) {
          var person = this.personsCollection[i];
          this.availablePersons.push({
            id: person.id,
            name: person.name
          });
        }
      }
    },
    addExpense() {
      if (this.name && this.name.trim().length > 1) {
        var expense = {
          createdOn: new Date(),
          name: this.name
        };
        // fb.expenseCollection.add(expense).then(ref => {
        //   this.$parent.init();
        // }).catch(err => {
        //   console.log(err)
        // });
      }
    },
    addPerson(person, i) {
      if (!this.persons[person.id]) {
        this.persons[person.id] = person.name;
        this.selectedPersons.push({
          id: person.id,
          name: person.name
        });
        this.availablePersons.splice(i, 1);
        this.split.count = this.selectedPersons.length;
      }
    },
    removePerson(person, i) {
      if (this.persons[person.id]) {
        delete this.persons[person.id];
        this.availablePersons.push({
          id: person.id,
          name: person.name
        });
        this.selectedPersons.splice(i, 1);
      }
    },
    costReset(value) {
      this.split.amount = value;
    }
  },
  watch: {
    personsCollection: function() {
      this.initPersons();
    },
    cost: function(value) {
      this.costReset(value);
    }
  }
};
</script>
