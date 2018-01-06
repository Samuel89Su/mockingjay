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
              <td><router-link :to="{ path: $route.path + '../apidetails', query: { data: JSON.stringify(item) }}">Details</router-link></td>
            </tr>
        </tbody>
    </table>
</template>

<script>
const queryString = require("querystring");

export default {
  name: "ApiList",
  data() {
    return {
      items: []
    };
  },
  mounted: function() {
    var query = queryString.stringify(this.$route.query);
    fetch("./inventory/api/list?".concat(query))
      .then(res => {
        var contentType = res.headers.get("content-type")
        console.log(contentType)
        if (!res.ok) {
          return [];
        } else if (!contentType || !contentType.includes("application/json")) {
          return [];
        } else if (contentType && contentType.includes("application/json")) {
          return res.json();
        }
      })
      .then(list => {
        if (list && list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            let app = list[i];
            this.items.push(app);
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
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
  width: 300px;
}

table tr th:nth-child(3) {
  width: 40px;
}

table tr th:nth-child(4) {
  width: 40px;
}

table tr th:nth-child(5) {
  width: 120px;
}
</style>