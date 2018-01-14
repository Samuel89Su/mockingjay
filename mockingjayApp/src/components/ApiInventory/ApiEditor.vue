<template>
  <div>
    <label for="ipt_name">Name: </label>
    <input id="ipt_name" v-model="api.name" /><br/>

    <h4>Description</h4>
    <textarea id="ipt_description" v-model="api.description" /><br/>
    
    <label for="ipt_method">Method: </label>
    <select id="ipt_method" v-model="api.method" value="GET">
      <option value="GET">GET</option>
      <option value="POST">POST</option>
    </select><br/>
    
    <label for="ipt_path">Path: </label>
    <input id="ipt_path" v-model="api.path" /><br/>    
    
    <label for="ipt_validate">Validate: </label>
    <input type="checkbox" id="ipt_validate" v-model="api.validate"><br/>    
    
    <label for="ipt_forward">Forward: </label>
    <input type="checkbox" id="ipt_forward" v-model="api.forward"><br/> 
    
    <label for="ipt_logReq">LogReq: </label>
    <input id="ipt_logReq" v-model="api.logReq" /><br/>

    <button id="btn_submit" v-on:click="register">Apply</button>
  </div>
</template>

<script>
  const InventoryAPI = require('./InventoryAPI')

  const cusHeaders = new Headers();
  cusHeaders.append("Content-Type", "application/json");

  export default {
    name: "ApiEditor",
    data() {
      return {
        api: {
            appId: 0,
            apiId: 0,
            name: null,
            description: null,
            method: "GET",
            path: null,
            validate: false,
            forward: false,
            logReq: 0
          }
      }
    },
    mounted: function () {
        this.$data.api = this.$store.state.ApiSketch
    },
    methods: {
      register: function () {
        let url = this.api.apiId > 0 ? InventoryAPI.apiUpdate : InventoryAPI.apiRegister
        let postStr = JSON.stringify(this.api)
        fetch(url, {
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
                this.$data.api = retData.data
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
