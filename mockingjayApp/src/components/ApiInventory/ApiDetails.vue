<template>
  <div id="pn_details">
    <h1>General</h1>
    <div>
      <label for="ipt_path">Path: </label>
      <input id="ipt_path" v-model="details.path" v-on:change="validPath" ><br/>
      <label for="ipt_method">Method: </label>
      <input id="ipt_method" v-model="details.method" v-on:change="validPath" ><br/>
      <label for="ck_mock">Mock: </label>
      <input type="checkbox" id="ck_mock" v-model="details.mock" v-on:change="validPath" ><br/>
    </div>

    <h1>Mocking config</h1>
    <div id="dv_mockCfg">
      <label for="checkbox">Validate Req: </label>
      <input type="checkbox" id="ck_valiReq" v-model="details.mockCfg.validateReq" v-on:change="validPath" ><br/>
      <h2>Request description</h2>
      <h3>Queries</h3>
      <div>
        <KeyValidationEditor :key="keyDesc.key" v-for="keyDesc in details.mockCfg.reqDescriptor.queries" v-bind:keyDesc="keyDesc"></KeyValidationEditor>
      </div>
      <h3>Headers</h3>
      <div>
        <KeyValidationEditor :key="keyDesc.key" v-for="keyDesc in details.mockCfg.reqDescriptor.headers" v-bind:keyDesc="keyDesc"></KeyValidationEditor>
      </div>
      <h3>Body</h3>
      <div>
        <BodyValidationEditor v-bind:bodyDesc="details.mockCfg.reqDescriptor.body" ></BodyValidationEditor>
      </div>
      <h2>Response description</h2>
      <h3>Headers</h3>
      <div>
        <KeyReactorEditor :key="keyDesc.key" v-for="keyDesc in details.mockCfg.resDescriptor.headers" v-bind:keyDesc="keyDesc"></KeyReactorEditor>
      </div>
      <h3>Body</h3>
      <div>
        <BodyReactorEditor v-bind:bodyDesc="details.mockCfg.resDescriptor.body" ></BodyReactorEditor>
      </div>
    </div>
  </div>
</template>

<script>

const localComponents = {};

const keyValiEditor = require('./KeyValidationEditor')
localComponents[keyValiEditor.name] = keyValiEditor.opts;
const bodyValiEditor = require('./BodyValidationEditor')
localComponents[bodyValiEditor.name] = bodyValiEditor.opts;
const keyReactEditor = require('./KeyReactorEditor')
localComponents[keyReactEditor.name] = keyReactEditor.opts;
const bodyReactEditor = require('./BodyReactorEditor')
localComponents[bodyReactEditor.name] = bodyReactEditor.opts;

export default {
  name: "ApiList",
  data() {
    return {
    };
  },
  computed: {
    details: function() {
      let detailss = this.$store.state.apiDetails
      return detailss
    }
  },
  mounted: function() {

  },
  methods: {
    validPath: function() {
      console.log(this.details.path);
    }
  },
  components: localComponents
};
</script>

<style>

#pn_details {
  margin: 80px 0 80px 200px;
  text-align: left;
}

#pn_details input {
  height: 28px;
  margin: 5px;
}

#pn_details label {
  display: inline-block;
  width: 120px;
}

#pn_details .div-key {
  width: 80%;
  border: 1px dashed #000;
  margin: 5px 0 0 20px;
}

#pn_details textarea {
  width: 800px;
  height: 300px;
}

</style>
