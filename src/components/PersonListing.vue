<template>
  <div class="uW">
    <div v-if="personCollection.length == 0">No Persons Added</div>
    <div v-for="person in personCollection" :key="person.id">
      <div v-text="person.name"></div>
      <div v-if="person.modified">
        <div v-text="person.modify.toPay"></div>
        (
        <div v-text="
                person.toPay +
                  ' ' +
                  (person.modify.mode === 'add' ? '+' : '-') +
                  ' ' +
                  person.modify.change
              "></div>
        )
        <div v-if="person.change" v-text="person.change"></div>
      </div>
      <div v-if="!person.modified" class="pa" v-text="person.toPay"></div>
  
      <div v-if="isAdmin" @click="deletePeople(person.id)">&times;</div>
    </div>
    <Person v-if="isAdmin" />
  </div>
</template>

<script>
  import {
    mapState
  } from "vuex";
  import Person from "@/components/Person.vue";
  export default {
    name: "PersonListing",
    components: {
      Person
    },
    computed: {
      ...mapState(["isAdmin"])
    },
    props: ["personCollection"]
  };
</script>
