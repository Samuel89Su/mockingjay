<template>
  <form id="fm_details">
    <div id="pn_details">
      <label for="ipt_path">Path: </label>
      <input id="ipt_path" v-model="details.path" v-on:change="validPath" ><br/>
      <label for="ipt_method">Method: </label>
      <input id="ipt_method" v-model="details.method" v-on:change="validPath" ><br/>
      <label for="ck_mock">Mock: </label>
      <input type="check" id="ck_mock" v-model="details.mock" v-on:change="validPath" ><br/>
    </div>
  </form>
</template>

<script>
export default {
  name: "ApiList",
  data() {
    return {
      details: {}
    };
  },
  mounted: function() {
    var dataStr = this.$route.query.data;
    this.details = JSON.parse(dataStr);
  },
  methods: {
    validPath: function() {
      console.log(this.details.path);
    }
  }
};
</script>

<style>

#pn_details {
  margin: 80px 0 80px 200px;
  text-align: left;
}
</style>
