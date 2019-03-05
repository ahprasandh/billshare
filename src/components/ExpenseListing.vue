<template>
  <div>
    <div>Bill Listed</div>
    {{ expenseCollection }}
    <div @click="show.editor = true">+</div>
    <Expense v-if="isAdmin && show.editor" :personCollection="personCollection" />
  </div>
</template>

<script>
  import {
    mapState
  } from "vuex";
  import Expense from "@/components/Expense.vue";
  export default {
    name: "ExpenseListing",
    computed: {
      ...mapState(["isAdmin"])
    },
    components: {
      Expense
    },
    data() {
      return {
        show: {
          editor: false
        }
      };
    },
    props: ["personCollection", "expenseCollection"],
    methods: {
      expenseAdded() {
        this.$parent.init();
      }
    }
  };
</script>
