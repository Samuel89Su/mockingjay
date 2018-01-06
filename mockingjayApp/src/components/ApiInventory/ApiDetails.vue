<template>
  <div>{{ JSON.stringify(details) }}</div>
</template>

<script>
const queryString = require("querystring");

export default {
  name: "ApiList",
  data() {
    return {
      details: {}
    };
  },
  mounted: function() {
      var dataStr = this.$route.query.data;
      this.details = JSON.parse(dataStr)
  }
};
</script>

<style>

</style>
