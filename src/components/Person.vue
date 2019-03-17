<template>
  <div :id="'person_' + person.id" class="perC">
    <div class="perW" v-bind:class="{ expanded: expand }">
      <div
        class="listHead"
        v-bind:class="{ expanded: expand }"
        @click="expandPerson()"
      >
        <div class="listLeft">
          <Photo
            :photo="photos[person.id]"
            :showAsGuest="settings.show.guestImage"
            :text="name"
          />
          <div class="perName" v-text="name"></div>
          <div
            class="perDelIi"
            v-if="isAdmin"
            v-bind:class="{ modified: modified }"
            @mouseleave="show.options = false"
          >
            <i
              v-show="!show.options"
              title="More Options"
              class="bs-more"
              @click.stop="show.options = true"
            ></i>
            <span class="icWra" v-show="show.options">
              <span class="iconHolder">
                <i
                  title="Edit Person"
                  class="bs-edit"
                  @click.stop="$parent.editPerson(person, photos[person.id])"
                ></i>
                <i
                  title="Record Payment"
                  v-bind:class="{ pPaid: paid }"
                  class="bs-wallet"
                  @click.stop="markPaid(person)"
                ></i>
                <i
                  title="Move to trash"
                  class="bs-delete"
                  @click="deletePerson(person.id)"
                ></i>
              </span>
            </span>
          </div>
        </div>
        <div class="listRight">
          <div v-if="!expand && !modified" v-bind:class="{ pPaid: paid }">
            <span class="currency" v-text="settings.currency"></span>
            <span v-text="Math.ceil(balPayRequired)"></span>
          </div>
          <div
            class="peModI"
            v-if="!expand && modified"
            v-bind:class="{
              modAdd: modified && modifyMode === 'add',
              modSub: modified && modifyMode !== 'add'
            }"
          >
            <span class="currency" v-text="settings.currency"></span>
            <span v-text="Math.ceil(modifyBalPay)"></span>
            <i
              v-bind:class="{
                'bs-arrow-up': modifyMode === 'add',
                'bs-arrow-down': modifyMode !== 'add'
              }"
            ></i>
            <i class="bs-preview" />
            <span class="previewSplit">
              <span
                v-text="
                  '( ' +
                    Math.ceil(person.payment.balPayRequired) +
                    ' ' +
                    (modifyMode === 'add' ? '+' : '-') +
                    ' ' +
                    Math.ceil(modifyCost) +
                    ' )'
                "
              ></span>
            </span>
          </div>
        </div>
      </div>
      <div
        class="listDetailsC"
        v-if="mode === 'view'"
        v-bind:class="{ expanded: expand }"
      >
        <div class="listDetailsW" v-for="expense in expenses" :key="expense.id">
          <div
            class="listDetailsFR"
            @click.stop="openExpense(expense.id)"
            v-bind:class="{
              pPaid: paid && !modified,
              modAdd:
                modified &&
                person.modify.id == expense.id &&
                modifyMode === 'add',
              modSub:
                modified &&
                person.modify.id == expense.id &&
                modifyMode !== 'add'
            }"
          >
            <div v-text="expense.name"></div>
            <div class="mL2">
              <span class="currency" v-text="settings.currency"></span>
              <span
                v-text="
                  modified && person.modify.id == expense.id
                    ? modifyMode === 'add'
                      ? Math.ceil(expense.cost + modifyCost)
                      : Math.ceil(expense.cost - modifyCost)
                    : Math.ceil(expense.cost)
                "
              ></span>
              <span
                v-if="modified && person.modify.id == expense.id"
                v-text="
                  '( ' +
                    Math.ceil(expense.cost) +
                    ' ' +
                    (modifyMode === 'add' ? '+' : '-') +
                    ' ' +
                    Math.ceil(modifyCost) +
                    ' )'
                "
              ></span>
            </div>
          </div>
        </div>
        <div class="listDetailsW" v-if="modified && person.modify.id === 'new'">
          <div
            class="listDetailsFR"
            @click.stop="openExpense('new')"
            v-bind:class="{ modAdd: true }"
          >
            <div v-text="person.modify.name"></div>
            <div>
              <span class="currency" v-text="settings.currency"></span>
              <span v-text="Math.ceil(modifyCost)"></span>
            </div>
          </div>
        </div>
        <div
          v-if="
            modified &&
              person.modify.id !== 'new' &&
              !person.expenses[person.modify.id]
          "
          class="perEx"
        >
          <div
            class="peExCRight modAdd"
            @click.stop="openExpense(person.modify.id)"
          >
            <div v-text="modifyName"></div>
            <div>
              <span class="currency" v-text="settings.currency"></span>
              <span v-text="Math.ceil(modifyCost)"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="listBot" v-bind:class="{ expanded: expand }">
        <div class="listLeft"><span>Total</span></div>
        <div class="listRight">
          <div
            v-bind:class="{
              pPaid: paid && !modified,
              modAdd: modified && modifyMode === 'add',
              modSub: modified && modifyMode !== 'add'
            }"
          >
            <span v-if="modified" class="bs-preview" />
            <span class="currency" v-text="settings.currency"></span>
            <span v-if="!modified" v-text="Math.ceil(balPayRequired)" />
            <span v-if="modified">
              {{
                Math.ceil(modifyBalPay) +
                  " ( " +
                  Math.ceil(person.payment.balPayRequired) +
                  " " +
                  (modifyMode === "add" ? "+" : "-") +
                  " " +
                  Math.ceil(modifyCost) +
                  " )"
              }}
              <i
                v-if="modified"
                v-bind:class="{
                  'bs-arrow-up': modifyMode === 'add',
                  'bs-arrow-down': modifyMode !== 'add'
                }"
              />
            </span>
          </div>
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
}

.perW {
  max-height: 3em;
  transition: max-height 0.25s ease-out;
}

.perW.expanded {
  max-height: 3000em;
  transition: max-height 0.25s ease-in;
}

.perName {
  max-width: 5em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.perDelIi {
  opacity: 0;
  margin-top: -0.1em !important;
}

.perDelIi span i {
  text-decoration: unset;
  margin: 0.5em;
}

.perDelIi span i:before {
  text-decoration: unset;
}

.perDelIi.modified {
  display: none !important;
}

.listHead:hover .listLeft .perDelIi,
.listHead.expanded .listLeft .perDelIi {
  color: #ccc;
  opacity: 1;
}

.perDelIi .bs-more:hover {
  color: var(--hard) !important;
}

.perDelIi .bs-edit:hover {
  color: #2196f3 !important;
}

.perDelIi .bs-delete:hover {
  color: #f44336 !important;
}

.perDelIi .bs-wallet:hover {
  color: #64dd17 !important;
}

.perDelIi .bs-wallet.pPaid:hover {
  color: #2196f3 !important;
}

.perDelIi .icWra {
  position: absolute;
}

.perDelIi .iconHolder {
  border-radius: 1em;
  padding: 0.5vw;
  background: #fff;
  -webkit-box-shadow: 2px 2px 10px 0px rgb(0, 0, 0, 0.5);
  box-shadow: 2px 2px 10px 0px rgb(0, 0, 0, 0.5);
  display: flex;
  flex-direction: row;
}

.peModI {
  margin: 0 0 0 0.2em !important;
}

.peModI * {
  float: left !important;
}

.peModI span:last-of-type {
  margin-left: 0.1em;
}

.peModI i {
  margin: -0.2em 0.2em;
  color: var(--hard) !important;
  opacity: 0.8 !important;
}

.previewSplit {
  position: absolute;
  top: 0.7em;
  right: 0.2em;
  border-radius: 2em;
  box-shadow: 1px 1px 10px 1px rgb(0, 0, 0, 0.2);
  padding: 0.3em 1.7em;
  z-index: 2;
  background: #fff;
  display: none;
}

.peModI:hover .previewSplit {
  display: block;
}

.peModI i.bs-arrow-up,
.modAdd * {
  color: #64dd17 !important;
}

.peModI i.bs-arrow-down,
.modSub * {
  color: #ff8a80 !important;
}

.perCon {
  margin: 0.6em 1.2em;
  border-radius: 0.3em;
  height: 100%;
  width: calc(100% - 2.4em);
  overflow: hidden;
  max-height: 2500em;
  visibility: hidden;
}

.perCon.expanded,
.pTot.expanded {
  visibility: visible;
}

.perExW {
  margin: 0.6em;
  overflow: auto;
  font-size: var(--normalSize);
}

.perEx {
  width: 100%;
  color: #6f6f6f;
  display: inline-block;
}

.peExCRight {
  cursor: pointer;
  float: right;
  display: flex;
  max-width: 75%;
}

.peExCRight div {
  padding-top: 0.2em;
}

.peExCRight div:first-child {
  float: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.pPaid *:not(i) {
  text-decoration: line-through;
  color: #ccc !important;
}
</style>

<script>
import { mapState } from "vuex";
import router from "@/router";
import Photo from "@/components/Photo.vue";
import serverUtils from "@/serverUtils";
export default {
  name: "Person",
  components: {
    Photo
  },
  computed: {
    ...mapState(["isAdmin", "settings", "photos"])
  },
  props: [
    "person",
    "expand",
    "modified",
    "modifyBalPay",
    "modifyMode",
    "modifyCost",
    "modifyName"
  ],
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
      this.expenses = [];
      for (var id in this.person.expenses) {
        this.expenses.push(this.person.expenses[id]);
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
    markPaid(person) {
      let updatePerson = {
        payment: {
          paid: person.payment.totalPayRequired,
          balPayRequired: 0
        },
        paid: true
      };
      serverUtils.editPerson(person.id, updatePerson, this.printR, this.printR);
    },
    deletePerson(id) {
      alert("Feature under implementation" + id);
    },
    printR(r) {
      console.log(r);
    }
  }
};
</script>
