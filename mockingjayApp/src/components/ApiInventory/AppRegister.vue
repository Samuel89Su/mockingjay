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
    <select id="ipt_forwardTarget" value="dev" v-model="app.apiForwardTarget">
      <option value="dev">dev</option>
      <option value="beta">beta</option>
      <option value="prod">prod</option>
    </select>
    <br/>
    <div :key="key" v-for="(val, key) in app.targets">
      <h5>{{ key }}</h5>
      <input :id="'ipt_target_' + key" v-model="app.targets[key]" />
    </div>
    <br/>

    <button id="btn_submit" v-on:click="register($event.target)">Apply</button>
    <button id="btn_discard" v-on:click="discard($event.target)">Discard</button>
  </div>
</template>

<script>

  const InventoryAPI = require('./InventoryAPI')
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
          apiForwardTarget: "dev",
          targets: {
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
      register: function (target) {
        target.disabled = true
        let url = this.app.id > 0 ? InventoryAPI.appUpdate : InventoryAPI.appRegister
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
            target.disabled = false
          })
          .then(() => {
            target.disabled = false
          })
      },
      discard: function () {
        target.disabled = true
        if (!confirm('no chance to recover after discard, proceed ?')) {
          return
        } else {
          target.disabled = false
        }

        let postData = JSON.stringify({ id: this.app.id, name: this.app.name })
        fetch(InventoryAPI.appDiscard, 
          {
            method: "POST",
            headers: cusHeaders,
            body: postData
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
              // go back
              this.$router.push({
                name: 'applist'
              })
            }
          })
          .catch(error => {
            console.log(error)
            target.disabled = false
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

  #btn_discard {
    position: fixed;
    top: 720px;
    left: 1440px;
    width: 120px;
    height: 50px;
    background: rgb(122, 5, 5);
    color: white;
  }

</style>
