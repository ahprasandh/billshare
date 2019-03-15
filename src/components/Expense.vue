<template>
  <div :id="'expense_' + expense.id" class="billC">
    <div class="neW" v-bind:class="{ expanded: expand }">
      <div class="err" v-if="error">
        <span v-text="error"></span>
      </div>
      <div class="eWHead" @click="expandExpense(expense)" v-bind:class="{ edit: mode !=='view', expanded: expand }">
        <div class="eWHeadLeft">
          <input @click.stop="noAct" v-if="mode !== 'view'" type="text" v-model="name" placeholder="Enter Name" />
          <span :id="'expenseName_' + expense.id" v-else v-text="this.name" />
          <i title="Edit Expense" v-if="mode==='view' && isAdmin" @click="editClick($event)" class="bs-edit"></i>
          <i title="Move to Trash" v-if="mode==='view' && isAdmin" @click.stop="deleteExpense" class="bs-delete"></i>
          <div v-if="checkTemp" class="neHt">
            <span class="bs-save"> Not Saved</span>
          </div>
        </div>
        <div class="eWHeadRight" v-if="mode === 'view'" v-bind:class="{ expanded: expand }">
          <span class="costHo" v-if="!expand">
                                                    <div v-text="settings.currency"/>
                                                    <span v-text="this.cost" />
                                                </span>
          <span v-text="this.date" />
        </div>
        <div class="eWHeadRight" v-else-if="expand">
          <input @click.stop="noAct" type="number" v-model.number="cost" placeholder="Enter Amount" size="1" />
          <div class="currency" v-text="settings.currency" />
          <input @click.stop="noAct" v-if="mode !== 'view'" type="date" v-model="date" placeholder="Enter Date" />
        </div>
      </div>
      <div class="exPc" v-if="mode !== 'view' && isAdmin" v-bind:class="{ expanded: expand }">
        <div class="exHelpT" v-if="settings && settings.show.help">
          <div class="neHt">
            <span class="bs-help">Add Persons to Billed Persons to split the bill amount</span>
          </div>
          <div class="neHt">
            <span class="bs-help"> To auto calculate split bill set '0' as cost</span>
          </div>
        </div>
        <div class="exPcTitle">
          <div class="exPcL" v-bind:class="{search:search.show}">
            <span class="exPcT">Available Persons</span>
            <input class="searchI" type="text" v-model.trim="search.text" />
            <i class="bs-search" @click="search.show=!search.show;"></i>
          </div>
          <div class="exPcR">
            <span class="exPcT">Billed Persons</span>
          </div>
        </div>
        <div class="exPcTab">
          <div class="exPcL">
            <div class="exPcPW" v-bind:class="{help:settings.show.help}">
              <div class="exPcP" v-for="(person,i) in availablePersons" :key="person.id" v-show="person.name.toLowerCase().indexOf(search.text) != -1">
                <div class="pMt">
                  <span v-if="photos[person.id]" v-bind:style="{background:'url('+photos[person.id]+') no-repeat center'}" />
                  <span v-else-if="settings.show.guestImage" />
                  <span v-else v-bind:style="{background:'var(--soft)'}" v-text="'Ha'"></span>
                </div>
                <div class="pName" v-text="person.name"></div>
                <span class="currency" v-text="settings.currency"></span>
                <input type="number" v-model.number="person.cost" />
                <div class="but bs-add" @click="addPerson(person, i)"></div>
              </div>
            </div>
          </div>
          <div class="exPcR">
            <div class="exPcPW" v-bind:class="{help:settings.show.help}">
              <div class="exPcP" v-for="(person, i) in selectedPersons" :key="person.id">
                <div class="pMt">
                  <span v-if="photos[person.id]" v-bind:style="{background:'url('+photos[person.id]+') no-repeat center'}" />
                  <span v-else-if="settings.show.guestImage" />
                  <span v-else v-bind:style="{background:'var(--soft)'}" v-text="'Ha'"></span>
                </div>
                <div class="pName" v-text="person.name"></div>
                <span class="currency" v-text="settings.currency"></span>
                <input type="number" v-model.number="person.cost" disabled="disabled" />
                <div class="but bs-minus" @click="removePerson(person, i)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="exPc" v-if="mode === 'view'" v-bind:class="{ expanded: expand }">
        <div class="exPe">
          <div class="exPeC" v-for="person in expense.persons" :key="person.id">
            <div class="exPeCRight">
              <div>
                <!-- <img v-if="photos[person.id]" class="pPic" :src="photos[person.id]" />
                                                      <img v-else class="pPic" src="../assets/guest.svg" /> -->
                <div class="pMt">
                  <span v-if="photos[person.id]" v-bind:style="{background:'url('+photos[person.id]+') no-repeat center'}" />
                  <span v-else-if="settings.show.guestImage" />
                  <span v-else v-bind:style="{background:'var(--soft)'}" v-text="'Ha'"></span>
                </div>
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
          <i class="bs-save"></i> {{mode}} Expense
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
  import serverUtils from "@/serverUtils"
  export default {
    name: "ExpenseEditor",
    computed: {
      ...mapState(["isAdmin", "personCollection", "settings", "photos"]),
      checkTemp: function() {
        return this.expense && this.expense.id.indexOf("TEMP") === 0 && this.mode == "view";
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
          text: '',
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
          if (this.mode !== "view") {
            this.$parent.resetPreview()
          }
        } else {
          this.expense.id = "TEMP_" + Math.random();
          if (this.name && this.name == "") {
            this.name = "Unnamed";
          }
          this.expense.name = this.name;
          this.expense.persons = {}
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
            date: this.date? this.date : null,
            persons: this.persons,
            id: this.expense.id
          };
          var initialExpensePersons = JSON.parse(JSON.stringify(this.expense.persons))
          if (this.mode === "add") {
            serverUtils.addExpense(expense, initialExpensePersons, this.updatePersons, this.printR)
          } else if (this.mode === "edit") {
            serverUtils.editExpense(this.expense.id,expense, initialExpensePersons, this.updatePersons, this.printR)
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
          let updatePerson = {}
          let needUpdate = false;
          if (selectedPersons[person.id]) {
            person.expenses[expense.id] = {
              id: expense.id,
              name: expense.name,
              cost: selectedPersons[person.id].cost,
              date: expense.date,
            }
            needUpdate = true;
          } else if (initPersons[person.id]) {
            delete person.expenses[expense.id]
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
              paid: (totalPayRequired - person.payment.paid) === 0
            }
            serverUtils.editPerson(person.id,updatePerson,this.printR,this.printR)
          }
        }
        this.$parent.expenseAdded(expense.id);
  
      },
      deleteExpense(){
        alert('Implementing Feature. Come Back Later')
      },
      previewExpense() {
        if (this.name && this.name.trim().length > 0 && this.cost > 0 && this.costValidate) {
          this.renderPreview()
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
                balPayRequired: this.personCollection[i].payment.balPayRequired + this.persons[id].cost,
                cost: this.persons[id].cost
              };
              this.personCollection[i].modified = true;
            } else if (this.mode === "edit") {
              if (this.personCollection[i].expenses[this.expense.id]) {
                if (this.persons[id].cost === this.personCollection[i].expenses[this.expense.id].cost) {
                  this.personCollection[i].modified = false;
                } else {
                  this.personCollection[i].modify = {
                    id: this.expense.id,
                    name: this.expense.name,
                    mode: this.persons[id].cost > this.personCollection[i].expenses[this.expense.id].cost ? "add" : "sub",
                    balPayRequired: this.personCollection[i].payment.balPayRequired + this.persons[id].cost - this.personCollection[i].expenses[this.expense.id].cost,
                    cost: Math.abs(this.persons[id].cost - this.personCollection[i].expenses[this.expense.id].cost)
                  };
                  this.personCollection[i].modified = true;
                }
              } else {
                this.personCollection[i].modify = {
                  id: this.expense.id,
                  name: this.name,
                  mode: "add",
                  balPayRequired: this.personCollection[i].payment.balPayRequired + this.persons[id].cost,
                  cost: this.persons[id].cost
                };
                this.personCollection[i].modified = true;
              }
            }
  
          } else if (this.expense.persons[id]) {
            console.log(this.personCollection[i], this.expense.persons)
            this.personCollection[i].modify = {
              id: this.expense.id,
              name: this.expense.name,
              mode: "sub",
              balPayRequired: this.personCollection[i].payment.balPayRequired - this.personCollection[i].expenses[this.expense.id].cost,
              cost: this.personCollection[i].expenses[this.expense.id].cost
            };
            this.personCollection[i].modified = true;
            console.log(this.personCollection[i])
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
          if ((person.cost < this.cost) && this.name && this.name.length > 0) {
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
            this.showError("Individual Cost must be less than total bill cost to share bill");
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
        console.log(r)
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
          console.log('hhhh')
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
    max-height: 3em;
    transition: max-height 0.25s ease-out;
    overflow: hidden;
  }
  
  .neW.expanded {
    max-height: 4500em;
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
    overflow: auto;
    cursor: pointer;
    margin: 0.6em 1.2em;
    padding: 0.3em 1.2em;
    color: #2c3e50;
    font-size: var(--titleSize);
  }
  
  .eWHead i {
    opacity: 0;
    margin: -0.2em 0 0 1.2em;
  }
  
  .eWHead:hover.eWHead i,
  .eWHead.expanded.eWHead i {
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
    background: #e3e2e4;
    border: 0.06em solid #c7c6c6;
  }
  
  .eWHead input[type=date],
  .eWHead input[type=number] {
    max-width: 33%;
  }
  
  .eWHead input[type=date]::-webkit-calendar-picker-indicator {
    padding: 0;
    margin: 0
  }
  
  .eWHead input[type=date]::-webkit-calendar-picker-indicator:hover {
    cursor: pointer;
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
    width: calc(50%);
  }
  
  .eWHeadRight * {
    float: right;
  }
  
  .eWHeadRight span {
    padding-left: 0.3em;
  }
  
  .eWHeadRight div.currency {
    padding: 0.7em;
  }
  
  .eWHeadRight .costHo * {
    float: left;
  }
  
  .eWHeadRight .costHo {
    margin-left: 1.8em;
  }
  
  .eWHeadRight.expanded span:first-of-type {
    margin-right: 0;
  }
  
  .currency {
    color: #6f6c6c;
    padding-right: 0.3em!important;
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
  
  .exPc {
    margin: 0.6em 1.2em;
    border-radius: 0.3em;
    height: 100%;
    width: calc(100% - 2.4em);
    overflow: hidden;
    max-height: 3000vh;
    visibility: hidden;
    font-size: var(--normalSize);
  }
  
  .exPc.expanded {
    visibility: visible;
  }
  
  .exPcTab {
    width: 100%;
  }
  
  .exPcTitle {
    height: 5vh;
    overflow: hidden;
  }
  
  .exHelpT {
    height: 5vh;
  }
  
  .exPcTab:nth-of-type(2) {
    max-height: 12em;
    overflow: auto;
  }
  
  .exPe {
    margin: 0.6em;
    overflow: auto;
  }
  
  .exPeC {
    width: 100%;
    color: #6f6f6f;
    display: inline-block;
    margin-top: 1.6em;
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
  }
  
  .m45 {
    margin-left: 2.7em;
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
    transition: width .1s ease-in-out;
    display: block;
  }
  
  .exPcL.search .exPcT {
    display: none;
    width: 0%;
    transition: width .1s ease-in-out;
  }
  
  .exPcL .searchI {
    width: 0%;
    transition: width .1s ease-in-out;
    margin-top: 50em;
  }
  
  .exPcL.search .searchI {
    width: 50%;
    transition: width .3s ease-in-out;
    margin-top: unset;
  }
  
  .exPcL .bs-search {
    cursor: pointer;
    top: 0.2em;
    right: 2em;
    position: absolute;
    color: #a4a4a4;
  }
  
  .exPcL .bs-search:hover,
  .exPcL.search .bs-search {
    color: #2196F3
  }
  
  .exPcPW {
    height: 20vh;
    overflow-y: scroll;
  }
  
  .exPcPW.help {
    max-height: 18vh;
  }
  
  .exPcPW * {
    float: left;
    margin: 0.3em 0;
  }
  
  .exPcP {
    height: 3em;
    width: calc(100% - 1.8em);
    border-radius: 0.42em;
    -webkit-box-shadow: 0.2em 0.2em 1.2em 0.12em rgba(202, 202, 202, 0.34);
    box-shadow: 0.1em 0.2em 0.2em 0.02em rgba(202, 202, 202, 0.34);
    position: relative;
    background: #fafafa;
    margin: 0.6em 1em;
    width: calc(100% - 2em);
  }
  
  .exPcPW .pMt {
    margin-top: -0.1em!important;
  }
  
  .exPcPW .pName {
    padding: 0.5em 0.3em;
  }
  
  .exPcPW .currency {
    padding-top: 0.7em;
  }
  
  .exPcPW input {
    max-width: 25%;
  }
  
  .exPcPW input[type=number] {
    padding-top: 0.4em;
  }
  
  .exPcPW .but {
    border-radius: 1.2em;
    background: #64dd17;
    width: 1em;
    height: 1em;
    color: #fff;
    text-align: center;
    cursor: pointer;
    position: absolute;
    right: -0.7em;
    padding: 0.2em;
    margin-top: 0.6em;
  }
  
  .exPcR .but {
    background: #ff8a80;
  }
  
  .exPcPW .pCont {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  
  .butPB,
  .butSB {
    background: var(--hard);
    padding: 0.6em;
    text-align: center;
    border-radius: 0.24em;
    color: #fff;
    text-transform: uppercase;
    right: 1.2em;
    bottom: 1.2em;
    cursor: pointer;
    box-shadow: 0em 0.06em 0.3em 0.12em rgba(103, 58, 183, 0.5);
    font-weight: var(--fontbold)
  }
  
  .butPB i {
    font-weight: var(--fontbold)
  }
  
  .butSB {
    right: 7.8em;
    background: #fff;
    color: var(--hard);
    box-shadow: unset;
  }
  
  .exTot {
    bottom: 0;
    left: 0;
    border-top: 0.06em solid #eaeaea;
    margin: 1.2em 1.8em;
    height: 2em;
    overflow: hidden;
  }
  
  .exTot div:first-of-type {
    float: left;
    margin-left: 1.2em;
  }
  
  .exTot div {
    float: right;
    margin: 0.6em;
  }
  
  .exTot div:last-of-type {
    margin-right: 0.6em;
  }
</style>
