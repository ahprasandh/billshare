<template>
  <div>
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
      ...mapState(["isAdmin","personCollection"])
    },
    props: [],
    data() {
      return {
      }
    },
    mounted() {
      this.initPersons()
    },
    methods: {
      initPersons() {
        // fb.personCollection.orderBy("name", "asc").onSnapshot(querySnapshot => {
        //   // console.log(querySnapshot)
        //   var personCollection = [];
        //   querySnapshot.forEach(doc => {
        //     let person = doc.data();
        //     person.id = doc.id;
        //     person.modified = false;
        //     personCollection.push(person);
        //   });
        //   this.personCollection = personCollection;
        // });
        var personCollection=[{"createdOn":{"seconds":1551755372,"nanoseconds":440000000},"expenses":{"JUKFvvgzQ19QX6xFCj9P":{"cost":10,"date":{"seconds":1551761945,"nanoseconds":449000000},"id":"JUKFvvgzQ19QX6xFCj9P"}},"name":"Hari","photo":null,"toPay":10,"id":"1","modified":false},{"createdOn":{"seconds":1551755412,"nanoseconds":699000000},"expenses":{"JUKFvvgzQ19QX6xFCj9P":{"cost":45,"date":{"seconds":1551761945,"nanoseconds":452000000},"id":"JUKFvvgzQ19QX6xFCj9P"}},"name":"Hari 2","photo":null,"toPay":45,"id":"2","modified":false},{"createdOn":{"seconds":1551755508,"nanoseconds":213000000},"expenses":{"JUKFvvgzQ19QX6xFCj9P":{"cost":45,"date":{"seconds":1551761945,"nanoseconds":453000000},"id":"JUKFvvgzQ19QX6xFCj9P"}},"name":"Hari 3","photo":null,"toPay":45,"id":"3","modified":false},{"createdOn":{"seconds":1551755511,"nanoseconds":490000000},"expenses":{},"name":"Hari 4","photo":null,"toPay":0,"id":"4","modified":false},{"createdOn":{"seconds":1551755511,"nanoseconds":490000000},"expenses":{},"name":"Hari 5","photo":null,"toPay":0,"id":"5","modified":false}]
        this.$store.commit("setPersonCollection", personCollection);
      },
      deletePeople(id) {
        fb.personCollection
          .doc(id)
          .delete()
          .then(function() {
            alert("Person successfully deleted!");
          })
          .catch(function(error) {
            console.error("Error removing Person: ", error);
          });
      }
    }
  };
</script>
