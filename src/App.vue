<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
#app {
  color: #2c3e50;
}
</style>
<script>
export default {
  name: "app",
  mounted() {
    this.init();
  },
  methods: {
    init: function() {}
  }
};
</script>
