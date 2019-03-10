<template>
  <div>
    <div class="ewT">
      Persons <span>({{ personCollection.length }})</span>
    </div>
    <div id="personContainer" class="ewCon" v-if="personCollection.length>0">
      <Person v-for="person in personCollection" :key="person.id" :person="person" :expand="person.expand" :modified="person.modified" :modifyBalPay="person.modify.balPayRequired" :modifyMode="person.modify.mode" :modifyCost="person.modify.cost" :modifyName="person.modify.name"></Person>
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
            <label class="bs-edit">
              <input id="imgUpload" @change="photoChanged" type='file' accept=".png, .jpg, .jpeg" />
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
    <div v-if="isAdmin" class="addPerTrig" @click="showEditor('new',null,null,'Add Person')">+ New</div>
  </div>
</template>

<script>
  import {
    mapState
  } from "vuex";
  import fb from "@/firebaseConfig";
  import Person from "@/components/Person.vue";
  import router from "@/router";
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
          name: '',
          photo: null
        },
        error: null
      }
    },
    mounted() {
      this.initPersons()
    },
    methods: {
      initPersons() {
        this.show.editor=false;
        var _this = this
        fb.personCollection.orderBy("name", "asc").onSnapshot(querySnapshot => {
          var personCollection = []
          querySnapshot.forEach(doc => {
            let person = doc.data();
            person.id = doc.id;
            person.modified = false;
            person.expand = false;
            person.modify = {
              name: null,
              cost: 0,
              toPay: 0,
              mode: null,
            }
            personCollection.push(person);
            if (personCollection.length === querySnapshot.size) {
              _this.commitToStore(personCollection)
            }
          });
        });
  
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
            this.personCollection[i].expand = this.$route.query.person === this.personCollection[i].id;
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
            }
          }
          var person = {
            createdOn: new Date(),
            name: this.editor.name,
            photo: this.editor.photo,
            expenses: this.editor.expenses,
            paid: this.editor.payment.balPayRequired === 0,
            payment: this.editor.payment
          };
          var _this = this
          if (this.editor.id === 'new') {
            fb.personCollection
              .add(person)
              .then(ref => {
                _this.closeEditor();
                _this.initPersons();
              })
              .catch(err => {
                _this.closeEditor();
                _this.showError("Something Went Wrong");
              });
          } else {
            fb.personCollection
              .doc(this.editor.id)
              .set(person, {
                merge: true
              })
              .then(function() {
                _this.closeEditor();
                _this.initPersons();
              })
              .catch(function(error) {
                _this.closeEditor();
                _this.showError("Something Went Wrong");
              });
          }
  
          console.log(person)
        } else {
          this.showError("Name Cannot be Empty")
        }
      },
      showError(message) {
        this.error = message;
        setTimeout(this.hideError, 2000);
      },
      hideError() {
        this.error = null;
      },
      photoChanged() {
        var input = document.getElementById("imgUpload")
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          var _this = this
          reader.onload = function(e) {
            if(Math.ceil(e.total/1024)<500){
              _this.editor.photo = e.currentTarget.result;
            }else{
              _this.showError("File Size should be less than 500 Kb")
            }
          }
          reader.readAsDataURL(input.files[0]);
        }
      },
      showEditor(id, name, photo, but, payment, expenses) {
        this.editor.id = id;
        this.editor.name = name;
        this.editor.photo = photo;
        this.editor.but = but;
        this.editor.payment = payment;
        this.editor.expenses = expenses
        this.show.editor = true;
      },
      closeEditor() {
        this.show.editor = false;
        this.editor.id = null;
        this.editor.photo = null;
      },
      editPerson(person) {
        this.showEditor(person.id, person.name, person.photo, "Edit Person", person.payment, person.expenses)
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
    top: 1em;
    right: 1em;
    color: #3360ff;
    font-size: 1.2em;
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
    max-width: 120px;
    margin: 50px auto;
  }
  
  .avatar-edit {
    position: absolute;
    right: 0px;
    z-index: 1;
    top: -5px;
  }
  
  .avatar-edit input {
    display: none;
  }
  
  .avatar-edit label {
    display: inline-block;
    width: 34px;
    height: 34px;
    margin-bottom: 0;
    border-radius: 100%;
    background: #FFFFFF;
    border: 1px solid transparent;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
    cursor: pointer;
    font-weight: normal;
    transition: all 0.2s ease-in-out;
  }
  
  .avatar-edit label:hover {
    background: #f1f1f1;
    border-color: #d6d6d6;
  }
  
  .avatar-edit label:before {
    color: #757575;
    position: absolute;
    top: 10px;
    left: 0;
    right: 0;
    text-align: center;
    margin: auto;
  }
  
  .avatar-preview {
    overflow: hidden;
    width: 100px;
    height: 100px;
    position: relative;
    border-radius: 100%;
    border: 6px solid #F8F8F8;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  }
  
  .avatar-preview img {
    height: 100%;
    width: 100%;
  }
  
  .avatar-preview>div {
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
    background: #5e2fb4;
    color: #fff;
    padding: 0.4em 1em 0.2em 1em;
    text-transform: uppercase;
  }
  
  .apCon .cBut {
    position: absolute;
    font-size: 2em;
    top: 0.2em;
    right: 0.2em;
    cursor: pointer;
  }
</style>
