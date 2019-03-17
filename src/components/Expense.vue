<template>
  <div :id="'expense_' + expense.id" class="billC">
    <div class="neW" v-bind:class="{ expanded: expand }">
      <div class="err" v-if="error">
        <span v-text="error"></span>
      </div>
      <div
        class="listHead"
        @click="expandExpense(expense)"
        v-bind:class="{ edit: mode !== 'view', expanded: expand }"
      >
        <div class="listLeft">
          <input
            @click.stop="noAct"
            v-if="mode !== 'view'"
            type="text"
            v-model="name"
            placeholder="Enter Name"
          />
          <span :id="'expenseName_' + expense.id" v-else v-text="this.name" />
          <i
            title="Edit Expense"
            v-if="mode === 'view' && isAdmin"
            @click="editClick($event)"
            class="bs-edit"
          ></i>
          <i
            title="Move to Trash"
            v-if="mode === 'view' && isAdmin"
            @click.stop="deleteExpense"
            class="bs-delete"
          ></i>
          <div v-if="checkTemp" class="neHt">
            <span class="bs-save"> Not Saved</span>
          </div>
        </div>
        <div
          class="listRight"
          v-if="mode === 'view'"
          v-bind:class="{ expanded: expand }"
        >
          <span v-text="this.date" />
          <span v-if="!expand">
            <span v-text="settings.currency" />
            <span v-text="this.cost" />
          </span>
        </div>
        <div class="listRight" v-else-if="expand">
          <input
            @click.stop="noAct"
            v-if="mode !== 'view'"
            type="date"
            v-model="date"
            placeholder="Enter Date"
          />
          <div class="mL2">
            <div class="currency" v-text="settings.currency" />
            <input
              @click.stop="noAct"
              type="number"
              v-model.number="cost"
              placeholder="Enter Amount"
              size="1"
            />
          </div>
        </div>
      </div>
      <div
        class="listDetailsC"
        v-if="mode !== 'view' && isAdmin"
        v-bind:class="{ expanded: expand }"
      >
        <div class="exPcTitle">
          <div class="exPcL" v-bind:class="{ search: search.show }">
            <span class="exPcT">Select Persons to include in expense</span>
            <input class="searchI" type="text" v-model.trim="search.text" />
            <i class="bs-search" @click="search.show = !search.show"></i>
          </div>
          <div class="exPcR">
            <span class="exPcT">Billed Persons</span>
          </div>
        </div>
        <div class="exPcTab">
          <div class="exPcL">
            <div class="exPcPW" v-bind:class="{ help: settings.show.help }">
              <div
                class="exPcP"
                v-for="(person, i) in availablePersons"
                :key="person.id"
                @click="addPerson(person, i)"
                v-show="person.name.toLowerCase().indexOf(search.text) != -1"
              >
                <Photo
                  :photo="photos[person.id]"
                  :showAsGuest="settings.show.guestImage"
                  :text="person.name"
                />
                <div class="pName" v-text="person.name"></div>
                <i class="but bs-add"></i>
              </div>
            </div>
          </div>
          <div class="exPcR">
            <div class="exPcPW" v-bind:class="{ help: settings.show.help }">
              <div
                class="exPcP"
                v-for="(person, i) in selectedPersons"
                :key="person.id"
              >
                <Photo
                  :photo="photos[person.id]"
                  :showAsGuest="settings.show.guestImage"
                  :text="person.name"
                />
                <div class="pName" v-text="person.name"></div>
                <div class="mL2 dF">
                  <span class="currency" v-text="settings.currency"></span>
                  <input
                    type="number"
                    v-model.number="person.cost"
                    @change="
                      person.omitSplit = true;
                      recalculateSplit();
                    "
                  />
                </div>
                <div
                  class="but bs-minus"
                  @click="removePerson(person, i)"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="listDetailsC"
        v-if="mode === 'view'"
        v-bind:class="{ expanded: expand }"
      >
        <div
          class="listDetailsW"
          v-for="person in expense.persons"
          :key="person.id"
        >
          <div class="listDetailsFR">
            <div>
              <Photo
                :photo="photos[person.id]"
                :showAsGuest="settings.show.guestImage"
                :text="person.name"
              />
              <span v-text="person.name"></span>
            </div>
            <div class="mL2">
              <span class="currency" v-text="settings.currency"></span>
              <span v-text="person.cost"></span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="listBot"
        :id="'expenseTot_' + expense.id"
        v-bind:class="{ expanded: expand }"
      >
        <div class="listLeft"><span>Total</span></div>
        <div class="listRight">
          <div>
            <span class="currency" v-text="settings.currency"></span>
            <span v-text="this.cost" />
          </div>
        </div>
      </div>
      <div v-if="expand && mode !== 'view'" class="editButC">
        <div @click="addExpense" class="butPB">
          <i class="bs-save"></i> {{ mode }} Expense
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import serverUtils from "@/serverUtils";
import Photo from "@/components/Photo.vue";
export default {
  name: "ExpenseEditor",
  components: {
    Photo
  },
  computed: {
    ...mapState(["isAdmin", "personCollection", "settings", "photos"]),
    checkTemp: function() {
      return (
        this.expense &&
        this.expense.id.indexOf("TEMP") === 0 &&
        this.mode == "view"
      );
    }
  },
  props: ["expense", "expenseIteration", "expand"],
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
      edit: false,
      search: {
        text: "",
        show: false
      }
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
        this.mode = "view";
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
        if (this.mode !== "view") {
          this.$parent.resetPreview();
        }
      } else {
        this.expense.id = "TEMP_" + Math.random();
        if (this.name && this.name == "") {
          this.name = "Unnamed";
        }
        this.expense.name = this.name;
        this.expense.persons = {};
        this.$parent.resetPreview();
        if (this.$route.query.expense === "new") {
          let query = Object.assign({}, this.$route.query);
          delete query.expense;
          this.$router.push({
            query
          });
        }
      }
    },
    editClick(event) {
      this.edit = true;
      this.mode = "edit";
      if (this.expand) {
        event.stopPropagation();
      }
    },
    noAct() {},
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
          if (
            this.expense.id &&
            this.expense.id !== "new" &&
            this.mode !== "edit"
          ) {
            this.initData();
          }
        }
      }
    },
    initData() {
      this.name = this.expense.name;
      this.cost = this.expense.cost;
      this.date = this.expense.date;
      var i = this.availablePersons.length;
      while (i--) {
        if (this.expense.persons[this.availablePersons[i].id]) {
          this.addPerson(
            this.expense.persons[this.availablePersons[i].id],
            i,
            true
          );
        }
      }
      this.recalculateSplit();
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
          date: this.date ? this.date : null,
          persons: this.persons,
          id: this.expense.id
        };
        var initialExpensePersons = JSON.parse(
          JSON.stringify(this.expense.persons)
        );
        if (this.mode === "add") {
          serverUtils.addExpense(
            expense,
            initialExpensePersons,
            this.updatePersons,
            this.printR
          );
        } else if (this.mode === "edit") {
          serverUtils.editExpense(
            this.expense.id,
            expense,
            initialExpensePersons,
            this.updatePersons,
            this.printR
          );
        }
      } else if (!this.costValidate) {
        this.showError("Billed Person Amount Invalid");
      } else {
        this.showError("Invalid Bill");
      }
    },
    updatePersons(expense, initPersons) {
      let selectedPersons = JSON.parse(JSON.stringify(expense.persons));
      let personIteration = JSON.parse(JSON.stringify(this.personCollection));
      for (let i = 0; i < personIteration.length; i++) {
        let person = personIteration[i];
        let updatePerson = {};
        let needUpdate = false;
        if (selectedPersons[person.id]) {
          person.expenses[expense.id] = {
            id: expense.id,
            name: expense.name,
            cost: selectedPersons[person.id].cost,
            date: expense.date
          };
          needUpdate = true;
        } else if (initPersons[person.id]) {
          delete person.expenses[expense.id];
          needUpdate = true;
        }
        if (needUpdate) {
          var totalPayRequired = 0;
          for (var bill in person.expenses) {
            totalPayRequired += person.expenses[bill].cost;
          }
          updatePerson = {
            expenses: person.expenses,
            payment: {
              balPayRequired: totalPayRequired - person.payment.paid,
              totalPayRequired: totalPayRequired
            },
            paid: totalPayRequired - person.payment.paid === 0
          };
          serverUtils.editPerson(
            person.id,
            updatePerson,
            this.printR,
            this.printR
          );
        }
      }
      this.$parent.expenseAdded(expense.id);
    },
    deleteExpense() {
      alert("Implementing Feature. Come Back Later");
    },
    previewExpense() {
      if (
        this.name &&
        this.name.trim().length > 0 &&
        this.cost > 0 &&
        this.costValidate
      ) {
        this.renderPreview();
      } else if (!this.costValidate) {
        this.showError("Bill Split not valid");
        this.renderPreview();
      } else {
        this.showError("Invalid Bill");
        this.$parent.resetPreview();
      }
    },
    renderPreview() {
      for (var i = 0; i < this.personCollection.length; i++) {
        var id = this.personCollection[i].id;
        if (this.persons[id]) {
          if (this.mode === "add") {
            this.personCollection[i].modify = {
              id: this.expense.id,
              name: this.name,
              mode: "add",
              balPayRequired:
                this.personCollection[i].payment.balPayRequired +
                this.persons[id].cost,
              cost: this.persons[id].cost
            };
            this.personCollection[i].modified = true;
          } else if (this.mode === "edit") {
            if (this.personCollection[i].expenses[this.expense.id]) {
              if (
                this.persons[id].cost ===
                this.personCollection[i].expenses[this.expense.id].cost
              ) {
                this.personCollection[i].modified = false;
              } else {
                this.personCollection[i].modify = {
                  id: this.expense.id,
                  name: this.expense.name,
                  mode:
                    this.persons[id].cost >
                    this.personCollection[i].expenses[this.expense.id].cost
                      ? "add"
                      : "sub",
                  balPayRequired:
                    this.personCollection[i].payment.balPayRequired +
                    this.persons[id].cost -
                    this.personCollection[i].expenses[this.expense.id].cost,
                  cost: Math.abs(
                    this.persons[id].cost -
                      this.personCollection[i].expenses[this.expense.id].cost
                  )
                };
                this.personCollection[i].modified = true;
              }
            } else {
              this.personCollection[i].modify = {
                id: this.expense.id,
                name: this.name,
                mode: "add",
                balPayRequired:
                  this.personCollection[i].payment.balPayRequired +
                  this.persons[id].cost,
                cost: this.persons[id].cost
              };
              this.personCollection[i].modified = true;
            }
          }
        } else if (this.expense.persons[id]) {
          console.log(this.personCollection[i], this.expense.persons);
          this.personCollection[i].modify = {
            id: this.expense.id,
            name: this.expense.name,
            mode: "sub",
            balPayRequired:
              this.personCollection[i].payment.balPayRequired -
              this.personCollection[i].expenses[this.expense.id].cost,
            cost: this.personCollection[i].expenses[this.expense.id].cost
          };
          this.personCollection[i].modified = true;
          console.log(this.personCollection[i]);
        } else {
          this.personCollection[i].modified = false;
        }
        // console.log(JSON.stringify(this.personCollection))
      }
      this.$store.commit("setPersonCollection", this.personCollection);
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
        if (this.cost > 0 && this.name && this.name.length > 0) {
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
          this.showError("Expense Cost Cannot be Zero");
        } else if (this.name == undefined || this.name.length === 0) {
          this.showError("Expense Name Cannot be Empty");
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
      if (this.mode !== "view") {
        this.previewExpense();
      }
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
    printR(r) {
      console.log(r);
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
        console.log("hhhh");
        this.$parent.resetPreview();
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
  max-height: 5vh;
  /* transition: max-height 1s cubic-bezier(1, 0, 1, 0); */
  transition: 0.25s;
  overflow: hidden;
}

.neW.expanded {
  max-height: 9999px;
  transition: max-height 0.25s cubic-bezier(0, 1, 0, 1);
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
  background: linear-gradient(
      45deg,
      transparent 33.333%,
      #fff 33.333%,
      #fff 66.667%,
      transparent 66.667%
    ),
    linear-gradient(
      -45deg,
      transparent 33.333%,
      #fff 33.333%,
      #fff 66.667%,
      transparent 66.667%
    );
  background-size: 0.48em 1.2em;
}

.listHead input[type="date"]::-webkit-calendar-picker-indicator {
  padding: 0;
  margin: 0;
}

.listHead input[type="date"]::-webkit-calendar-picker-indicator:hover {
  cursor: pointer;
}

.neHt {
  text-align: center;
  margin: 0.6em;
}

.neHt span {
  text-align: center;
  background: #dedbdb;
  margin: 0.25em auto;
  border-radius: 0.24em;
  padding: 0.3em;
  color: #868585;
  font-family: Arial;
}

.eWHeadLeft .neHt {
  margin: -0.5em 0.6em;
}

.exPcTab {
  width: 100%;
  display: table;
  overflow: auto;
}

.exPcTitle {
  height: 5vh;
  overflow: hidden;
}

.exHelpT {
  height: 5vh;
}

.exPcTitle .exPcL,
.exPcTitle .exPcR {
  float: left;
  width: calc(50% - 2vw);
  position: relative;
  overflow: hidden;
  height: 100%;
  text-align: center;
  padding: 1vh 1vw;
}

.exPcTab .exPcL,
.exPcTab .exPcR {
  height: 100%;
  display: table-cell;
  width: 50%;
  position: relative;
  vertical-align: top;
}

.exPcTab .exPcR {
  width: calc(50% - 0.06em);
  border-left: 0.06em solid #f1f1f1;
}

.exPcT {
  padding: 0em 1vw;
  text-align: center;
  color: #5d5d5d;
  width: calc(100% - 2vw);
  transition: width 0.1s ease-in-out;
  display: block;
}

.exPcL.search .exPcT {
  display: none;
  width: 0%;
  transition: width 0.1s ease-in-out;
}

.exPcL .searchI {
  width: 0%;
  transition: width 0.1s ease-in-out;
  margin-top: 50em;
}

.exPcL.search .searchI {
  width: 50%;
  transition: width 0.3s ease-in-out;
  margin-top: unset;
}

.exPcL .bs-search {
  cursor: pointer;
  top: 0.5vh;
  right: 1vw;
  position: absolute;
  color: #a4a4a4;
  font-size: 24px;
}

.exPcL .bs-search:hover,
.exPcL.search .bs-search {
  color: #2196f3;
}

.exPcPW {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
}

.exPcL .exPcP {
  cursor: pointer;
}

.exPcR .exPcPW {
  flex-direction: column;
  justify-content: right;
}

.exPcPW * {
  float: left;
  margin: 0.3em 0;
}

.exPcP {
  height: 5vh;
  border-radius: 3vh;
  box-shadow: 0px 0px 5px 2px rgba(202, 202, 202, 0.34);
  background: #fff;
  display: flex;
  flex-direction: row;
  align-self: flex-end;
  overflow: hidden;
  padding: 0 1vw;
}

.exPcP * {
  align-self: center;
}

.exPcPW .but {
  color: #64dd17;
}

.exPcR .but {
  color: #ff8a80;
  cursor: pointer;
}

.exPcPW .pCont {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.exPcP input[type="number"] {
  max-width: 5vw;
}
.dF {
  display: flex;
}
.editButC {
  padding: 0 1vw;
  height: 5vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0px 0px 2px 1px var(--soft);
}

.butPB {
  background: var(--hard);
  padding: 0.6vw;
  text-align: center;
  border-radius: 0.24vw;
  color: #fff;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0em 0.06em 0.3em 0.12em rgba(0, 0, 0, 0.5);
  font-weight: var(--fontbold);
  font-size: var(--smallSize);
  width: fit-content;
  align-self: flex-end;
}

.butPB i {
  font-weight: var(--fontbold);
  margin-right: 1vw;
}
</style>
