<template>
  <div>
    <a v-on:click="goToDetails(null)" href="javascript:void(0)">Register</a>
    <table id="tb_app">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Desc</th>
                <th>Details</th>
                <th>API List</th>
            </tr>
        </thead>
        <tbody>
            <tr :key="item.id" v-for="item in items">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.desc }}</td>
              <td>
                <a v-on:click="goToDetails(item)" href="javascript:void(0)">Details</a>
              </td>
              <td>
                <a v-on:click="goToApiList(item)" href="javascript:void(0)">api list</a>
              </td>
              <!-- <td><router-link :to="{ name: 'apilist', query: { appId: item.id }}">API list</router-link></td> -->
            </tr>
        </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "appList",
  data() {
    return {
      items: []
    };
  },
  mounted: function() {
    fetch("./inventory/app/list")
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
          if (retData.data && retData.data.length > 0) {
            for (let i = 0; i < retData.data.length; i++) {
              let app = retData.data[i]
              this.items.push(app);
            }
          }
        }
      })
      .catch(ex => {
        console.log(ex);
      });
  },
  methods: {
    goToDetails: function (appDetails) {
      if (!appDetails) {
        appDetails = null
      }
      this.$store.commit({
        type: 'setApp',
        AppDetails: appDetails
      })
      this.$router.push({
        name: 'appregister'
      })
    },
    goToApiList: function (appDetails) {
      this.$store.commit({
        type: 'setApp',
        AppDetails: appDetails
      })
      this.$router.push({
        name: 'apilist'
      })
    }
  }
};
</script>

<style>
#tb_app {
  width: 960px;
  text-align: left;
}

table tr {
  height: 30px;
}

table tr th:first-child {
  width: 60px
}

table tr th:nth-child(2) {
  width: 150px
}

table tr th:nth-child(3) {
  width: 500px
}

table tr th:nth-child(4) {
  width: 120px
}

table tr th:nth-child(5) {
  width: 120px
}


</style>
