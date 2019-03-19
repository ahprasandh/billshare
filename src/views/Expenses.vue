<template>
  <div class="mC">
    <div v-show="!show.loading" class="cW">
      <ExpenseListing class="eW" />
      <PersonListing class="uW" />
    </div>
    <div v-if="show.loading" class="cW">
      <FullLoading message="Wait while We prepare your Expenses..." />
    </div>
  </div>
</template>

<script>
import PersonListing from "@/components/PersonListing.vue";
import ExpenseListing from "@/components/ExpenseListing.vue";
import FullLoading from "@/components/FullLoading.vue";

export default {
  name: "SharedView",
  computed: {},
  components: {
    PersonListing,
    ExpenseListing,
    FullLoading
  },
  data() {
    return { show: { loading: true } };
  },
  methods: {
    hideLoading() {
      this.show.loading = false;
    }
  }
};
</script>

<style>
.cW {
  height: 100%;
  display: flex;
  width: 100%;
  overflow: hidden;
}

.uW,
.eW {
  border-radius: 0.036em;
  position: relative;
  -webkit-box-shadow: 0em 0em 0.6em 0.6em rgba(202, 202, 202, 0.34);
  -moz-box-shadow: 0em 0em 0.6em 0.6em rgba(202, 202, 202, 0.34);
  box-shadow: 0em 0em 0.6em 0.6em rgba(202, 202, 202, 0.34);
  background: #fff;
  float: left;
  margin: 3vw 1vw;
  width: 33vw;
  background: #f5f5f5;
  height: calc(100% - 6em);
}

.eW {
  background: #f5f5f5;
  width: 60vw;
  max-width: unset;
}

.listHead {
  overflow: hidden;
  height: 5vh;
  cursor: pointer;
  color: var(--textcolor);
  font-size: var(--titleSize);
}

.listBot {
  border-top: 0.06em solid #eaeaea;
  height: 5vh;
  overflow: hidden;
  visibility: hidden;
}

.listBot.expanded {
  visibility: visible;
}

.listHead i {
  opacity: 0;
  margin: 0 1vw;
}

.listHead:hover.listHead i,
.listHead.expanded.listHead i {
  color: #ccc;
  opacity: 1;
}

.listHead i.bs-edit:hover {
  color: #2196f3 !important;
}

.listHead i.bs-delete:hover {
  color: #f44336 !important;
}

.listHead.expanded {
  border-bottom: 0.06em solid #eaeaea;
}

.listLeft,
.listRight {
  float: left;
  display: flex;
  justify-content: center;
  flex-direction: row;
  height: 100%;
}

.listLeft {
  margin-left: 5%;
}

.listRight {
  float: right;
  margin-right: 5%;
}

.listLeft *,
.listRight * {
  float: left;
  align-self: center;
}

.listRight span {
  padding-left: 0.3em;
}

.listDetailsC {
  margin: 1vh 2vw;
  height: 100%;
  overflow: hidden;
  visibility: hidden;
  font-size: var(--normalSize);
  display: flex;
  flex-direction: column;
}

.listDetailsC.expanded {
  visibility: visible;
}

.currency {
  color: #6f6c6c;
  padding-right: 0.3em !important;
}

.mL2 {
  margin-left: 2vw;
}

.listDetailsW {
  width: 100%;
  color: #6f6f6f;
  height: 5vh;
  overflow: hidden;
}

.listDetailsFR {
  float: right;
  display: flex;
  height: 100%;
  justify-content: center;
}

.listDetailsFR * {
  float: left;
  align-self: center;
}
</style>
