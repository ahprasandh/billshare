<template>
  <div>
    <div class="ewT">
      Expenses <span>({{ expenseCollection.length }})</span>
    </div>
    <div class="ewCon">
      <Expense v-for="(expense, iter) in expenseCollection" :key="expense.id" :expense="expense" :personCollection="personCollection" :expenseIteration="iter" :expand="expense.expand" :settings="settings"/>
    </div>
    <div class="neBut bs-add" @click="addExpense"></div>
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

  .neBut{
      background: #ff4081;
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
      box-shadow: 1px 1px 7px 3px rgb(0,0,0,0.5);
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
    props: ["settings","personCollection"],
    computed: {
      ...mapState(["isAdmin"])
    },
    components: {
      Expense
    },
    data() {
      return {expenseCollection:[]};
    },
    mounted() {
      this.initExpenses()
    },
    methods: {
      initExpenses() {
        // fb.expenseCollection
        //   .orderBy("createdOn", "desc")
        //   .onSnapshot(querySnapshot => {
        //     // console.log(querySnapshot)
        //     var expenseCollection = [];
        //     querySnapshot.forEach(doc => {
        //       let expense = doc.data();
        //       expense.id = doc.id;
        // expense.expand=false
        //       expenseCollection.push(expense);
        //     });
        //     this.expenseCollection = expenseCollection;
        //   });
        this.expenseCollection=[{cost:100,expand:!1,createdOn:{seconds:1551761944,nanoseconds:567e6},date:"22/08/2019",name:"B1",persons:{Hk8MhHaVI4mmgZCFzNOc:{cost:45,id:"Hk8MhHaVI4mmgZCFzNOc1",name:"Hari 3",omitSplit:!1},XO1WQUh6mE3ALI9bhfYF:{cost:45,id:"XO1WQUh6mE3ALI9bhfYF",name:"Hari 2",omitSplit:!1},c1EWlrtEXQURuYc6XNvi:{cost:10,id:"c1EWlrtEXQURuYc6XNvi",name:"Hari",omitSplit:!0}},id:"JUKFvvgzQ19QX6xFCj9P1"},{cost:100,expand:!1,createdOn:{seconds:1551761944,nanoseconds:567e6},date:"22/08/2019",name:"B1",persons:{Hk8MhHaVI4mmgZCFzNOc:{cost:45,id:"Hk8MhHaVI4mmgZCFzNOc",name:"Hari 3",omitSplit:!1},XO1WQUh6mE3ALI9bhfYF:{cost:45,id:"XO1WQUh6mE3ALI9bhfYF",name:"Hari 2",omitSplit:!1},c1EWlrtEXQURuYc6XNvi:{cost:10,id:"c1EWlrtEXQURuYc6XNvi",name:"Hari",omitSplit:!0}},id:"JUKFvvgzQ19QX6xFCj9P2"},{cost:100,expand:!1,createdOn:{seconds:1551761944,nanoseconds:567e6},date:"22/08/2019",name:"B1",persons:{Hk8MhHaVI4mmgZCFzNOc:{cost:45,id:"Hk8MhHaVI4mmgZCFzNOc",name:"Hari 3",omitSplit:!1},XO1WQUh6mE3ALI9bhfYF:{cost:45,id:"XO1WQUh6mE3ALI9bhfYF",name:"Hari 2",omitSplit:!1},c1EWlrtEXQURuYc6XNvi:{cost:10,id:"c1EWlrtEXQURuYc6XNvi",name:"Hari",omitSplit:!0}},id:"JUKFvvgzQ19QX6xFCj9P3"},{cost:100,expand:!1,createdOn:{seconds:1551761944,nanoseconds:567e6},date:"22/08/2019",name:"B1",persons:{Hk8MhHaVI4mmgZCFzNOc:{cost:45,id:"Hk8MhHaVI4mmgZCFzNOc",name:"Hari 3",omitSplit:!1},XO1WQUh6mE3ALI9bhfYF:{cost:45,id:"XO1WQUh6mE3ALI9bhfYF",name:"Hari 2",omitSplit:!1},c1EWlrtEXQURuYc6XNvi:{cost:10,id:"c1EWlrtEXQURuYc6XNvi",name:"Hari",omitSplit:!0}},id:"JUKFvvgzQ19QX6xFCj9P4"},{cost:100,expand:!1,createdOn:{seconds:1551761944,nanoseconds:567e6},date:"22/08/2019",name:"B1",persons:{Hk8MhHaVI4mmgZCFzNOc:{cost:45,id:"Hk8MhHaVI4mmgZCFzNOc",name:"Hari 3",omitSplit:!1},XO1WQUh6mE3ALI9bhfYF:{cost:45,id:"XO1WQUh6mE3ALI9bhfYF",name:"Hari 2",omitSplit:!1},c1EWlrtEXQURuYc6XNvi:{cost:10,id:"c1EWlrtEXQURuYc6XNvi",name:"Hari",omitSplit:!0}},id:"JUKFvvgzQ19QX6xFCj9P5"},{cost:100,expand:!1,createdOn:{seconds:1551761944,nanoseconds:567e6},date:"22/08/2019",name:"B1",persons:{Hk8MhHaVI4mmgZCFzNOc:{cost:45,id:"Hk8MhHaVI4mmgZCFzNOc",name:"Hari 3",omitSplit:!1},XO1WQUh6mE3ALI9bhfYF:{cost:45,id:"XO1WQUh6mE3ALI9bhfYF",name:"Hari 2",omitSplit:!1},c1EWlrtEXQURuYc6XNvi:{cost:10,id:"c1EWlrtEXQURuYc6XNvi",name:"Hari",omitSplit:!0}},id:"JUKFvvgzQ19QX6xFCj9P6"},{cost:100,expand:!1,createdOn:{seconds:1551761944,nanoseconds:567e6},date:"22/08/2019",name:"B1",persons:{Hk8MhHaVI4mmgZCFzNOc:{cost:45,id:"Hk8MhHaVI4mmgZCFzNOc",name:"Hari 3",omitSplit:!1},XO1WQUh6mE3ALI9bhfYF:{cost:45,id:"XO1WQUh6mE3ALI9bhfYF",name:"Hari 2",omitSplit:!1},c1EWlrtEXQURuYc6XNvi:{cost:10,id:"c1EWlrtEXQURuYc6XNvi",name:"Hari",omitSplit:!0}},id:"JUKFvvgzQ19QX6xFCj9P7"},{cost:100,expand:!1,createdOn:{seconds:1551761944,nanoseconds:567e6},date:"22/08/2019",name:"B1",persons:{Hk8MhHaVI4mmgZCFzNOc:{cost:45,id:"Hk8MhHaVI4mmgZCFzNOc",name:"Hari 3",omitSplit:!1},XO1WQUh6mE3ALI9bhfYF:{cost:45,id:"XO1WQUh6mE3ALI9bhfYF",name:"Hari 2",omitSplit:!1},c1EWlrtEXQURuYc6XNvi:{cost:10,id:"c1EWlrtEXQURuYc6XNvi",name:"Hari",omitSplit:!0}},id:"JUKFvvgzQ19QX6xFCj9P8"},{cost:100,expand:!1,createdOn:{seconds:1551761944,nanoseconds:567e6},date:"22/08/2019",name:"B1",persons:{Hk8MhHaVI4mmgZCFzNOc:{cost:45,id:"Hk8MhHaVI4mmgZCFzNOc",name:"Hari 3",omitSplit:!1},XO1WQUh6mE3ALI9bhfYF:{cost:45,id:"XO1WQUh6mE3ALI9bhfYF",name:"Hari 2",omitSplit:!1},c1EWlrtEXQURuYc6XNvi:{cost:10,id:"c1EWlrtEXQURuYc6XNvi",name:"Hari",omitSplit:!0}},id:"JUKFvvgzQ19QX6xFCj9P9"},{cost:100,expand:!1,createdOn:{seconds:1551761944,nanoseconds:567e6},date:"22/08/2019",name:"B1",persons:{Hk8MhHaVI4mmgZCFzNOc:{cost:45,id:"Hk8MhHaVI4mmgZCFzNOc",name:"Hari 3",omitSplit:!1},XO1WQUh6mE3ALI9bhfYF:{cost:45,id:"XO1WQUh6mE3ALI9bhfYF",name:"Hari 2",omitSplit:!1},c1EWlrtEXQURuYc6XNvi:{cost:10,id:"c1EWlrtEXQURuYc6XNvi",name:"Hari",omitSplit:!0}},id:"JUKFvvgzQ19QX6xFCj9P11"},{cost:100,expand:!1,createdOn:{seconds:1551761944,nanoseconds:567e6},date:"22/08/2019",name:"B1",persons:{Hk8MhHaVI4mmgZCFzNOc:{cost:45,id:"Hk8MhHaVI4mmgZCFzNOc",name:"Hari 3",omitSplit:!1},XO1WQUh6mE3ALI9bhfYF:{cost:45,id:"XO1WQUh6mE3ALI9bhfYF",name:"Hari 2",omitSplit:!1},c1EWlrtEXQURuYc6XNvi:{cost:10,id:"c1EWlrtEXQURuYc6XNvi",name:"Hari",omitSplit:!0}},id:"JUKFvvgzQ19QX6xFCj9P12"},{cost:100,expand:!1,createdOn:{seconds:1551761944,nanoseconds:567e6},date:"22/08/2019",name:"B1",persons:{Hk8MhHaVI4mmgZCFzNOc:{cost:45,id:"Hk8MhHaVI4mmgZCFzNOc",name:"Hari 3",omitSplit:!1},XO1WQUh6mE3ALI9bhfYF:{cost:45,id:"XO1WQUh6mE3ALI9bhfYF",name:"Hari 2",omitSplit:!1},c1EWlrtEXQURuYc6XNvi:{cost:10,id:"c1EWlrtEXQURuYc6XNvi",name:"Hari",omitSplit:!0}},id:"JUKFvvgzQ19QX6xFCj9P13"},{cost:100,expand:!1,createdOn:{seconds:1551761944,nanoseconds:567e6},date:"22/08/2019",name:"B1",persons:{Hk8MhHaVI4mmgZCFzNOc:{cost:45,id:"Hk8MhHaVI4mmgZCFzNOc",name:"Hari 3",omitSplit:!1},XO1WQUh6mE3ALI9bhfYF:{cost:45,id:"XO1WQUh6mE3ALI9bhfYF",name:"Hari 2",omitSplit:!1},c1EWlrtEXQURuYc6XNvi:{cost:10,id:"c1EWlrtEXQURuYc6XNvi",name:"Hari",omitSplit:!0}},id:"JUKFvvgzQ19QX6xFCj9P14"},{cost:100,expand:!1,createdOn:{seconds:1551761944,nanoseconds:567e6},date:"22/08/2019",name:"B1",persons:{Hk8MhHaVI4mmgZCFzNOc:{cost:45,id:"Hk8MhHaVI4mmgZCFzNOc",name:"Hari 3",omitSplit:!1},XO1WQUh6mE3ALI9bhfYF:{cost:45,id:"XO1WQUh6mE3ALI9bhfYF",name:"Hari 2",omitSplit:!1},c1EWlrtEXQURuYc6XNvi:{cost:10,id:"c1EWlrtEXQURuYc6XNvi",name:"Hari",omitSplit:!0}},id:"JUKFvvgzQ19QX6xFCj9P15"},{cost:100,expand:!1,createdOn:{seconds:1551761944,nanoseconds:567e6},date:"22/08/2019",name:"B1",persons:{Hk8MhHaVI4mmgZCFzNOc:{cost:45,id:"Hk8MhHaVI4mmgZCFzNOc",name:"Hari 3",omitSplit:!1},XO1WQUh6mE3ALI9bhfYF:{cost:45,id:"XO1WQUh6mE3ALI9bhfYF",name:"Hari 2",omitSplit:!1},c1EWlrtEXQURuYc6XNvi:{cost:10,id:"c1EWlrtEXQURuYc6XNvi",name:"Hari",omitSplit:!0}},id:"JUKFvvgzQ19QX6xFCj9P16"},{cost:100,expand:!1,createdOn:{seconds:1551761944,nanoseconds:567e6},date:"22/08/2019",name:"B1",persons:{Hk8MhHaVI4mmgZCFzNOc:{cost:45,id:"Hk8MhHaVI4mmgZCFzNOc",name:"Hari 3",omitSplit:!1},XO1WQUh6mE3ALI9bhfYF:{cost:45,id:"XO1WQUh6mE3ALI9bhfYF",name:"Hari 2",omitSplit:!1},c1EWlrtEXQURuYc6XNvi:{cost:10,id:"c1EWlrtEXQURuYc6XNvi",name:"Hari",omitSplit:!0}},id:"JUKFvvgzQ19QX6xFCj9P17"}];
      },
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
