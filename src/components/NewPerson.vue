<template>
  <div v-if="isAdmin">
    <input type="text" v-model="name" placeholder="Name" />
    <button @click="addPerson">Add Person</button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import fb from "../firebaseConfig";
export default {
  name: "PersonEditor",
  computed: {
    ...mapState(["isAdmin"])
  },
  data() {
    return {
      name: "",
      photo: null
    };
  },
  methods: {
    addPerson() {
      if (this.name && this.name.trim().length > 1) {
        var person = {
          createdOn: new Date(),
          name: this.name,
          photo: this.photo,
          id: 123
        };
        this.$parent.personCollection.push(person);
        // fb.personCollection.add(person).then(ref => {
        //   this.$parent.init();
        // }).catch(err => {
        //   console.log(err)
        // });
      }
    }
  }
};
</script>
