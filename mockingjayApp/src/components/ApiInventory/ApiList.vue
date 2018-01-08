<template>
  <table id="tb_api">
        <thead>
            <tr>
                <th>Method</th>
                <th>Path</th>
                <th>Mock</th>                
                <th>Forward</th>                
                <th>Details</th>
            </tr>
        </thead>
        <tbody>
            <tr :key="item.path" v-for="item in items">
              <td>{{ item.method }}</td>
              <td>{{ item.path }}</td>
              <td>{{ item.mock }}</td>              
              <td>{{ item.proxyCfg.bypass }}</td>
              <td><a v-on:click="goToDetails($event)" href="javascript:void(0)">Details</a></td>
            </tr>
        </tbody>
    </table>
</template>

<script>

const queryString = require('querystring')

export default {
  name: "ApiList",
  data() {
    return {
      items: []
    }
  },
  mounted: function() {
    let query = queryString.stringify(this.$route.query);
    fetch('./inventory/api/list?'.concat(query))
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
              let app = retData.data[i]
              this.items.push(app)
            }
          }
        }
      })
      .catch(error => {
        console.log(error)
      });
  },
  methods: {
    goToDetails: function(evt) {
      
      let index = evt.target.parentElement.parentElement.sectionRowIndex

      this.$store.commit({
        type: 'setDetails',
        details: this.items[index]
      })
      this.$router.push({name:'apidetails'})
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
</style>