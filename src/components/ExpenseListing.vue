<template>
  <div>
    <div class="ewT">
      Expenses <span>({{ expenseCollection.length }})</span>
    </div>
    <div class="ewCon">
      <Expense
        v-for="(expense, iter) in expenseCollection"
        :key="expense.id"
        :expense="expense"
        :personCollection="personCollection"
        :expenseIteration="iter"
        :expand="expense.expand"
      />
    </div>
    <div class="neBut">+</div>
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
import { mapState } from "vuex";
import Expense from "@/components/Expense.vue";
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
  mounted() {
    // this.expandExpense()
  },
  methods: {
    expandExpense() {
      for (var i = 0; i < this.expenseCollection.length; i++) {
        this.expenseCollection[i].expand =
          this.$route.query.expense === this.expenseCollection[i].id;
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
    },
    expenseAdded() {
      this.$parent.init();
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
