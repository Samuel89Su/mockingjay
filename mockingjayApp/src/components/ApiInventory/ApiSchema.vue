<template>
  <div v-if="schema !== undefined && schema !== null" id="pn_schema">
    <h1>General</h1>
    <div>
      <span id="sp_method">{{ sketch.method }}</span>
      <span id="sp_path">{{ sketch.path }}</span><br/>
    </div>

    <h1>Request</h1>
    <h2>Query</h2>
    <div id="dv_scm_query">
      <textarea id="ipt_query" v-model="schema.properties.query" />
    </div>
    
    <h2>Headers</h2>
    <div id="dv_scm_req_header">
      <textarea id="ipt_req_header" v-model="schema.properties.reqHeaders" />
    </div>
    
    <h2>Body</h2>
    <div id="dv_scm_req_body">
      <textarea id="ipt_req_body" v-model="schema.properties.reqBody" />
    </div>

    <h1>Response</h1>    
    <h2>Headers</h2>
    <div id="dv_scm_res_header">
      <textarea id="ipt_res_header" v-model="schema.properties.resHeaders" />
    </div>
    
    <h2>Body</h2>
    <div id="dv_scm_res_body">
      <textarea id="ipt_res_body" v-model="schema.properties.resBody" />
    </div>

    <button id="btn_submit" v-on:click="updateSchema">Apply</button>

  </div>
</template>

<script>
const schemaTemplate = require('./ApiSchemaTemplate')
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
  created: function() {
    this.$data.schema = schemaTemplate
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
            let dummy = Object.assign({}, retData.data)
            if (dummy && dummy.properties) {
                for (const key in dummy.properties) {
                    if (dummy.properties.hasOwnProperty(key)) {
                        dummy.properties[key] = JSON.stringify(dummy.properties[key])                       
                    }
                }
            }
            console.log(dummy)
            this.$data.schema = dummy

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
      
      let data = { appId: this.sketch.appId, apiId: this.sketch.apiId, schema: this.schema }
      let postStr = JSON.stringify(data)
      fetch('./inventory/api/updateSchema', {
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
              if (retData.data.properties) {
                for (const key in retData.data.properties) {
                  if (retData.data.properties.hasOwnProperty(key)) {
                    retData.data.properties[key] = JSON.stringify(retData.data.properties[key])                       
                  }
                }
              }
              this.$data.schema = retData.data
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
      
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
