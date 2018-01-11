<template>
  <div v-if="schema !== undefined && schema !== null" id="pn_schema">
    <h1>General</h1>
    <div>
      <span id="sp_method">{{ sketch.method }}</span>
      <span id="sp_path">{{ sketch.path }}</span><br/>
    </div>
    <div id="dv_schema">
      
    </div>

    <button id="btn_submit" v-on:click="updateSchema">Apply</button>

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
      sketch: {
          method: "GET",
          path: null
      },
      schema: null
    }
  },
  mounted: function() {    
    this.$data.sketch = this.$store.state.ApiSketch

    let postStr = JSON.stringify({ 
      appName: this.$store.state.AppDetails.name,
      apiId: this.sketch.apiId,
      path: this.sketch.path
      });
    fetch("./inventory/api/getApiSchema", {
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
            this.$data.schema = retData.data
            this.$store.commit({
              type: 'setApiSchema',
              ApiSchema: retData.data
            })
          }
        }
      })
      .catch(ex => {
        console.log(ex);
      });
  },
  methods: {
    updateSchema: function() {

      // let cusHeaders = new Headers();
      // cusHeaders.append("Content-Type", "application/json");
      let postStr = JSON.stringify(this.schema)
      
    }
  }
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

#pn_schema {
  margin: 80px 0 80px 0px;
  text-align: left;
  width: 100%;
}

#pn_schema input {
  height: 28px;
  margin: 5px;
}

#pn_schema label {
  display: inline-block;
  width: 170px;
}

#pn_schema input[type="checkbox"] {
  width: 20px;
  height: 20px;
}

#pn_schema .div-key {
  width: 80%;
  border: 1px dashed #000;
  margin: 5px 0 0 20px;
  padding: 5px;
}

#pn_schema textarea {
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
