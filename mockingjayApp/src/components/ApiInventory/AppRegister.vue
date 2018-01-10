<template>
  <div>
    <label for="ipt_name">Name: </label>
    <input id="ipt_name" v-model="app.name" />
    <br/>
    <h4>Description</h4>
    <textarea id="ipt_desc" v-model="app.desc" />
    <br/>
    <h4>Deployment</h4>    
    <label for="ipt_forwardTarget">Forward: </label>
    <select id="ipt_forwardTarget" value="dev" v-model="app.forwardTarget">
      <option value="dev">dev</option>
      <option value="beta">beta</option>
      <option value="prod">prod</option>
    </select>
    <br/>
    <h5>dev</h5>
    <input id="ipt_deployment_dev" v-model="app.deployment.dev" />
    <h5>beta</h5>
    <input id="ipt_deployment_beta" v-model="app.deployment.beta" />
    <h5>prod</h5>
    <input id="ipt_deployment_prod" v-model="app.deployment.prod" />
    <br/>

    <button id="btn_submit" v-on:click="register">Apply</button>
  </div>
</template>

<script>
  const cusHeaders = new Headers();
  cusHeaders.append("Content-Type", "application/json");

  export default {
    name: "AppRegister",
    data() {
      return {
        app: {
          id: 0,
          name: null,
          desc: null,
          forwardTarget: "dev",
          deployment: {
            dev: null,
            beta: null,
            prod: null
          }
        }
      }
    },
    mounted: function () {
        var details = this.$store.state.AppDetails
        if (details) {
          this.$data.app = details
        }
    },
    methods: {
      register: function () {
        let url = `./inventory/app/${ this.app.id > 0 ? 'update': 'register' }`
        let postStr = JSON.stringify(this.app)
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
                this.$data.app = retData.data
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
