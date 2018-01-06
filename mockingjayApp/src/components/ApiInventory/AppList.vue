<template>
    <table id="tb_app">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Desc</th>
            </tr>
        </thead>
        <tbody>
            <tr :key="item.id" v-for="item in items">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.desc }}</td>
              <td><router-link :to="{ name: 'apilist', query: { appId: item.id }}">API list</router-link></td>
            </tr>
        </tbody>
    </table>
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
          return [];
        } else if (!contentType || !contentType.includes("application/json")) {
          return [];
        } else if (contentType && contentType.includes("application/json")) {
          var list = res.json();
          console.log(list);
          return list;
        }
      })
      .then(list => {
        if (list && list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            let app = list[i];
            this.items.push({ id: app.id, name: app.name, desc: app.desc });
          }
        }
      })
      .catch(ex => {
        console.log(ex);
      });
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
  width: 300px
}

table tr th:nth-child(4) {
  width: 120px
}


</style>
