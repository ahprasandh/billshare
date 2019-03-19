<template>
  <div class="proC">
    <div class="proW">
      <div class="avatar-upload">
        <div class="avatar-edit">
          <label class="editdiv">
            <i class="bs-edit" />
            <input
              id="imgProUpload"
              @change="photoChanged"
              type="file"
              accept=".png, .jpg, .jpeg"
            />
          </label>
        </div>
        <div class="avatar-preview">
          <img v-if="photo" :src="photo" />
          <img v-else src="../assets/guest.svg" />
        </div>
      </div>
      <div class="proNC">
        <div v-if="edit">
          <input type="text" v-model="name" />
          <input type="email" v-model="email" />
          <input type="password" v-model="password" />
          <div class="butPB" style="float:right" @click.stop="save">
            Save
          </div>
        </div>
        <div class="proNW" v-else @click.stop="edit = true">
          <span v-text="name" />
          <span class="proE" v-text="email" />
        </div>
      </div>
    </div>
    <div class="proLog" title="Logout" @click="logout">
      <i class="bs-logout"></i>
      <span>Sign Out</span>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

import serverUtils from "@/serverUtils";
export default {
  name: "Profile",
  computed: {
    ...mapState(["currentUser", "photos"])
  },
  data() {
    return { name: "", email: "", photo: null, edit: false, password: null };
  },
  mounted() {
    console.log(this.currentUser);
    this.name = this.currentUser.displayName;
    this.email = this.currentUser.email;
    this.photo = this.photos[this.currentUser.uid]
      ? this.photos[this.currentUser.uid]
      : null;
  },
  methods: {
    photoChanged() {
      var input = document.getElementById("imgProUpload");
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        var _this = this;
        reader.onload = function(e) {
          if (Math.ceil(e.total / 1024) < 25) {
            _this.photo = e.currentTarget.result;
          } else {
            alert("File Size should be less than 25 Kb");
          }
        };
        reader.readAsDataURL(input.files[0]);
      }
    },
    logout: function() {
      serverUtils.logout(this.logoutCallBack);
    },
    logoutCallBack() {
      this.$store.commit("setCurrentUser", null);
      this.$router.replace("login");
    },
    save() {
      this.edit = false;
      //   this.currentUser.updateProfile({
      //     displayName: this.name
      //   });
      //   this.currentUser
      //     .updateEmail(this.email)
      //     .then(user => {
      //       console.log(user);
      //     })
      //     .catch(err => console.log(err));
      //   if (this.password && this.password.length > 0) {
      //     this.currentUser.updatePassword(this.password).then(user => {
      //       console.log(user);
      //     });
      //   }
      if (this.photo) {
        console.log(this.photo, this.currentUser.uid);
        serverUtils.savePhoto(
          this.currentUser.uid,
          this.photo,
          this.printR,
          this.printR
        );
      }
    },
    printR(r) {
      console.log(r);
    }
  }
};
</script>
<style>
.proC {
  position: absolute;
  right: 1vw;
  top: 3vh;
  z-index: 1;
  background: #fff;
  box-shadow: 0 0 0.3em 0.2em rgba(0, 0, 0, 0.5);
  font-size: var(--normal);
  color: var(--textcolor);
}
.proW {
  float: left;
  display: flex;
  margin: 1vh 1vw;
}

.proNC {
  align-self: center;

  max-width: 20vh;
  overflow: hidden;
}
.proNW {
  display: flex;
  flex-direction: column;
}

.proE {
  color: var(--soft);
  font-size: var(--smallSize);
}
.proLog {
  height: 3vh;
  width: calc(100% - 2vw);
  display: flex;
  border-top: 1px solid #cacaca;
  justify-content: flex-end;
  padding: 0 1vw;
}
.proLog .bs-logout,
.proLog span {
  height: unset;
  align-self: center;
  font-size: var(--smallSize);
}
.proLog:hover {
  color: var(--soft);
}
</style>
