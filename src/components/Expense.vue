<template>
  <div :id="'expense_' + expense.id" class="billC">
    <div class="neW" v-bind:class="{ expanded: expand }">
      <div class="err" v-if="error">
        <div v-text="error"></div>
      </div>
      <div class="eWHead" @click="expandExpense(expense)" v-bind:class="{ edit: mode !=='view', expanded: expand }">
        <div class="eWHeadLeft">
          <input @click.stop="noAct" v-if="mode !== 'view'" type="text" v-model="name" placeholder="Enter Name" />
          <span :id="'expenseName_' + expense.id" v-else v-text="this.name" />
          <i v-if="mode==='view'" @click="editClick($event)" class="bs-edit"></i>
          <i v-if="mode==='view'" @click.stop="mode='edit';expand=true" class="bs-delete"></i>
          <div v-if="checkTemp" class="neHt">
            <span class="bs-save"> Not Saved</span>
          </div>
        </div>
        <div class="eWHeadRight" v-bind:class="{ expanded: expand }">
          <input @click.stop="noAct" v-if="mode !== 'view'" type="date" v-model="date" placeholder="Enter Date" />
          <span v-else-if="this.date" v-text="this.date" />
          <span v-if="!expand || mode!=='view'" class="currency" v-text="settings.currency"></span>
          <input @click.stop="noAct" v-if="mode !== 'view' && expand" type="number" v-model.number="cost" placeholder="Enter Amount" />
          <span v-else-if="!expand" v-text="this.cost" />
        </div>
      </div>
      <div class="exPc" v-if="mode !== 'view'" v-bind:class="{ expanded: expand }">
        <div v-if="settings && settings.show.help">
          <div class="neHt">
            <span class="bs-help">Add Persons to Billed Persons from Available Persons to split the bill amount</span>
          </div>
          <div class="neHt">
            <span class="bs-help"> To auto calculate bill set '0' as cost</span>
          </div>
        </div>
        <div class="exPcTitle">
          <div class="exPcL">
            <div class="exPcT">Available Persons</div>
          </div>
          <div class="exPcR">
            <div class="exPcT">Billed Persons</div>
          </div>
        </div>
        <div class="exPcTab">
          <div class="exPcL">
            <div class="exPcP" v-for="(person,i) in availablePersons" :key="person.id">
              <div class="pCont">
                <img class="pPic" src="../assets/guest.svg" />
              </div>
              <div class="pName" v-text="person.name"></div>
              <span class="currency" v-text="settings.currency"></span>
              <input type="number" v-model.number="person.cost" />
              <div class="but bs-add" @click="addPerson(person, i)"></div>
            </div>
          </div>
          <div class="exPcR">
  
            <div class="exPcP" v-for="(person, i) in selectedPersons" :key="person.id">
              <div class="pCont">
                <img class="pPic" src="../assets/guest.svg" />
              </div>
              <div class="pName" v-text="person.name"></div>
              <span class="currency" v-text="settings.currency"></span>
              <input type="number" v-model.number="person.cost" disabled="disabled" />
              <div class="but bs-minus" @click="removePerson(person, i)"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="exPc" v-if="mode === 'view'" v-bind:class="{ expanded: expand }">
        <div class="exPe">
          <div class="exPeC" v-for="person in expense.persons" :key="person.id">
            <div class="exPeCRight">
              <div>
                <img v-if="person.photo" class="pPic" src="../assets/guest.svg" />
                <img v-else class="pPic" src="../assets/guest.svg" />
                <span v-text="person.name"></span>
              </div>
              <div class="m45">
                <span class="currency" v-text="settings.currency"></span>
                <span v-text="person.cost"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="exTot" :id="'expenseTot_' + expense.id">
        <div>Total</div>
        <div v-if="expand && mode !== 'view'" @click="addExpense" class="butPB">
          <i class="bs-save"></i> Add Expense
        </div>
        <div v-if="expand && mode !== 'view'" @click="previewExpense" class="butSB">
          <i class="bs-preview"></i> Preview Expense
        </div>
  
        <div>
          <span class="currency" v-text="settings.currency"></span>
          <span v-text="this.cost" />
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
      ...mapState(["isAdmin","personCollection"]),
      checkTemp: function() {
        return this.expense && this.expense.id.indexOf("TEMP") === 0 && this.mode == "view";
      }
    },
    props: ["expense", "expenseIteration", "expand", "settings"],
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
        } else {
          this.expense.id = "TEMP_" + Math.random();
          if (this.name && this.name == "") {
            this.name = "Unnamed";
          }
          this.expense.name = this.name;
          this.expense.persons = {}
  
          if (this.$route.query.expense === "new") {
            let query = Object.assign({}, this.$route.query);
            delete query.expense;
            this.$router.push({
              query
            });
          }
          // this.expand = false
        }
      },
      editClick(event) {
        this.edit = true;
        this.mode = "edit";
        if (this.expand) {
          event.stopPropagation();
        }
        // this.$parent.expandFromChild(this.expense.id);
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
          if (this.personCollection.length != this.availablePersons.length) {
            for (var i = 0; i < this.personCollection.length; i++) {
              var person = this.personCollection[i];
              this.availablePersons.push({
                id: person.id,
                name: person.name,
                cost: 0
              });
            }
            if (this.expense.id && this.expense.id !== "new" && this.mode !== "edit") {
              this.initData();
            }
          }
        }
      },
      initData() {
        this.name = this.expense.name
        this.cost = this.expense.cost
        this.date = this.expense.date
        var avpCopy = JSON.parse(JSON.stringify(this.availablePersons))
        var i = this.availablePersons.length
        while (i--) {
          if (this.expense.persons[this.availablePersons[i].id]) {
            this.addPerson(this.expense.persons[this.availablePersons[i].id], i, true)
          }
        }
        this.recalculateSplit();
      },
  
      addExpense() {
        if (this.name && this.name.trim().length > 0 && this.cost > 0 && this.costValidate) {
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
        if (this.name && this.name.trim().length > 0 && this.cost > 0 && this.costValidate) {
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
            this.$store.commit("setPersonCollection", this.personCollection);
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
      addPerson(person, i, pushPerson) {
        if (!this.persons[person.id]) {
          if (person.cost < this.cost) {
            this.persons[person.id] = person.id;
            if (pushPerson) {
              this.selectedPersons.push(person);
            } else {
              this.selectedPersons.push({
                id: person.id,
                name: person.name,
                cost: person.cost,
                omitSplit: person.cost > 0
              });
            }
            this.availablePersons.splice(i, 1);
            if (!pushPerson) {
              this.recalculateSplit();
            }
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
      },
      expand: function() {
        if (!this.expand) {
          console.log('gggg')
          this.mode = "view";
        }
      }
    }
  };
</script>

<style>
  .billC {
    position: relative;
    margin: 1.5em 0.6em;
    background: #fff;
    box-shadow: 0.12em 0.06em 0.3em -0.24em rgba(0, 0, 0, 0.75);
  }
  
  .neW {
    max-height: 3em;
    cursor: pointer;
    transition: max-height 0.25s ease-out;
    overflow: hidden;
  }
  
  .neW.expanded {
    max-height: 30em;
    transition: max-height 0.25s ease-in;
  }
  
  .billC:before {
    top: -0.6em !important;
    background-position: 0 -1.32em !important;
    content: "";
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    height: 0.6em;
    background: linear-gradient( 45deg, transparent 33.333%, #fff 33.333%, #fff 66.667%, transparent 66.667%), linear-gradient( -45deg, transparent 33.333%, #fff 33.333%, #fff 66.667%, transparent 66.667%);
    background-size: 0.48em 1.2em;
  }
  
  .eWHead {
    overflow:auto;
    margin: 0.6em 1.2em;
    padding: 0.6em 1.2em;
    color: #2c3e50;
    font-size: 1.2em;
  }
  
  .eWHead i {
    opacity: 0;
    margin-left: 1.2em;
  }
  
  .eWHead:hover.eWHead i {
    color: #ccc;
    opacity: 1;
  }
  
  .eWHead i.bs-edit:hover {
    color: #2196F3!important;
  }
  
  .eWHead i.bs-delete:hover {
    color: #F44336!important;
  }
  
  .eWHead.edit {
    margin: 0.6em 1.2em;
    padding: 0.6em;
    border-bottom: 0.06em solid #e4e2e2;
  }
  
  .eWHead input {
    font-size: 1.2em;
    background: #e3e2e4;
    max-width: 35vw;
    border: 0.06em solid #c7c6c6;
  }
  
  .eWHead.expanded {
    border-bottom: 0.06em solid #eaeaea;
  }
  
  .eWHeadLeft {
    float: left;
  }
  
  .eWHeadLeft * {
    float: left;
  }
  
  .eWHeadRight {
    float: right;
  }
  
  .eWHeadRight span {
    padding-left: 0.3em;
  }
  
  .eWHeadRight span:first-of-type {
    margin-right: 1.8em;
  }
  
  .eWHeadRight.expanded span:first-of-type {
    margin-right: 0;
  }
  
  .currency {
    color: #6f6c6c;
    padding-right: 0.3em!important;
    font-size: 0.9em;
  }
  
  .neHt {
    text-align: center;
    margin: 0.6em;
  }
  
  .neHt span {
    text-align: center;
    background: #dedbdb;
    margin: 0 auto;
    border-radius: 0.24em;
    padding: 0.3em;
    font-size: 0.72em;
    color: #868585;
    font-family: Arial;
  }
  
  .eWHeadLeft .neHt {
    margin: 0 0.6em;
  }
  
  .exPc {
    margin: 0.6em 1.2em;
    border-radius: 0.3em;
    height: 100%;
    width: calc(100% - 2.4em);
    overflow: hidden;
    max-height: 15em;
    visibility: hidden;
  }
  
  .exPc.expanded {
    visibility: visible;
  }
  
  .exPcTab {
    width: 100%;
}
.exPcTitle{
    height: 5vh;
}

.exPcTab:nth-of-type(2){
    max-height: 12em;
    overflow: auto;
}
  
  .exPe {
    margin: 0.6em;
    overflow: auto;
  }
  
  .exPeC {
    width: 100%;
    font-size: 1.2em;
    color: #6f6f6f;
    display: inline-block;
  }
  
  .exPeCRight {
    float: right;
  }
  
  .exPeCRight div {
    float: left;
  }
  
  .exPeCRight div img {
    float: left;
  }
  
  .exPeCRight div span {
    float: left;
    padding-top: 0.6em;
  }
  
  .m45 {
    margin-left: 2.7em;
  }

  .exPcTitle .exPcL,.exPcTitle .exPcR {
    float: left;
    width: 50%;
}
  
  .exPcTab .exPcL,.exPcTab .exPcR {
    height: 100%;
    display: table-cell;
    width: 50%;
    position: relative;
  }
  
  .exPcTab .exPcR {
    width: calc(50% - 0.06em);
    border-left: 0.06em solid #f1f1f1;
  }
  
  .exPcT {
    padding: 0.6em 1.2em;
    text-align: center;
    color: #5d5d5d;
    font-size: 1.5em;
  }
  
  .exPcP {
    height: 3em;
    width: calc(100% - 1.8em);
    border-radius: 0.42em;
    margin: 0.9em 0.9em;
    -webkit-box-shadow: 0.06em 0.06em 1.2em 0.12em rgba(202, 202, 202, 0.34);
    -moz-box-shadow: 0.06em 0.06em 1.2em 0.12em rgba(202, 202, 202, 0.34);
    box-shadow: 0.06em 0.06em 1.2em 0.12em rgba(202, 202, 202, 0.34);
    display: inline-block;
    overflow: hidden;
  }
  
  .exPcP * {
    float: left;
    height: 100%;
    padding: 0.3em 0.3em;
    margin: 0.3em 0;
    font-size: 1.5em;
  }

  .exPcP .currency{
    font-size: 1.3em;
    padding-top: 0.7em;
}
  
  .exPcP input {
    max-width: 4.2em;
  }
  .exPcP input[type=number]{
    padding: 0;
    font-size: 1.2em;
  }
  
  .exPcP .but {
    border-radius: 1.2em;
    background: #64dd17;
    width: 1.2em;
    height: 1.08em;
    color: #fff;
    text-align: center;
    cursor: pointer;
    position: absolute;
    right: 0;
    padding-top: 0.42em;
  }
  
  .exPcR .but {
    background: #ff8a80;
  }
  
  .exPcP .pCont {
    margin: 0;
    padding: 0;
    background: #f1f1f1;
    height: 100%;
    width: 50px;
    overflow: hidden;
  }
  
  .butPB,
  .butSB {
    background: #5e2fb4;
    padding: 0.6em;
    text-align: center;
    border-radius: 0.24em;
    color: #fff;
    text-transform: uppercase;
    right: 1.2em;
    bottom: 1.2em;
    font-size: 0.72em!important;
    cursor: pointer;
    box-shadow: 0em 0.06em 0.3em 0.12em rgba(103, 58, 183, 0.5);
  }
  
  .butSB {
    right: 7.8em;
    background: #fff;
    color: #5e2fb4;
    box-shadow: unset;
  }
  
  .exTot {
    bottom: 0;
    left: 0;
    border-top: 0.06em solid #eaeaea;
    margin: 1.2em 1.8em;
  }
  
  .exTot div:first-of-type {
    float: left;
    margin-left: 1.2em;
  }
  
  .exTot div {
    float: right;
    font-size: 1.2em;
    margin: 0.6em;
  }
  
  .exTot div:last-of-type {
    margin-right: 0.6em;
  }
</style>
