<template>
  <div>
    <a v-on:click="goToDetails(null)" href="javascript:void(0)">Register</a>
    <table id="tb_api">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Method</th>
          <th>Validate</th>
          <th>Forward</th>
          <th>Path</th>
          <th>Desc</th>
          <th>Details</th>
          <th>Schema</th>
          <th>MockCfg</th>
        </tr>
      </thead>
      <tbody>
        <tr :key="item.apiId" v-for="item in items">
          <td>{{ item.apiId }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.method }}</td>
          <td>{{ item.validate }}</td>
          <td>{{ item.forward }}</td>
          <td>{{ item.path }}</td>
          <td>{{ item.description }}</td>
          <td>
            <a v-on:click="goToDetails(item)" href="javascript:void(0)">Details</a>
          </td>
          <td>
            <a v-on:click="goToSchema(item)" href="javascript:void(0)">Schema</a>
          </td>
          <td>
            <a v-on:click="goToConfig(item)" href="javascript:void(0)">MockCfg</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
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
      goToDetails: function (apiSketch) {
        if (!apiSketch) {
          apiSketch = {
            appId: this.appDetails.id,
            apiId: 0,
            name: null,
            description: null,
            method: "GET",
            path: null
          }
        }

        this.$store.commit({
          type: 'setApiSketch',
          ApiSketch: apiSketch
        })
        this.$router.push({
          name: 'apieditor'
        })
      },
      goToSchema: function (apiSketch) {
        this.$store.commit({
          type: 'setApiSketch',
          ApiSketch: apiSketch
        })
        this.$router.push({
          name: 'apischema'
        })
      },
      goToConfig: function (apiSketch) {
        this.$store.commit({
          type: 'setApiSketch',
          ApiSketch: apiSketch
        })
        this.$router.push({
          name: 'apiconfig'
        })
      }
    }
  };

</script>

<style>
  #tb_api {
    width: 1400px;
    text-align: left;
  }

  table tr {
    height: 30px;
  }

  /* ID */
  table tr th:first-child {
    width: 70px;
  }
  /* Name */
  table tr th:nth-child(2) {
    width: 150px;
  }
/* Method */
  table tr th:nth-child(3) {
    width: 110px;
  }
/* Validate */
  table tr th:nth-child(4) {
    width: 110px;
  }
/* Forward */
  table tr th:nth-child(5) {
    width: 110px;
  }
/* Path */
  table tr th:nth-child(6) {
    width: 200px;
  }
/* Desc */
  table tr th:nth-child(7) {
    width: 300px;
  }
/* Details */
  table tr th:nth-child(8) {
    width: 120px;
  }
/* Schema */
  table tr th:nth-child(9) {
    width: 120px;
  }
/* MockCfg */
  table tr th:nth-child(10) {
    width: 120px;
  }

</style>
