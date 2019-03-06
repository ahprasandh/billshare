<template>
  <div :id="'expense_' + expense.id" class="billC">
    <div class="neW" v-bind:class="{ expanded: expand }">
      <div class="err" v-if="error">
        <div v-text="error"></div>
      </div>
      <div class="eWHead" @click="expandExpense(expense)" v-bind:class="{ edit: mode !=='view', expanded: expand }">
        <div class="eWHeadLeft">
          <input @click.stop="noAct" v-if="mode !== 'view'" type="text" v-model="name" placeholder="Enter Name" />
          <span :id="'expenseName_' + expense.id" v-else v-text="expense.name" />
          <div v-if="checkTemp" class="neHt">
            <span>Not Saved</span>
          </div>
        </div>
        <div class="eWHeadRight" v-bind:class="{ expanded: expand }">
          <span v-if="mode==='view'" @click.stop="mode='edit';expand=true">Edit</span>
          <input @click.stop="noAct" v-if="mode !== 'view'" type="date" v-model="date" placeholder="Enter Date" />
          <span v-else-if="expense.date" v-text="expense.date" />
          <span v-if="!expand" class="currency">₹</span>
          <input @click.stop="noAct" v-if="mode !== 'view' && expand" type="number" v-model.number="cost" placeholder="Enter Amount" />
          <span v-else-if="!expand" v-text="expense.cost" />
        </div>
      </div>
      <div class="exPc" v-if="mode !== 'view'" v-bind:class="{ expanded: expand }">
        <div class="exPcTab">
          <div class="exPcL">
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
          <div class="exPcR">
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
        </div>
        <div class="exTot" :id="'expenseTot_' + expense.id" v-if="mode === 'view'">
          <div>Total</div>
          <div>
            <span class="currency">₹</span>
            <input type="number" v-model.number="cost" placeholder="Enter Amount" />
          </div>
        </div>
        <div v-if="expand && mode !== 'view'" @click="previewExpense" class="butSB">
          Preview Expense
        </div>
        <div v-if="expand && mode !== 'view'" @click="addExpense" class="butPB">
          Add Expense
        </div>
      </div>
      <div class="exPc" v-if="mode === 'view'" v-bind:class="{ expanded: expand }">
        <div class="exPe">
          <!-- {{expense.persons}} -->
          <div class="exPeC" v-for="person in expense.persons" :key="person.id">
            <div class="exPeCRight">
              <div>
                <img v-if="person.photo" class="pPic" src="../assets/guest.svg" />
                <img v-else class="pPic" src="../assets/guest.svg" />
                <span v-text="person.name"></span>
              </div>
              <div class="m45">
                  <span class="currency">₹</span>
                  <span v-text="person.cost"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="exTot" :id="'expenseTot_' + expense.id" v-if="mode === 'view'">
          <div>Total</div>
          <div>
            <span class="currency">₹</span>
            <span v-text="expense.cost" />
          </div>
        </div>
      </div>
    </div>
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
      ...mapState(["isAdmin"]),
      checkTemp: function() {
        return this.expense && this.expense.id.indexOf("TEMP") === 0 && this.mode == "view";
      }
    },
    props: ["personCollection", "expense", "expenseIteration", "expand"],
    data() {
      return {
        name: "",
        cost: null,
        costValidate: false,
        date: null,
        persons: {},
        selectedPersons: [],
        availablePersons: [],
        error: null,
        mode: "view",
        edit: false
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        if (this.expense && this.expense.id && this.expense.id === "new") {
          this.mode = "add";
        } else if (this.expense && this.expense.id) {
          this.mode = this.edit ? "edit" : "view";
        } else {
          this.mode = "view"
        }
        // this.mode = this.expense && this.expense.id ? (this.edit ? "edit" : "view") : "add";
        this.initPersons();
      },
      expandExpense(expense) {
        if (!this.expand) {
          this.$parent.expandFromChild(expense.id);
        } else if (expense.id !== "new") {
          let query = Object.assign({}, this.$route.query);
          delete query.expense;
          this.$router.push({
            query
          });
          this.expand = false;
        } else {
          expense.id = "TEMP_" + Math.random();
          this.expand = false
        }
      },
      noAct() {
  
      },
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
          // fb.expenseCollection
          //   .add(expense)
          //   .then(ref => {
          //     expense.id = ref.id;
          //     for (var id in expense.persons) {
          //       for (var i = 0; i < this.personCollection.length; i++) {
          //         if (id === this.personCollection[i].id) {
          //           this.personCollection[i].expenses[expense.id] = {
          //             cost: expense.persons[id].cost,
          //             id: expense.id,
          //             date: new Date(),
          //             name: expense.name
          //           };
          //           var toPay = 0;
          //           for (var bill in this.personCollection[i].expenses) {
          //             toPay += this.personCollection[i].expenses[bill].cost;
          //           }
          //           fb.personCollection
          //             .doc(id)
          //             .set({
          //               expenses: this.personCollection[i].expenses,
          //               toPay: toPay,
          //               paid: false
          //             }, {
          //               merge: true
          //             })
          //             .then(function() {
          //               console.log("Person successfully updated!");
          //             })
          //             .catch(function(error) {
          //               console.error("Error writing document: ", error);
          //             });
          //         }
          //       }
          //       this.$parent.expenseAdded();
          //     }
          //   })
          //   .catch(err => {
          //     console.log(err);
          //   });
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
          } else if (this.cost == undefined || this.cost === 0) {
            this.showError(
              "Expense Cost Cannot be Zero"
            );
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
            name: person.name,
            cost: 0
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

<style>
  .billC {
    position: relative;
    margin: 25px 10px;
    background: #fff;
    box-shadow: 2px 1px 5px -4px rgba(0, 0, 0, 0.75);
  }
  
  .neW {
    max-height: 50px;
    cursor: pointer;
    transition: max-height 0.25s ease-out;
    overflow: hidden;
  }
  
  .neW.expanded {
    max-height: 500px;
    transition: max-height 0.25s ease-in;
  }
  
  .billC:before {
    top: -10px !important;
    background-position: 0 -22px !important;
    content: "";
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    height: 10px;
    background: linear-gradient( 45deg, transparent 33.333%, #fff 33.333%, #fff 66.667%, transparent 66.667%), linear-gradient( -45deg, transparent 33.333%, #fff 33.333%, #fff 66.667%, transparent 66.667%);
    background-size: 8px 20px;
  }
  
  .eWHead {
    height: 20px;
    margin: 10px 20px;
    padding: 10px 20px;
    color: #2c3e50;
    font-size: 20px;
  }
  
  .eWHead.edit {
    margin: 10px 20px;
    padding: 20px;
    border-bottom: 1px solid #e4e2e2;
  }
  
  .eWHead input {
    font-size: 20px;
    background: #e3e2e4;
    border: 1px solid #c7c6c6;
  }
  
  .eWHead.expanded {
    border-bottom: 1px solid #eaeaea;
  }
  
  .eWHeadLeft {
    float: left;
  }
  
  .eWHeadRight {
    float: right;
  }
  
  .eWHeadRight span {
    padding-left: 5px;
  }
  
  .eWHeadRight span:first-of-type {
    margin-right: 30px;
  }
  
  .eWHeadRight.expanded span:first-of-type {
    margin-right: 0px;
  }
  
  .currency {
    color: #6f6c6c;
    padding-left: 5px;
    font-size: 15px;
  }
  
  .neHt {
    text-align: center;
  }
  
  .neHt span {
    text-align: center;
    background: #dedbdb;
    margin: 0 auto;
    border-radius: 4px;
    padding: 1px 5px;
    font-size: 20px;
    color: #868585;
  }
  
  .neBut {
    background: #ff4081;
    position: absolute;
    right: 10px;
    bottom: 10px;
    font-size: 20px;
    color: #fff;
    padding: 10px 15px;
    border-radius: 20px;
    cursor: pointer;
  }
  
  .exPc {
    margin: 10px 20px;
    border-radius: 5px;
    height: 100%;
    width: calc(100% - 40px);
    overflow: auto;
    max-height: 250px;
    display: table;
    visibility: hidden;
  }
  
  .exPc.expanded {
    visibility: visible;
  }
  
  .exPcTab {}
  
  .exPe {
    margin: 10px;
    overflow: auto;
  }
  
  .exPeC {
    width: 100%;
    font-size: 20px;
    color: #6f6f6f;
    display: inline-block;
  }
  
  .exPeCRight {
    float: right;
  }

  .exPeCRight div{
    float: left;
  }

  .exPeCRight div img{
    float: left;
  }

  .exPeCRight div span{
    float: left;
    padding-top: 10px;
  }
  
  .m45 {
    margin-left: 45px;
  }
  
  .exPcL,
  .exPcR {
    height: 100%;
    display: table-cell;
    width: 50%;
    position: relative;
  }
  
  .exPcR {
    width: calc(50% - 1px);
    border-left: 1px solid #f1f1f1;
  }
  
  .exPcT {
    padding: 10px 10px;
    text-align: center;
    color: #5d5d5d;
    font-size: 25px;
  }
  
  .exPcP {
    height: 100%;
    width: calc(100% - 30px);
    border-radius: 7px;
    margin: 15px 15px;
    -webkit-box-shadow: 1px 1px 10px 2px rgba(202, 202, 202, 0.34);
    -moz-box-shadow: 1px 1px 10px 2px rgba(202, 202, 202, 0.34);
    box-shadow: 1px 1px 10px 2px rgba(202, 202, 202, 0.34);
    display: inline-block;
  }
  
  .exPcP * {
    float: left;
    margin: 5px 5px 0 0;
    padding: 5px;
  }
  
  .exPcP input {
    max-width: 70px;
  }
  
  .exPcP .but {
    border-radius: 20px;
    background: #ff8a80;
    width: 20px;
    height: 18px;
    color: #fff;
    text-align: center;
    cursor: pointer;
    position: absolute;
    right: 0;
    padding-top: 7px;
  }
  
  .exPcR .but {
    background: #64dd17;
  }
  
  .exPcP .pCont {
    margin: 0;
    padding: 0;
    background: #f1f1f1;
  }
  
  .butPB,
  .butSB {
    background: #5e2fb4;
    position: absolute;
    padding: 10px;
    text-align: center;
    border-radius: 4px;
    color: #fff;
    text-transform: uppercase;
    right: 10px;
    bottom: 10px;
    font-size: 12px;
    cursor: pointer;
    box-shadow: 0px 1px 5px 2px rgba(103, 58, 183, 0.5);
  }
  
  .butSB {
    right: 130px;
    background: #fff;
    color: #5e2fb4;
    box-shadow: unset;
  }
  
  .exTot {
    bottom: 0;
    left: 0;
    border-top: 1px solid #eaeaea;
    margin: 10px 0;
  }
  
  .exTot div:first-of-type {
    float: left;
    margin-left: 20px;
  }
  
  .exTot div {
    float: right;
    font-size: 20px;
    margin-top: 10px;
  }
  
  .exTot div:last-of-type {
    margin-right: 10px;
  }
</style>
