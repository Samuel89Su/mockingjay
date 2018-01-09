<template>
  <table id="tb_api">
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Method</th>
        <th>Path</th>
        <th>Desc</th>
        <th>Schema</th>
        <th>Config</th>
      </tr>
    </thead>
    <tbody>
      <tr :key="item.apiId" v-for="item in items">
        <td>{{ item.apiId }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.method }}</td>
        <td>{{ item.path }}</td>
        <td>{{ item.description }}</td>
        <td>
          <a v-on:click="goToSchema(item)" href="javascript:void(0)">Schema</a>
        </td>
        <td>
          <a v-on:click="goToConfig(item)" href="javascript:void(0)">Config</a>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  export default {
    name: "ApiList",
    data() {
      return {
        items: [],
        appDetails: null
      }
    },
    mounted: function () {
      this.$data.appDetails = this.$store.state.AppDetails
      fetch('./inventory/api/list?appId=' + this.appDetails.id)
        .then(res => {
          let contentType = res.headers.get('content-type')
          if (!res.ok) {
            return []
          } else if (!contentType || !contentType.includes('application/json')) {
            return []
          } else if (contentType && contentType.includes('application/json')) {
            return res.json()
          }
        })
        .then(retData => {
          if (retData.code !== 0) {
            return
          } else {
            if (retData.data && retData.data.length > 0) {
              for (let i = 0; i < retData.data.length; i++) {
                this.items.push(retData.data[i])
              }
            }
          }
        })
        .catch(error => {
          console.log(error)
        });
    },
    methods: {
      goToSchema: function (apiSketch) {        
        this.$store.commit({
          type: 'setApiSketch',
          ApiSketch: apiSketch
        })
        this.$router.push({
          name: 'apiSchema'
        })
      },
      goToConfig: function (apiSketch) {        
        this.$store.commit({
          type: 'setApiSketch',
          ApiSketch: apiSketch
        })
        this.$router.push({
          name: 'apiConfig'
        })
      }
    }
  };

</script>

<style>
  #tb_api {
    width: 960px;
    text-align: left;
  }

  table tr {
    height: 30px;
  }

  table tr th:first-child {
    width: 100px;
  }

  table tr th:nth-child(2) {
    width: 200px;
  }

  table tr th:nth-child(3) {
    width: 300px;
  }

  table tr th:nth-child(4) {
    width: 120px;
  }

  table tr th:nth-child(5) {
    width: 120px;
  }

  table tr th:nth-child(6) {
    width: 120px;
  }

</style>
