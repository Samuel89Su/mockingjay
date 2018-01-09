<template>
  <div v-if="config !== undefined && config !== null" id="pn_details">
    <h1>General</h1>
    <div>
      <span id="sp_method">{{ config.method }}</span>
      <span id="sp_path">{{ config.path }}</span><br/>
      <label for="ck_mock">Mock</label>
      <input type="checkbox" id="ck_mock" v-model="config.mock" v-on:change="validPath">
    </div>
    <div id="dv_mockCfg">
      <label for="checkbox">Validate Request: </label>
      <input type="checkbox" id="ck_valiReq" v-model="config.mockCfg.validateReq" v-on:change="validPath" ><br/>
      <h2>Request description</h2>
      <h3>Queries</h3>
      <ul>
        <KeyValidationEditor :key="'mockCfg_reqDescriptor_queries_' + keyDesc.key" :keyPostfix="keyDesc.key" :id="'mockCfg_reqDescriptor_queries_' + keyDesc.key" v-if="keyDesc !== null" v-for="keyDesc in config.mockCfg.reqDescriptor.queries"></KeyValidationEditor>
      </ul>
      <h3>Headers</h3>
      <ul>
        <KeyValidationEditor :key="'mockCfg_reqDescriptor_headers_' + keyDesc.key" :keyPostfix="keyDesc.key" :id="'mockCfg_reqDescriptor_headers_' + keyDesc.key" v-if="keyDesc !== null" v-for="keyDesc in config.mockCfg.reqDescriptor.headers"></KeyValidationEditor>
      </ul>
      <h3>Body</h3>
      <div>
        <BodyValidationEditor keyPostfix="body" id="mockCfg_reqDescriptor_body"></BodyValidationEditor>
      </div>
      <h2>Response description</h2>
      <h3>Headers</h3>
      <ul>
        <KeyReactorEditor :key="'mockCfg_resDescriptor_headers_' + keyDesc.key" :keyPostfix="keyDesc.key" :id="'mockCfg_resDescriptor_headers_' + keyDesc.key" v-if="keyDesc !== null" v-for="keyDesc in config.mockCfg.resDescriptor.headers"></KeyReactorEditor>
      </ul>
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

const cusHeaders = new Headers();
cusHeaders.append("Content-Type", "application/json");

export default {
  name: "ApiList",
  data() {
    return {
      sketch: null,
      config: null
    }
  },
  mounted: function() {
    this.$data.sketch = this.$store.state.ApiSketch
    let postStr = JSON.stringify(this.sketch)
    fetch("./inventory/api/getApiConfig", {
        method: "POST",
        headers: cusHeaders,
        body: postStr
      })
      .then(res => {
        var contentType = res.headers.get("content-type")
        if (!res.ok) {
          return []
        } else if (!contentType || !contentType.includes("application/json")) {
          return []
        } else if (contentType && contentType.includes("application/json")) {
          return res.json()
        }
      })
      .then(retData => {
        if (retData.code !== 0) {
          return
        } else {
          if (retData.data) {
            this.$data.config = retData.data
            this.$store.commit({
              type: 'setApiConfig',
              ApiConfig: retData.data
            })
          }
        }
      })
      .catch(ex => {
        console.log(ex);
      });
  },
  methods: {
    validPath: function() {
    },
    updateDetails: function() {

      let children = this.$children
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        console.log(child.$data)
      }

      // let cusHeaders = new Headers();
      // cusHeaders.append("Content-Type", "application/json");
      let postStr = JSON.stringify(this.details)
      fetch('./inventory/api/updateConfig', {
          method: "POST",
          headers: cusHeaders,
          body: postStr
        })
        .then(res => {
          let contentType = res.headers.get('content-type')
          if (!res.ok) {
            return null
          } else if (!contentType || !contentType.includes('application/json')) {
            return null
          } else {
            return res.json()
          }
        })
        .then(retData => {
          if (retData.code !== 0) {
            return
          } else {
            if (retData.data) {
              this.$data.config = retData.data
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  components: localComponents
};
</script>

<style>

#sp_method {
  background-color: blue;
  color: white;
  font-size: 32;
  margin-right: 20px;
}

#sp_path {
  background-color: rgb(185, 184, 184);
  font-size: 30
}

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
  left: 1440px;
  width: 120px;
  height: 50px;
  background: blue;
  color: white;
}

</style>
