<template>
  <div :id="'person_' + person.id" class="perC">
    <div class="perW" v-bind:class="{ expanded: expand }">
      <div class="perHead" v-bind:class="{ expanded: expand }" @click="expandPerson()">
        <div>
          <img v-if="photo" class="pPic" :src="person.photo" />
          <img v-else class="pPic" src="../assets/guest.svg" />
        </div>
        <div class="perName" v-text="name">
        </div>
        <div class="perDelIi" v-if="isAdmin" v-bind:class="{ modified: modified}" @mouseleave="show.options = false">
          <i v-show="!show.options" title="More Options" class="bs-more" @click.stop="show.options = true"></i>
          <span class="icWra" v-if="show.options">
                <span class="iconHolder">
                  <i title="Edit Person" class="bs-edit" @click.stop="$parent.editPerson(person)"></i>
                  <i title="Record Payment" v-bind:class="{pPaid:paid}" class="bs-wallet" @click.stop="paid=!paid"></i>
                  <i title="Move to trash" class="bs-delete"></i>
                </span>
          </span>
        </div>
        <div v-if="!expand && !modified" v-bind:class="{pPaid:paid}">
          <span class="currency" v-text="settings.currency"></span>
          <span v-text="Math.ceil(balPayRequired)"></span>
        </div>
        <div class="peModI" v-if="!expand && modified">
          <span class="currency" v-text="settings.currency"></span>
          <span v-text="Math.ceil(modifyBalPay)"></span>
          <i v-bind:class="{ 'bs-arrow-up': modifyMode === 'add','bs-arrow-down': modifyMode !== 'add' }"></i>
          <i class="bs-preview" />
          <span class="previewSplit" v-bind:class="{'modAdd':modified && modifyMode === 'add','modSub':modified && modifyMode !== 'add'}">
              <span v-text="'( '+ Math.ceil(person.payment.balPayRequired) +' ' +(modifyMode === 'add' ? '+' : '-') +' ' +Math.ceil(modifyCost)+' )'"></span>
          </span>
        </div>
      </div>
      <div class="perCon" v-if="mode === 'view'" v-bind:class="{ expanded: expand }">
        <div class="perExW">
          <div class="perEx" v-for="expense in expenses" :key="expense.id">
            <div class="peExCRight" @click.stop="openExpense(expense.id)" v-bind:class="{pPaid:paid && !modified, 'modAdd': modified && person.modify.id==expense.id &&  modifyMode === 'add','modSub': modified && person.modify.id==expense.id && modifyMode !== 'add'}">
              <div v-text="expense.name">
              </div>
              <div class="m45">
                <span class="currency" v-text="settings.currency"></span>
                <span v-text="modified && person.modify.id==expense.id?(modifyMode === 'add'?Math.ceil(expense.cost+modifyCost):Math.ceil(expense.cost-modifyCost)):Math.ceil(expense.cost)"></span>
                <span v-if="modified && person.modify.id==expense.id" v-text="'( '+Math.ceil(expense.cost) +' '+ (modifyMode === 'add' ? '+' : '-') +' ' +Math.ceil(modifyCost)+' )'"></span>
              </div>
            </div>
          </div>
          <div v-if="modified && person.modify.id!=='new' && !person.expenses[person.modify.id]" class="perEx">
            <div class="peExCRight modAdd" @click.stop="openExpense(person.modify.id)">
              <div v-text="modifyName">
              </div>
              <div class="m45">
                <span class="currency" v-text="settings.currency"></span>
                <span v-text="Math.ceil(modifyCost)"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pTot">
        <div>Total</div>
        <div v-bind:class="{pPaid:paid && !modified,  'modAdd':modified && modifyMode === 'add','modSub':modified && modifyMode !== 'add'}">
          <span v-if="modified" class="bs-preview" />
          <span class="currency" v-text="settings.currency"></span>
          <span v-if="!modified" v-text="Math.ceil(balPayRequired)" />
          <span v-if="modified">
                {{Math.ceil(modifyBalPay)+' ( '+ Math.ceil(person.payment.balPayRequired) +' ' +(modifyMode === 'add' ? '+' : '-') +' ' +Math.ceil(modifyCost)+' )'}}
                <i v-if="modified" v-bind:class="{ 'bs-arrow-up': modifyMode === 'add','bs-arrow-down': modifyMode !== 'add' }" />
            </span>
  
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .perC {
    position: relative;
    margin: 1.5em 0.6em;
    background: #fff;
    -webkit-box-shadow: 0.12em 0.06em 0.3em -0.24em rgba(0, 0, 0, 0.75);
    box-shadow: 0.12em 0.06em 0.3em -0.24em rgba(0, 0, 0, 0.75);
    font-size: 20px;
  }
  
  .perW {
    max-height: 3em;
    transition: max-height 0.25s ease-out;
    overflow: hidden;
  }
  
  .perW.expanded {
    max-height: 30em;
    transition: max-height 0.25s ease-in;
  }
  
  .perHead {
    font-size: 1.2em;
    cursor: pointer;
    overflow: hidden;
  }
  
  .perHead div {
    float: left;
    padding-top: 1em;
  }
  
  .perName {
    max-width: 5em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .perHead div:first-of-type {
    padding: 0;
  }
  
  .perHead div:last-of-type {
    float: right;
    margin-right: 1.2em;
    max-width: 10em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .perDelIi {
    opacity: 0;
    margin: -0.1em 0 0 0.5em;
  }
  
  .perDelIi span i {
    text-decoration: unset;
    margin: 0.5em;
  }
  
  .perDelIi span i:before {
    text-decoration: unset;
  }
  
  .perDelIi.modified {
    display: none!important;
  }
  
  .perHead:hover .perDelIi,
  .perHead.expanded .perDelIi {
    color: #ccc;
    opacity: 1;
  }
  
  .perDelIi .bs-more {
    padding: 1vw;
  }
  
  .perDelIi .bs-more:hover {
    color: #5e2fb4!important;
  }
  
  .perDelIi .bs-edit:hover {
    color: #2196F3!important;
  }
  
  .perDelIi .bs-delete:hover {
    color: #F44336!important;
  }
  
  .perDelIi .bs-wallet:hover {
    color: #64dd17!important;
  }
  
  .perDelIi .bs-wallet.pPaid:hover {
    color: #2196F3!important;
  }
  
  .perDelIi .icWra {
    position: absolute;
    width: 100%;
    margin: 0;
    top: 0;
    left: 0;
    text-align: center;
    padding-top: 0.5em;
  }
  
  .perDelIi .iconHolder {
    border-radius: 1em;
    padding: 0.5em 1em 0.1em 1em;
    background: #fff;
    -webkit-box-shadow: 2px 2px 10px 0px rgb(0, 0, 0, 0.5);
    box-shadow: 2px 2px 10px 0px rgb(0, 0, 0, 0.5);
    width: 50%;
  }
  
  .perHead.expanded {
    border-bottom: 0.06em solid #eaeaea;
  }
  
  .peModI {
    margin: 0 0 0 0.2em!important;
  }
  
  .peModI * {
    float: left!important;
  }
  
  .peModI span:last-of-type {
    margin-left: 0.1em;
  }
  
  .peModI i {
    margin: -0.2em 0.2em;
    color: rgba(94, 47, 180, 0.4)!important;
    opacity: 0.8;
  }
  
  .previewSplit {
    position: absolute;
    top: 1.8em;
    right: 0.2em;
    border-radius: 2em;
    box-shadow: 1px 1px 10px 1px rgb(0, 0, 0, 0.2);
    padding: 0.3em 1.7em;
    z-index: 2;
    background: #fff;
    display: none;
  }
  
  .peModI i:hover~.previewSplit {
    display: block;
  }
  
  .peModI i.bs-arrow-up,
  .modAdd * {
    color: #64dd17!important;
  }
  
  .peModI i.bs-arrow-down,
  .modSub * {
    color: #ff8a80!important;
  }
  
  .perCon {
    margin: 0.6em 1.2em;
    border-radius: 0.3em;
    height: 100%;
    width: calc(100% - 2.4em);
    overflow: hidden;
    max-height: 15em;
    visibility: hidden;
  }
  
  .perCon.expanded {
    visibility: visible;
  }
  
  .perExW {
    margin: 0.6em;
    overflow: auto;
  }
  
  .perEx {
    width: 100%;
    font-size: 1.2em;
    color: #6f6f6f;
    display: inline-block;
  }
  
  .peExCRight {
    cursor: pointer;
    float: right;
  }
  
  .peExCRight div:first-child {
    float: left;
  }
  
  .pTot {
    bottom: 0;
    left: 0;
    border-top: 0.06em solid #eaeaea;
    margin: 0.5em 1em;
    padding-top: 1em;
    overflow: hidden;
  }
  
  .pTot div {
    float: left;
  }
  
  .pTot div:last-child {
    float: right;
  }
  
  .pTot .bs-preview {
    color: rgba(94, 47, 180, 0.4)!important;
    margin-right: 0.2em;
  }
  
  .pPaid *:not(i) {
    text-decoration: line-through;
    color: #ccc!important;
  }
</style>


<script>
  import {
    mapState
  } from "vuex";
  import fb from "@/firebaseConfig";
  import router from "@/router";
  export default {
    name: "Person",
    computed: {
      ...mapState(["isAdmin", "settings"])
    },
    props: ["person", "expand", "modified", "modifyBalPay", "modifyMode", "modifyCost", "modifyName"],
    data() {
      return {
        mode: "view",
        edit: false,
        name: "",
        photo: null,
        balPayRequired: 0,
        paid: false,
        expenses: [],
        show: {
          options: false
        }
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        this.mode = this.edit ? "edit" : "view";
        this.initPerson();
      },
      initPerson() {
        this.name = this.person.name;
        this.photo = this.person.photo;
        this.balPayRequired = this.person.payment.balPayRequired;
        this.paid = this.person.paid;
        this.expenses = []
        for (var id in this.person.expenses) {
          this.expenses.push(this.person.expenses[id])
        }
      },
      expandPerson() {
        if (!this.expand) {
          this.$parent.expandFromChild(this.person.id);
        } else {
          let query = Object.assign({}, this.$route.query);
          delete query.person;
          this.$router.push({
            query
          });
        }
      },
      openExpense(id) {
        let query = Object.assign({}, this.$route.query);
        query.expense = id;
        router.push({
          query: query
        });
      },
  
      deletePeople(id) {
        // fb.personCollection
        //   .doc(id)
        //   .delete()
        //   .then(function() {
        //     alert("Person successfully deleted!");
        //   })
        //   .catch(function(error) {
        //     console.error("Error removing Person: ", error);
        //   });
      }
    }
  };
</script>
