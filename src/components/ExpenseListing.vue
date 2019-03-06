<template>
  <div>
    <div class="ewT">
      Expenses <span>({{ expenseCollection.length }})</span>
    </div>
    <div class="ewCon">
      <Expense v-for="(expense, iter) in expenseCollection" :key="expense.id" :expense="expense" :personCollection="personCollection" :expenseIteration="iter" :expand="expense.expand" />
    </div>
    <div class="neBut" @click="addExpense">+</div>
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
  import {
    setTimeout
  } from 'timers';
  export default {
    name: "ExpenseListing",
    props: ["personCollection", "expenseCollection"],
    computed: {
      ...mapState(["isAdmin"])
    },
    components: {
      Expense
    },
    data() {
      return {};
    },
    mounted() {},
    methods: {
      expandExpense() {
        if (this.expenseCollection && this.expenseCollection[0].id !== "new") {
          if (this.$route.query.expense && this.$route.query.expense === "new") {
            var tempCollection = [{
              id: "new",
              expand: false
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
              "expenseTot_" + this.$route.query.expense
            );
            console.log(elem);
            if (elem) {
              elem.scrollIntoView(false);
            }
          }
        }
      },
      addExpense() {
        if (this.$route.query.expense===undefined ){
          this.pushRouter("new");
        }else if(this.$route.query.expense !== "new") {
          this.pushRouter("new");
        }
      },
      expenseAdded() {
        this.$parent.init();
      },
      expandFromChild(id) {
        if (this.expenseCollection[0].id === "new") {
          this.expenseCollection[0].id="TEMP_"+Math.random();
          let func=this.pushRouter
          setTimeout(function(){
            func(id)
          },200)
        }else{
          this.pushRouter(id);
        }
      },
      pushRouter(id){
        router.push({
          query: {
            expense: id
          }
        });
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
