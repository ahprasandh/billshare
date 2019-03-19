<template>
  <div>
    <div class="ewT">
      Persons <span>({{ personCollection.length }})</span>
    </div>
    <div id="personContainer" class="ewCon" v-if="personCollection.length > 0">
      <Person
        v-for="person in personCollection"
        :key="person.id"
        :person="person"
        :expand="person.expand"
        :modified="person.modified"
        :modifyBalPay="person.modify.balPayRequired"
        :modifyMode="person.modify.mode"
        :modifyCost="person.modify.cost"
        :modifyName="person.modify.name"
      ></Person>
    </div>
    <div class="addPerEdit" v-if="isAdmin && show.editor">
      <div class="overlay" @click="closeEditor"></div>
      <div class="apCon">
        <div class="err" v-if="error">
          <span v-text="error"></span>
        </div>
        <span class="cBut" @click="closeEditor">&times;</span>
        <div class="avatar-upload">
          <div class="avatar-edit">
            <label class="editdiv">
              <i class="bs-edit" />
              <input
                id="imgUpload"
                @change="photoChanged"
                type="file"
                accept=".png, .jpg, .jpeg"
              />
            </label>
          </div>
          <div class="avatar-preview">
            <img v-if="editor.photo" :src="editor.photo" />
            <img v-else src="../assets/guest.svg" />
          </div>
        </div>
        <input type="text" v-model="editor.name" placeholder="Enter Name" />
        <div class="apButW">
          <span @click="addPerson" class="apBut" v-text="editor.but"></span>
        </div>
      </div>
    </div>
    <div
      v-if="isAdmin"
      class="addPerTrig"
      @click="showEditor('new', null, null, 'Add Person')"
    >
      + Person
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Person from "@/components/Person.vue";
import router from "@/router";
import serverUtils from "@/serverUtils";
export default {
  name: "PersonListing",
  components: {
    Person
  },
  computed: {
    ...mapState(["isAdmin", "personCollection"])
  },
  props: [],
  data() {
    return {
      show: {
        editor: false
      },
      editor: {
        id: null,
        name: "",
        photo: null,
        expenses: {}
      },
      error: null
    };
  },
  mounted() {
    this.initPersons();
  },
  methods: {
    initPersons() {
      this.show.editor = false;
      serverUtils.getPersonList(this.commitToStore);
      // var personCollection=[{"createdOn":{"seconds":1551755372,"nanoseconds":440000000},"expenses":{"JUKFvvgzQ19QX6xFCj9P":{"cost":10,"date":{"nanoseconds":449000000,"seconds":1551761945},"id":"JUKFvvgzQ19QX6xFCj9P"},"kCdK1o1Ap4eu5o0c14M8":{"cost":50,"date":{"seconds":1551878161,"nanoseconds":84000000},"id":"kCdK1o1Ap4eu5o0c14M8","name":"11"}},"name":"Hari","paid":false,"photo":null,"expand":false,"toPay":60,"id":"c1EWlrtEXQURuYc6XNvi","modified":false,"modify":{"name":null,"cost":0,"toPay":0,"mode":null}},{"createdOn":{"seconds":1551755412,"nanoseconds":699000000},"expenses":{"JUKFvvgzQ19QX6xFCj9P":{"cost":45,"date":{"nanoseconds":452000000,"seconds":1551761945},"id":"JUKFvvgzQ19QX6xFCj9P"},"kCdK1o1Ap4eu5o0c14M8":{"cost":50,"date":{"seconds":1551878161,"nanoseconds":85000000},"id":"kCdK1o1Ap4eu5o0c14M8","name":"11"}},"name":"Hari 2","paid":false,"photo":null,"expand":false,"toPay":95,"id":"XO1WQUh6mE3ALI9bhfYF","modified":false,"modify":{"name":null,"cost":0,"toPay":0,"mode":null}},{"createdOn":{"seconds":1551755508,"nanoseconds":213000000},"expenses":{"JUKFvvgzQ19QX6xFCj9P":{"cost":45,"date":{"seconds":1551761945,"nanoseconds":453000000},"id":"JUKFvvgzQ19QX6xFCj9P"}},"name":"Hari 3","paid":false,"photo":null,"expand":false,"toPay":45,"id":"Hk8MhHaVI4mmgZCFzNOc","modified":false,"modify":{"name":null,"cost":0,"toPay":0,"mode":null}},{"createdOn":{"seconds":1551755511,"nanoseconds":490000000},"expenses":{},"name":"Hari 4","paid":true,"photo":null,"expand":false,"toPay":0,"id":"Dfl2KF4MPMX3tkRGodvc","modified":false,"modify":{"name":null,"cost":0,"toPay":0,"mode":null}}]
      // this.commitToStore(personCollection);
    },
    commitToStore: function(personCollection) {
      this.$store.commit("setPersonCollection", personCollection);
      this.$parent.hideLoading();
    },
    expandFromChild(id) {
      let query = Object.assign({}, this.$route.query);
      query.person = id;
      router.push({
        query: query
      });
    },
    expandPerson() {
      if (this.personCollection) {
        for (var i = 0; i < this.personCollection.length; i++) {
          this.personCollection[i].expand =
            this.$route.query.person === this.personCollection[i].id;
        }
        if (this.$route.query.person) {
          var elem = document.getElementById(
            "person_" + this.$route.query.person
          );
          if (elem) {
            setTimeout(function() {
              elem.scrollIntoView(true);
              document.getElementById("personContainer").scrollTop -= 100;
            }, 200);
          }
        }
      }
    },
    addPerson() {
      if (this.editor.name && this.editor.name.trim().length > 1) {
        if (!this.editor.payment) {
          this.editor.payment = {
            paid: 0,
            totalPayRequired: 0,
            balPayRequired: 0
          };
        }
        var person = {
          createdOn: new Date(),
          name: this.editor.name,
          expenses: this.editor.expenses ? this.editor.expenses : {},
          paid: this.editor.payment.balPayRequired === 0,
          payment: this.editor.payment
        };
        if (this.editor.id === "new") {
          serverUtils.addPerson(person, this.personAdded, this.errorHandler);
        } else {
          serverUtils.editPerson(
            this.editor.id,
            person,
            this.personAdded,
            this.errorHandler
          );
        }
        console.log(person);
      } else {
        this.showError("Name Cannot be Empty");
      }
    },
    errorHandler() {
      this.closeEditor();
      this.showError("Something Went Wrong");
    },
    personAdded(id) {
      if (this.editor.photo) {
        serverUtils.savePhoto(
          id,
          this.editor.photo,
          this.closeEditorAndInit,
          this.closeEditorAndInit
        );
      } else {
        this.closeEditorAndInit();
      }
    },
    closeEditorAndInit() {
      this.closeEditor();
      this.initPersons();
    },
    showError(message) {
      this.error = message;
      setTimeout(this.hideError, 2000);
    },
    hideError() {
      this.error = null;
    },
    photoChanged() {
      var input = document.getElementById("imgUpload");
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        var _this = this;
        reader.onload = function(e) {
          if (Math.ceil(e.total / 1024) < 25) {
            _this.editor.photo = e.currentTarget.result;
          } else {
            _this.showError("File Size should be less than 25 Kb");
          }
        };
        reader.readAsDataURL(input.files[0]);
      }
    },
    showEditor(id, name, photo, but, payment, expenses) {
      this.editor.id = id;
      this.editor.name = name;
      this.editor.photo = photo;
      this.editor.but = but;
      this.editor.payment = payment;
      this.editor.expenses = expenses;
      this.show.editor = true;
    },
    closeEditor() {
      this.show.editor = false;
      this.editor.id = null;
      this.editor.photo = null;
    },
    editPerson(person, photo) {
      this.showEditor(
        person.id,
        person.name,
        photo,
        "Edit Person",
        person.payment,
        person.expenses
      );
    }
  },
  watch: {
    "$route.query.person": function() {
      this.expandPerson();
    },
    personCollection: function() {
      setTimeout(this.expandPerson, 250);
    }
  }
};
</script>

<style>
.addPerTrig {
  cursor: pointer;
  position: absolute;
  top: 1vh;
  right: 1vw;
  color: var(--hard);
  font-size: var(--normalSize);
  background: #fff;
  padding: 0.3vw;
  border-radius: 0.3vw;
  border: 1px solid var(--hard);
}

.addPerEdit {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.addPerEdit .overlay {
  background: rgba(0, 0, 0, 0.5);
  height: 100%;
  width: 100%;
}

.apCon {
  background: #fff;
  height: calc(100% - 20%);
  width: calc(100% - 20%);
  top: 0;
  margin: 10%;
  position: absolute;
  z-index: 2;
}

.avatar-upload {
  position: relative;
  width: 50px;
  margin: 1vw;
}

.avatar-edit {
  position: absolute;
  right: 0px;
  z-index: 1;
  width: 100%;
  height: 100%;
}

.avatar-edit input {
  display: none;
}

.avatar-edit label {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin-bottom: 0;
  border-radius: 100%;
  background: rgba(0, 0, 0, 0.4);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  font-weight: normal;
  transition: all 0.2s ease-in-out;
  visibility: hidden;
}

.avatar-edit:hover .editdiv {
  visibility: visible;
}

.editdiv .bs-edit {
  height: unset;
  align-self: center;
}
.editdiv .bs-edit:before {
  color: #fff;
}

.avatar-preview {
  overflow: hidden;
  width: 50px;
  height: 50px;
  position: relative;
  border-radius: 100%;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
}

.avatar-preview img {
  height: 100%;
  width: 100%;
}

.avatar-preview > div {
  width: 100%;
  height: 100%;
  border-radius: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.apCon input {
  width: calc(100% - 1em);
  padding: 0 0.5em;
  font-size: 25px;
}

.apCon input::placeholder {
  color: #cacaca;
  font-size: 20px;
}

.apButW {
  width: 100%;
  margin: auto;
  text-align: center;
  bottom: 1em;
  position: absolute;
}

.apBut {
  cursor: pointer;
  margin: auto;
  border-radius: 0.2em;
  background: var(--hard);
  color: #fff;
  padding: 0.4em 1em 0.2em 1em;
  text-transform: uppercase;
  font-weight: var(--fontbold);
}

.apCon .cBut {
  position: absolute;
  font-size: 2em;
  top: 0.2em;
  right: 0.2em;
  cursor: pointer;
}

.apCon .cBut:hover {
  color: var(--hard);
}
</style>
