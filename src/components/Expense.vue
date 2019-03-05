<template>
  <div>
    <div>Bill Listed</div>
    {{ expenseCollection }}
    <div @click="show.editor = true">+</div>
    <NewExpense
      v-if="isAdmin && show.editor"
      :personCollection="personCollection"
    ></NewExpense>
  </div>
</template>

<script>
import { mapState } from "vuex";
import NewExpense from "@/components/NewExpense.vue";
export default {
  name: "ExpenseListing",
  computed: {
    ...mapState(["isAdmin"])
  },
  components: {
    NewExpense
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
