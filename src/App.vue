<template>
  <div id="app">
    <router-view />
  </div>
</template>
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
