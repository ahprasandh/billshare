<template>
  <div
    class="pMt"
    v-bind:style="{
      background: photo
        ? 'url(' + photo + ') no-repeat center'
        : showAsGuest
        ? ''
        : 'var(--soft)'
    }"
  >
    <span
      v-if="!photo && !showAsGuest"
      v-bind:style="{ background: 'var(--soft)' }"
      v-text="text.substring(0, 2)"
    ></span>
  </div>
</template>
<script>
export default {
  name: "Photo",
  props: ["photo", "showAsGuest", "text"]
};
</script>

<style>
.pMt {
  padding: 0 !important;
  margin: -0.6vh 0.3vw -0.6vh -0.1vh !important;
  display: flex;
  height: 3vh;
  width: 3vh;
  justify-content: center;
  background: var(--soft);
  border-radius: 2.4vh;
  background: url(/billshare/img/guest.svg) no-repeat center;
  background-size: cover !important;
}

.pMt span {
  color: #fff;
  display: block;
  align-self: center;
  text-transform: uppercase;
  font-size: var(--smallSize);
  font-weight: var(--fontbold);
}
</style>
