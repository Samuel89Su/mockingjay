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
      <label for="checkbox">Validate Request: </label>
      <input type="checkbox" id="ck_valiReq" v-model="details.mockCfg.validateReq" v-on:change="validPath" ><br/>
      <h2>Request description</h2>
      <h3>Queries</h3>
      <ul>
        <KeyValidationEditor :key="'mockCfg_reqDescriptor_queries_' + keyDesc.key" :keyPostfix="keyDesc.key" :id="'mockCfg_reqDescriptor_queries_' + keyDesc.key" v-if="keyDesc !== null" v-for="keyDesc in details.mockCfg.reqDescriptor.queries"></KeyValidationEditor>
      </ul>
      <h3>Headers</h3>
      <ul>
        <KeyValidationEditor :key="'mockCfg_reqDescriptor_headers_' + keyDesc.key" :keyPostfix="keyDesc.key" :id="'mockCfg_reqDescriptor_headers_' + keyDesc.key" v-if="keyDesc !== null" v-for="keyDesc in details.mockCfg.reqDescriptor.headers"></KeyValidationEditor>
      </ul>
      <h3>Body</h3>
      <div>
        <BodyValidationEditor keyPostfix="body" id="mockCfg_reqDescriptor_body"></BodyValidationEditor>
      </div>
      <h2>Response description</h2>
      <h3>Headers</h3>
      <div>
        <KeyReactorEditor :key="'mockCfg_resDescriptor_headers_' + keyDesc.key" :keyPostfix="keyDesc.key" :id="'mockCfg_resDescriptor_headers_' + keyDesc.key" v-if="keyDesc !== null" v-for="keyDesc in details.mockCfg.resDescriptor.headers"></KeyReactorEditor>
      </div>
      <h3>Body</h3>
      <div>
        <BodyReactorEditor keyPostfix="body" id="mockCfg_resDescriptor_body"></BodyReactorEditor>
      </div>
    </div>

    <button id="btn_submit" v-on:click="updateDetails">Update</button>

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
    },
    updateDetails: function() {
      this.details.reqDescriptor
      console.log(this.details)
    }
  },
  components: localComponents
};
</script>

<style>

#pn_details {
  margin: 80px 0 80px 0px;
  text-align: left;
  width: 100%;
}

#pn_details input {
  height: 28px;
  margin: 5px;
}

#pn_details label {
  display: inline-block;
  width: 170px;
}

#pn_details input[type="checkbox"] {
  width: 20px;
  height: 20px;
}

#pn_details .div-key {
  width: 80%;
  border: 1px dashed #000;
  margin: 5px 0 0 20px;
  padding: 5px;
}

#pn_details textarea {
  width: 800px;
  height: 300px;
}

#btn_submit {
  position: fixed;
  top: 640px;
  left: 1400px;
  width: 120px;
  height: 50px;
  background: blue;
  color: white;
}

</style>
