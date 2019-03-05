<template>
  <div class="neO" v-if="isAdmin">
    <div class="overB" @click.prevent="goBack()"></div>
    <div class="neW">
      <div class="neT">New Expense</div>
      <div @click="goBack" class="butClose">Cancel</div>
      <div class="neIW">
        <div class="neSeB">
          <div class="neSeT">Bill Information</div>
          <div class="neIr">
            <span class="iL mdtry">Name</span>
            <input type="text" v-model="name" placeholder="Expense Name" />
          </div>
          <div class="neIr">
            <span class="iL mdtry">Amount</span>
            <span class="currency">₹</span>
            <input type="number" v-model.number="cost" placeholder="Expense Amount" />
          </div>
          <div class="neIr">
            <span class="iL">Date</span>
            <input type="date" v-model="date" placeholder="Expense Date" />
          </div>
        </div>
        <div class="exPc">
          <div class="exPcL">
            <div class="exPcT">Billed Persons</div>
            <div class="exPcP" v-for="(person, i) in selectedPersons" :key="person.id">
              <div class="pCont">
                <img class="pPic" src="../assets/guest.svg" />
              </div>
              <div class="pName" v-text="person.name"></div>
              <span class="currency">₹</span>
              <input type="number" v-model.number="person.cost" disabled="disabled" />
              <div class="but" @click="removePerson(person, i)">-</div>
            </div>
          </div>
          <div class="exPcR">
            <div class="exPcT">Available Persons</div>
            <div class="neHt">
              <span>? To autocalculate bill set '0' as cost</span>
            </div>
            <div class="exPcP" v-for="person in availablePersons" :key="person.id">
              <div class="pCont">
                <img class="pPic" src="../assets/guest.svg" />
              </div>
              <div class="pName" v-text="person.name"></div>
              <span class="currency">₹</span>
              <input type="number" v-model.number="person.cost" />
              <div class="but" @click="addPerson(person)">+</div>
            </div>
          </div>
        </div>
      </div>
      <div @click="previewExpense" class="butSB">Preview Expense</div>
      <div @click="addExpense" class="butPB">Add Expense</div>
    </div>
    <div class="err" v-if="error" v-text="error"></div>
  </div>
</template>

<script>
  import {
    mapState
  } from "vuex";
  import fb from "@/firebaseConfig";
  export default {
    name: "ExpenseEditor",
    computed: {
      ...mapState(["isAdmin"])
    },
    props: ["personCollection"],
    data() {
      return {
        name: "",
        cost: null,
        costValidate: false,
        date: null,
        persons: {},
        selectedPersons: [],
        availablePersons: [],
        error: null
      };
    },
    mounted() {
      this.initPersons();
    },
    methods: {
      goBack() {
        this.$parent.show.editor = false;
      },
      initExpense() {
        this.availablePersons = [];
        this.selectedPersons = [];
        this.persons = {};
        this.costValidate = false;
        if (this.name && this.name.trim().length == 0) {
          this.name = "";
        }
        this.date = null;
      },
      initPersons() {
        this.initExpense();
        if (this.personCollection) {
          for (var i = 0; i < this.personCollection.length; i++) {
            var person = this.personCollection[i];
            this.availablePersons.push({
              id: person.id,
              name: person.name,
              cost: 0
            });
          }
        }
      },
      addExpense() {
        if (
          this.name &&
          this.name.trim().length > 0 &&
          this.cost > 0 &&
          this.costValidate
        ) {
          var expense = {
            createdOn: new Date(),
            name: this.name,
            cost: this.cost,
            date: this.date ? new Date(this.date) : null,
            persons: this.persons,
            id: "TEMP"
          };
          fb.expenseCollection
            .add(expense)
            .then(ref => {
              expense.id = ref.id;
              for (var id in expense.persons) {
                for (var i = 0; i < this.personCollection.length; i++) {
                  if (id === this.personCollection[i].id) {
                    this.personCollection[i].expenses[expense.id] = {
                      cost: expense.persons[id].cost,
                      id: expense.id,
                      date: new Date(),
                      name: expense.name
                    };
                    var toPay = 0;
                    for (var bill in this.personCollection[i].expenses) {
                      toPay += this.personCollection[i].expenses[bill].cost;
                    }
                    fb.personCollection
                      .doc(id)
                      .set({
                        expenses: this.personCollection[i].expenses,
                        toPay: toPay,
                        paid: false
                      }, {
                        merge: true
                      })
                      .then(function() {
                        console.log("Person successfully updated!");
                      })
                      .catch(function(error) {
                        console.error("Error writing document: ", error);
                      });
                  }
                }
                this.$parent.expenseAdded();
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else if (!this.costValidate) {
          this.showError("Billed Person Amount Invalid");
        } else {
          this.showError("Invalid Bill");
        }
      },
      previewExpense() {
        if (
          this.name &&
          this.name.trim().length > 0 &&
          this.cost > 0 &&
          this.costValidate
        ) {
          var expense = {
            createdOn: new Date(),
            name: this.name,
            cost: this.cost,
            date: this.date ? new Date(this.date) : null,
            persons: this.persons
          };
  
          for (var id in expense.persons) {
            for (var i = 0; i < this.personCollection.length; i++) {
              if (id === this.personCollection[i].id) {
                this.personCollection[i].expenses["<TEMP>"] = {
                  cost: expense.persons[id].cost,
                  id: "<TEMP>"
                };
                this.personCollection[i].modify = {
                  mode: "add",
                  toPay: this.personCollection[i].toPay + expense.persons[id].cost,
                  change: expense.persons[id].cost
                };
                this.personCollection[i].modified = true;
              }
            }
            // console.log(JSON.stringify(this.personCollection));
          }
        } else if (!this.costValidate) {
          this.showError("Billed Person Amount Invalid");
        } else {
          this.showError("Invalid Bill");
        }
      },
      showError(message) {
        this.error = message;
        setTimeout(this.hideError, 2000);
      },
      hideError() {
        this.error = null;
      },
      addPerson(person, i) {
        if (!this.persons[person.id]) {
          if (person.cost < this.cost) {
            this.persons[person.id] = person.name;
            this.selectedPersons.push({
              id: person.id,
              name: person.name,
              cost: person.cost,
              omitSplit: person.cost > 0
            });
            this.availablePersons.splice(i, 1);
            this.recalculateSplit();
          } else {
            this.showError(
              "Individual Cost must be less than total bill cost to share bill"
            );
          }
        }
      },
      recalculateSplit() {
        var count = 0;
        var omitTotal = 0;
        this.selectedPersons.forEach(function(person) {
          person.omitSplit ? (omitTotal += person.cost) : count++;
        });
        var splitCost = (this.cost - omitTotal) / count;
        var checkCost = 0;
        for (var i = 0; i < this.selectedPersons.length; i++) {
          if (!this.selectedPersons[i].omitSplit) {
            this.selectedPersons[i].cost = splitCost;
          }
          checkCost += this.selectedPersons[i].cost;
          this.persons[this.selectedPersons[i].id] = this.selectedPersons[i];
        }
        this.costValidate = checkCost === this.cost;
      },
      removePerson(person, i) {
        if (this.persons[person.id]) {
          delete this.persons[person.id];
          this.availablePersons.push({
            id: person.id,
            name: person.name
          });
          this.selectedPersons.splice(i, 1);
          this.recalculateSplit();
        }
      },
      costReset(value) {
        this.split.amount = value;
      }
    },
    watch: {
      personCollection: function() {
        this.initPersons();
      },
      cost: function() {
        this.initPersons();
      }
    }
  };
</script>
