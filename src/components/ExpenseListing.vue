<template>
  <div>
    <div class="ewT">
      Expenses <span>({{ expenseCollection.length }})</span>
    </div>
    <div id="expenseContainer" class="ewCon">
      <Expense v-for="(expense, iter) in expenseCollection" :key="expense.id" :expense="expense" :expenseIteration="iter" :expand="expense.expand" />
    </div>
    <div v-if="isAdmin" class="neBut bs-add" @click="addExpense"></div>
  </div>
</template>

<style>
  .ewT {
    padding: 10px;
    height: 20px;
    font-size: 25px;
  }
  
  .ewT span {
    font-size: 15px;
  }
  
  .neBut {
    background:var(--soft);
    position: absolute;
    right: 10px;
    bottom: 10px;
    font-size: 20px;
    color: #fff;
    padding: 10px;
    border-radius: 20px;
    cursor: pointer;
    height: 20px;
    width: 20px;
    text-align: center;
    font-weight: 900;
    box-shadow: 1px 1px 7px 3px rgb(0, 0, 0, 0.5);
  }
  
  .ewCon {
    height: calc(100% - 40px);
    overflow: auto;
  }
</style>

<script>
  import {
    mapState
  } from "vuex";
  import Expense from "@/components/Expense.vue";
  import router from "@/router";
  import fb from "@/firebaseConfig";
  import serverUtils from "@/serverUtils"
  import {
    setTimeout
  } from 'timers';
  export default {
    name: "ExpenseListing",
    computed: {
      ...mapState(["isAdmin", "settings" , "personCollection"])
    },
    components: {
      Expense
    },
    data() {
      return {
        expenseCollection: []
      };
    },
    mounted() {
      this.initExpenses()
    },
    methods: {
      initExpenses() {
        serverUtils.getExpenseList(this.setExpense);
        // this.expenseCollection=[{"cost":100,"createdOn":{"seconds":1551878159,"nanoseconds":305000000},"date":null,"id":"kCdK1o1Ap4eu5o0c14M8","name":"11","persons":{"XO1WQUh6mE3ALI9bhfYF":{"cost":50,"id":"XO1WQUh6mE3ALI9bhfYF","name":"Hari 2","omitSplit":false},"c1EWlrtEXQURuYc6XNvi":{"cost":50,"id":"c1EWlrtEXQURuYc6XNvi","name":"Hari","omitSplit":false}},"expand":false},{"cost":100,"createdOn":{"seconds":1551761944,"nanoseconds":567000000},"date":null,"name":"B1","persons":{"Hk8MhHaVI4mmgZCFzNOc":{"cost":45,"id":"Hk8MhHaVI4mmgZCFzNOc","name":"Hari 3","omitSplit":false},"XO1WQUh6mE3ALI9bhfYF":{"cost":45,"id":"XO1WQUh6mE3ALI9bhfYF","name":"Hari 2","omitSplit":false},"c1EWlrtEXQURuYc6XNvi":{"cost":10,"id":"c1EWlrtEXQURuYc6XNvi","name":"Hari","omitSplit":true}},"id":"JUKFvvgzQ19QX6xFCj9P","expand":false}]
        // this.$store.commit("setexpenseCollection", this.expenseCollection);
        // this.$parent.hideLoading();
      },
      setExpense(expenseCollection){
        this.expenseCollection = expenseCollection;
      },
      expandExpense() {
        if (this.expenseCollection && this.expenseCollection[0].id !== "new") {
          if (this.$route.query.expense && this.$route.query.expense === "new") {
            var tempCollection = [{
              id: "new",
              expand: false,
              persons: {}
            }];
            this.expenseCollection.forEach(exp => {
              tempCollection.push(exp)
            });
            this.expenseCollection = tempCollection;
          }
          for (var i = 0; i < this.expenseCollection.length; i++) {
            this.expenseCollection[i].expand = this.$route.query.expense === this.expenseCollection[i].id;
          }
          if (this.$route.query.expense) {
            var elem = document.getElementById(
              "expense_" + this.$route.query.expense
            );
            if (elem) {
              setTimeout(function() {
                elem.scrollIntoView(true);
                document.getElementById("expenseContainer").scrollTop -= 100;
              }, 200);
            }
          }
        }
      },
      addExpense() {
        if (this.$route.query.expense === undefined) {
          this.pushRouter("new");
        } else if (this.$route.query.expense !== "new") {
          this.pushRouter("new");
        }
      },
      expenseAdded(id) {
        this.pushRouter(id);
        this.initExpenses();
        serverUtils.getPersonList(this.setPersonInStore)
      },
      setPersonInStore(personCollection){
        this.$store.commit("setPersonCollection", personCollection);
      },
      expandFromChild(id) {
        if (this.expenseCollection[0].id === "new") {
          this.expenseCollection[0].id = "TEMP_" + Math.random();
          let func = this.pushRouter
          setTimeout(function() {
            func(id)
          }, 200)
        } else {
          this.pushRouter(id);
        }
      },
      pushRouter(id) {
        let query = Object.assign({}, this.$route.query);
        query.expense = id;
        router.push({
          query: query
        });
      },
      resetPreview(callback) {
        for (var i = 0; i < this.personCollection.length; i++) {
          this.personCollection[i].modified = false;
        }
        this.$store.commit("setPersonCollection", this.personCollection);
        if (callback) {
          callback();
        }
      }
    },
    watch: {
      "$route.query.expense": function() {
        this.expandExpense();
      },
      expenseCollection: function() {
        setTimeout(this.expandExpense, 250);
      }
    }
  };
</script>
